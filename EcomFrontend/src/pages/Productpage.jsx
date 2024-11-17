import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import MorphingLoader from '../components/MorphingLoader';

function ProductPage() {
  const { id } = useParams(); 
  const [productData, setProductData] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;// Replace with your actual Render.com URL

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/getbyid/${id}`);
        response.data.data.id=id;
        setProductData(response.data.data); 
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  if (!productData) {
    return <MorphingLoader />;
  }

  return (
    <div>
      <Header/>
      <Navbar />
      <ProductDetail {...productData} />
      <Footer />
    </div>
  );
}

export default ProductPage;
