import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from 'react-router-dom';
import styles from "../styles/Home.module.css"
import TypingAnimation from "./TypingAnimation";
import { Configuration, OpenAIApi } from "openai";

export default function Dashboard({ fetchedData }) {
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! My name is Centura. How can I help?" },
  ]);
  const [data, setData] = useState({});
  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);
  
  useEffect(() => {
    if (messageListRef.current) {
      const messageList = messageListRef.current;
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const handleError = (error) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: error && error.message // Use the custom error message when available
          ? `Error: ${error.message}`
          : "Oops! There seems to be an error. Please try again.",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!Array.isArray(messages)) {
      console.error("messages is not an array");
      return;
    }
  
    if (userInput.trim() === "") {
      return;
    }
  
    setLoading(true);
    const context = [...messages, { role: "user", content: userInput }];
    setMessages(context);
  
    try {
      const openaiApiEndpoint = `https://whispering-mesa-44331.herokuapp.com/chat/completions`;
      const systemMessage ={
        role: "system",
        content: "Speak as if you are the user's concierge"
      }
      const response = await fetch(openaiApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            systemMessage,
            ...messages,
            context,
          ],
        }),
      });
  
      const completion = await response.json();
      const responseMessage = data.choices[0].content.trim();
          setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", input: responseMessage },
    ]);
  } catch (error) {
    handleError(error);
  }

  setLoading(false);
  setUserInput("");
};
  
  
  

  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <Head>
        <title>Centura</title>
        <meta name="description" content="OpenAI interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className={styles.topnav}>
        <div className={styles.navlogo}>
        <TypingAnimation content="Welcome to Centura, your personal concierge. Ask me anything and everything!" textSize='text-2xl'/>
        </div>
        <div className={styles.navlinks}>
          {/* ... */}
          {data && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.map((item) => (
                <div key={item.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ">
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <ReactMarkdown className="prose mt-2 text-sm">
                      {item.description}
                    </ReactMarkdown>
                  </div>
                  <div className="p-4">
                    <Link to={`/dashboard/${item.id}`} className="text-blue-500 hover:text-blue-600">
                      View details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
      </div>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div
                  key={index}
                  className={
                    message.role === "user" &&
                    loading &&
                    index === messages.length - 1
                      ? styles.usermessagewaiting
                      : message.role === "assistant"
                      ? styles.apimessage
                      : styles.usermessage
                  }
                >
                  {/* Display the correct icon depending on the message type */}
                  {message.role === "assistant" ? (
                    <Image
                      src="/logo.svg"
                      alt="AI"
                      width="30"
                      height="30"
                      className={styles.boticon}
                      priority={true}
                    />
                  ) : (
                    <Image
                      src="/usericon.png"
                      alt="Me"
                      width="30"
                      height="30"
                      className={styles.usericon}
                      priority={true}
                    />
                  )}
                  <div className={styles.markdownanswer}>
                    {/* Messages are being rendered in Markdown format */}
                    <ReactMarkdown linkTarget={"_blank"}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={9999999}
                
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? "Waiting for response..." : "Type your question..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />{" "}
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
          <div className={styles.footer}>
            <p>
              Powered by{" "}
              <a href="https://openai.com/" target="_blank">
                OpenAI
              </a>
              . 
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
