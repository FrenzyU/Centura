import React, { useState, useEffect } from 'react';

const TypingAnimation = ({ content, textColor = 'text-white', textSize = 'text-xl' }) => {
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
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [contentIndex, content]);

  return (
    <div className={`typing-animation ${textColor} ${textSize}`}>
      {displayedContent}
    </div>
  );
};

export default TypingAnimation;

