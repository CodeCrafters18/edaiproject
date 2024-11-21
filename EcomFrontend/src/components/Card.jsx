import React from 'react';
import './Card.css';

export const Card = ({ children }) => (
  <div className="card">{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="card-header">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="card-title">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);