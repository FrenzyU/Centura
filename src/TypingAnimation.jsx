import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

const TypingAnimation = ({ content, textStyle }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [contentIndex, setContentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentIndex < content.length) {
        setDisplayedContent(content.slice(0, contentIndex + 1));
        setContentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearTimeout(timer);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [contentIndex, content]);

  return (
    <div className="typing-animation" style={textStyle}>
      {displayedContent}
    </div>
  );
};

export default TypingAnimation;
