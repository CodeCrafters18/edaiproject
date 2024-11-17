import React from 'react';
import axios from 'axios';

function Myproducts(){
  const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
    const myproducts = async () => {   
        const response = await axios.get(`${API_BASE_URL}/api/myproducts`);
        console.log("hello world");
        console.log(response.data);
    }
  return (
    <div>
      <h1>Hello world</h1>
      <button onClick={myproducts}>Click me</button>
    </div>
  );
};

export default Myproducts;