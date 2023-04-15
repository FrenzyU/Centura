import React, { useState, useEffect } from "react";
import TypingAnimation from "./TypingAnimation";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import HomePage from "./HomePage";
import Dashboard from './Dashboard';
import '../styles/Home.module.css';
import "./index.css";

const firebaseConfig = {
  apiKey: "AIzaSyBIFjE5crOVags7vvDxKIcXaTyqUyT5aLw",
  authDomain: "centura-845fd.firebaseapp.com",
  projectId: "centura-845fd",
  storageBucket: "centura-845fd.appspot.com",
  messagingSenderId: "530534842768",
  appId: "1:530534842768:web:4d7d8b948c2cbe7a5c3315",
  measurementId: "G-220WLCWQ9H",
};

initializeApp(firebaseConfig);

const Logo = () => {
  return (
    <div className="mb-8">
      <TypingAnimation content="Welcome to Centura" textSize='text-2xl' />
    </div>
  );
};

const Card = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="bg-gray-700 bg-opacity-25 p-8 rounded-lg w-full sm:max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Sign in to Centura</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="block w-full py-2 px-4 mb-4 bg-gray-700 bg-opacity-25 border-none text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className="block w-full py-2 px-4 mb-4 bg-gray-700 bg-opacity-25 border-none text-white"
      />
      <button
        onClick={() => onSignIn(email, password)}
        className="block w-full py-2 px-4 mb-4 bg-blue-500 border-none text-white cursor-pointer"
      >
        Sign in
      </button>
      <a href="#" className="text-blue-500 no-underline">Forgot your password?</a>
    </div>
  );
};

const LoadingAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`flex justify-center items-center bg-black fixed top-0 bottom-0 left-0 right-0 z-10 ${isVisible ? "" : "hidden"}`}>
      <img
        src="https://usagif.com/wp-content/uploads/loading-7.gif"
        alt="Loading animation"
        className="block mx-auto"
      />
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const showError = (message) => {
    alert(`Error: ${message}`);
  };

  const handleSignIn = async (email, password) => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black p-4 box-border">
      {!isAuthenticated ? (
        <>
          <Logo />
          <Card onSignIn={handleSignIn} />
        </>
      ) : (
        <>
          <HomePage />
        </>
      )}
    </div>
  );
};

export default App;
