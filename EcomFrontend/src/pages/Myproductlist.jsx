import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css'
import ProductCard from '../components/Productcard';
import Navbar from '../components/Navbar';
import MorphingLoader from '../components/MorphingLoader';

const Myproductlist = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const productsPerPage = 10;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/getMyproducts`, {
                    params: {
                      page: currentPage,
                      limit: productsPerPage
                    },
                    withCredentials: true, // Include credentials such as cookies
                  });
                setProducts(response.data.data);
                setTotalPages(2);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, [category, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <Header />
            <Navbar />
            <div className='allcards11'>
                {isLoading ? (
                    <MorphingLoader />
                ) : products.length > 0 ? (
                    products.map((product, index) => (
                        <React.Fragment key={product._id}>
                            <ProductCard 
                                imageUrl={product.image}
                                title={product.productName}
                                description={product.description}
                                currentPrice={product.price[0]}
                                originalPrice={product.price[1]}
                                id={product._id}
                                availability={product.availability}
                                verify={true}
                                owner={product.owner}
                            />   
                        </React.Fragment>
                    ))
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>{`Page ${currentPage} of ${totalPages}`}</span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}<br />
            <Footer />
        </>
    );
}

export default Myproductlist;