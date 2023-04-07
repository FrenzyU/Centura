import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import alpaca from './AlpacaAPI';

const fetchHistoricalData = async (symbol) => {
    try {
      const data = await alpaca.getBars('day', symbol, {
        limit: 6,
      });
      return data.map((bar) => ({
        date: bar.start,
        price: bar.close,
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  };
  

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const stock = await alpaca.getAsset(search);
      if (stock.status === 'active') {
        const historicalData = await fetchHistoricalData(stock.symbol);
        setStocks((prevStocks) => [
          ...prevStocks,
          {
            ...stock,
            historicalData,
          },
        ]);
      } else {
        console.error('Stock is not active');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };
  

  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <form onSubmit={handleSearch} className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded p-2"
          placeholder="Search stock"
        />
        <button
          type="submit"
          className="rounded p-2 ml-2 bg-blue-500 text-white"
        >
          Add
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stocks.map((stock) => (
            <div key={stock.symbol} className="bg-gray-700 p-8 rounded">
                <div className="flex items-center justify-between mb-4">
                    <div className="font-semibold text-xl">{stock.name}</div>
                    <div className="text-white text-opacity-50">{stock.symbol}</div>
                </div>
                <div className="w-full h-20">
                    <ResponsiveContainer>
                        <LineChart data={stock.historicalData}>
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="rgba(255, 255, 255, 0.7)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={false}
                            />
                            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} hide />
                            <YAxis hide />
                            <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        ))}

      </div>
    </>
  );
};

export default Dashboard;





