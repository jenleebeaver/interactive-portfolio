import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
}

export function TypewriterText({ text }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let isTyping = true;

    const typeNextChar = () => {
      if (!isTyping) return;
      
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        
        // Randomize typing speed for realism (50ms - 150ms)
        const nextDelay = Math.random() * 100 + 50;

        currentIndex++;
        timeoutId = setTimeout(typeNextChar, nextDelay);
      }
    };

    // Initial delay before starting to type
    timeoutId = setTimeout(typeNextChar, 800);

    return () => {
      isTyping = false;
      clearTimeout(timeoutId);
    };
  }, [text]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="whitespace-nowrap inline-flex items-baseline">
      <span>{displayedText}</span>
      <span 
        className="inline-block w-[0.4em] h-[0.9em] bg-white/90 ml-2"
        style={{ 
          opacity: showCursor ? 1 : 0, 
          transition: 'opacity 0.1s ease-in-out',
          verticalAlign: 'baseline'
        }}
      ></span>
    </span>
  );
}