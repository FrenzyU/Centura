import express from 'express';
import cors from 'cors';
import Alpaca from '@alpacahq/alpaca-trade-api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  );
  next();
});


const alpaca = new Alpaca({
  keyId: 'CK4Z84IQCS1XRME88SXP',
  secretKey: 'T3J45uQfxghhT1lq11EynbPT58bCFM90BLRrzwJg',
  paper: true, // Use the paper trading API (set to false for live trading)
});

// Fetch stock data for a given symbol
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const asset = await alpaca.getAsset(symbol);
    res.json(asset);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Fetch historical data for a given symbol
app.get('/api/historical-data/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const bars = await alpaca.getBars('day', symbol, { limit: 30 });
    res.json(bars);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const { messages } = req.body;
    const prompt = messages.map((message) => message.content).join('\n');
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openaiApiEndpoint = `https://api.openai.com/v1/engines/text-davinci-003/completions`;

    const response = await axios.post(
      openaiApiEndpoint,
      {
        prompt: `${prompt}\n\n`,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    const completions = response.data.choices;
    const message = completions[0].text.trim();
    res.json({ message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

