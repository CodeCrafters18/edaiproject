import React from 'react';
import AgriculturalNewsComponent from '../components/AgriculturalNewsComponent';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';


const NewsPage = () => {
    return (
        <>
        <Header/>
        <Navbar/>
        <AgriculturalNewsComponent/>
        <Footer/>
        </>
    );
};

export default NewsPage;