# Centura

Centura is a user-friendly web application for stock market enthusiasts, traders, and investors. It offers a seamless platform to search for, trade, buy, and sell stocks. With real-time updates and animated graphs, Centura provides a comprehensive solution for tracking and managing your stock portfolio.

## Features

- Search for stocks using company names or symbols
- Real-time stock data fetched from Alpaca API
- Buy, sell, and trade stocks
- Real-time updating of animated graphs to visualize stock performance
- Responsive design for optimal user experience on various devices
- Firebase Firestore database for storing user and stock data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)
- Firebase account
- Alpaca API account

### Installation

1. Clone the repository

```sh
git clone https://github.com/FrenzyU/Centura.git
```
2. Install npm packages

```sh
cd Centura
npm install
```

3. Set up your Firebase project

- Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
- Enable Firestore database
- Replace the Firebase configuration in `src/firebaseConfig.js` with your project's configuration

4. Set up your Alpaca API keys

- Get your Alpaca API key and secret key from the [Alpaca Dashboard](https://app.alpaca.markets/)
- Create a `.env` file in the root directory of the project
- Add the following environment variables:

```sh
REACT_APP_ALPACA_API_KEY=your_alpaca_api_key
REACT_APP_ALPACA_SECRET_KEY=your_alpaca_secret_key
```

5. Run the development server

```sh
npm start
```

The application should now be running on 'http://localhost:3000'

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### Licence

[MIT](https://choosealicense.com/licenses/mit/)

### Acknowledgements

- [Alpaca API](https://alpaca.markets/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
