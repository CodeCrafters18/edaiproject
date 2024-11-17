import StorageRentalForm from "../components/StorageRentalForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function StorageSpace(){
    return (<>
        <Header/>
        <Navbar/>
        <StorageRentalForm/>
        <Footer/>
    </>)
}