import React from 'react';
import { useEffect,useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Authcomponent from '../components/Authentication';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertFailureMessage from '../components/alertFailure.jsx';

function Authpage(){
  const navigate = useNavigate();
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState(null);
  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
    if (location.state && location.state.message) {
      setFlashMessage(location.state.message);
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);
  return (
    <>
        <Header/>
        {flashMessage && (
        <AlertFailureMessage
          message={flashMessage}
          onClose={() => setFlashMessage(null)}
        />
      )}
        <Navbar/>
        <Authcomponent/>
        <Footer/>
    </>
  );
};

export default Authpage;