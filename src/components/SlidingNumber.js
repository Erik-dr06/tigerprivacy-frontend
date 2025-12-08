import React, { useState, useEffect } from 'react';

const SlidingNumber = ({ 
  number, 
  padStart = false, 
  className = "", 
  duration = 1000,
  delay = 0 
}) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      animateNumber(0, number, duration);
    }, delay);

    return () => clearTimeout(timer);
  }, [number, duration, delay]);

  const animateNumber = (start, end, duration) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(start + (end - start) * easeOutCubic);
      
      setDisplayNumber(currentNumber);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayNumber(end);
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const formatNumber = (num) => {
    if (padStart && num < 10) {
      return num.toString().padStart(2, '0');
    }
    return num.toString();
  };

  return (
    <span className={`sliding-number ${className} ${isAnimating ? 'animating' : ''}`}>
      {formatNumber(displayNumber)}
    </span>
  );
};

export default SlidingNumber;
