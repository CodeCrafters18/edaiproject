import React from 'react';
import axios from 'axios';

 function Myproducts(){
  const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
    const myproducts11 = async () => {   
    try {
      const response = await axios.get(`${API_BASE_URL}/api/myproducts`,{'Content-Type': 'application/json'});
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  return (
    <div>
      <h1>Hello world</h1>
      <h2>Myproducts</h2>
      <p>Click the button to view the products</p>
      <br/>
      <button onClick={myproducts11}>Click me</button>

    </div>
  );
}};

export default Myproducts;