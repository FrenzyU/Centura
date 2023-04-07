// src/HomePage.jsx
import React from "react";

const HomePage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <header className="bg-white text-black py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-2xl">Stock Page</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-black">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-black">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-black">
                  Pricing
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto mt-12">
        <h2 className="text-4xl font-semibold mb-6">Welcome to the Homepage!</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="bg-white text-black p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">Stock {i + 1}</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                nisl eros, pulvinar facilisis justo mollis, auctor consequat
                urna.
              </p>
            </div>
          ))}
        </section>
      </main>
      <footer className="bg-white text-black py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Stock Page. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
