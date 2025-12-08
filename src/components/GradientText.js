import React from 'react';

const GradientText = ({ 
  text, 
  className = "", 
  ...props 
}) => {
  return (
    <span 
      className={`gradient-text ${className}`}
      style={{
        display: 'inline-block',
        ...props.style
      }}
      {...props}
    >
      {text}
    </span>
  );
};

export default GradientText;
