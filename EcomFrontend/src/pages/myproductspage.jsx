import Header from "../components/Header";
import Footer from "../components/Footer";
import Myproducts from "../components/myproducts";
import React from 'react';
import Navbar from "../components/Navbar";

function MyproductsPage(){
  return (
    <>
        <Header />
        <Navbar/>
        <Myproducts/>
        <Footer />
    </>
  );
};

export default MyproductsPage;