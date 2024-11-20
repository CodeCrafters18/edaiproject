import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StorageRentalCards from "../components/FindUniversalSpace.jsx";

export default function StorageUniversal(){
    return (<>
        <Header/>
        <Navbar/>
        <StorageRentalCards/>
        <Footer/>
    </>)
}