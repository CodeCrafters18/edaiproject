import React from 'react';
import './Button.css';

export const Button = ({ variant, onClick, children }) => (
  <button 
    className={`button ${variant === 'default' ? 'default' : 'outline'}`} 
    onClick={onClick}
  >
    {children}
  </button>
);
