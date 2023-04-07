import React, { useState, useEffect } from "react";
import "./App.css";
import TypingAnimation from "./TypingAnimation";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import HomePage from "./HomePage";

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
    <div className="logo-container">
      <TypingAnimation text="Centura" />
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
    <div className="card">
      <h2 className="title">Sign in to Centura</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={() => onSignIn(email, password)}>Sign in</button>
      <a href="#">Forgot your password?</a>
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
    <div className={`loading-container ${isVisible ? "" : "hidden"}`}>
      <img
        src="https://usagif.com/wp-content/uploads/loading-7.gif"
        alt="Loading animation"
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
    <div className="app-container">
      {!isAuthenticated ? (
        <>
          <Logo />
          <Card onSignIn={handleSignIn} />
        </>
      ) : (
        <HomePage />
      )}
    </div>
  );
};

export default App;

