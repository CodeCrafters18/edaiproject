import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Myproducts from "../components/myproducts.jsx";

function MyproductsPage(){
  return (
    <>
        <Header />
        <Navbar/>
        <Myproducts />
        <Footer />
    </>
  );
};

export default MyproductsPage;