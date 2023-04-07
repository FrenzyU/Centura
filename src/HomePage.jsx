import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './users';
import Settings from './Settings';
import Dashboard from './Dashboard';

const HomePage = () => {
  return (
    <Router>
      <div className="min-h-screen w-full bg-black text-gray-200">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 p-4">
            <div className="text-white font-bold text-2xl mb-4">Centura</div>
            <nav>
              <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white">
                Dashboard
              </Link>
              <Link to="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                Users
              </Link>
              <Link to="/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                Settings
              </Link>
            </nav>
          </div>
          {/* Main content */}
          <div className="flex-1 p-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};


export default HomePage;
