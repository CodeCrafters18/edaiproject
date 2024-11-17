import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import MorphingLoader from '../components/MorphingLoader';
import ProductCard from '../components/Productcard';
import AlertSuccessMessage from '../components/alertSuccess.jsx';
import './Home.css';
import '../App.css';

import image1 from '../assets/slider1.jpg';
import image2 from '../assets/slider2.jpg';
import image3 from '../assets/slider3.jpg';
import image4 from '../assets/slider4.jpg';

const slides = [
  { mainImage: image1 },
  { mainImage: image2 },
  { mainImage: image3 },
  { mainImage: image4 },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;// Replace with your actual Render.com URL

const Home = () => {
  const [products, setProducts] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getProductsByCategory = async (category, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/getbycategory/${category}`, {
        params: { page, limit },
      });
      return response.data.data.products;
    } catch (error) {
      console.log(`Error fetching ${category} products:`, error);
      throw error; // Rethrow the error to be caught in fetchProducts
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [haldiramProducts, g2Products] = await Promise.all([
          getProductsByCategory('Haldiram'),
          getProductsByCategory('G2')
        ]);

        const allProducts = [...haldiramProducts, ...g2Products];
        setProducts(allProducts);
      } catch (error) {
        console.log('Error fetching products: ', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);

    if (location.state && location.state.message) {
      setFlashMessage(location.state.message);
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const retryFetch = () => {
    setIsLoading(true);
    setError(null);
    // Re-run the effect to fetch products
    const fetchProducts = async () => {
      try {
        const [haldiramProducts, g2Products] = await Promise.all([
          getProductsByCategory('Haldiram'),
          getProductsByCategory('G2')
        ]);

        const allProducts = [...haldiramProducts, ...g2Products];
        setProducts(allProducts);
      } catch (error) {
        console.log('Error fetching products: ', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  };

  return (
    <>
      <Header  />
      <Navbar />
      <Slider slides={slides} />
      {flashMessage && (
        <AlertSuccessMessage
          message={flashMessage}
          onClose={() => setFlashMessage(null)}
        />
      )}
      <br />
      <div className='allcards'>
        {isLoading ? (
          <MorphingLoader />
        ) : error ? (
          <div>
            <p>{error}</p>
            <button onClick={retryFetch}>Retry</button>
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard 
              key={product._id || index}
              imageUrl={product.image}
              title={product.productName}
              description={product.description}
              currentPrice={product.price[0]}
              originalPrice={product.price[1]}
              id={product._id}
              availability={product.availability}
            />   
          ))
        ) : (
          <p>No products found. Please try again later.</p>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Home;
