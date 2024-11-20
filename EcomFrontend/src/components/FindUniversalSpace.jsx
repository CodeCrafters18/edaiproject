import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MapPin, Ruler, Snowflake, Shield, ShoppingCart } from 'lucide-react';
import './FindUniversalSpace.css';

export default function StorageRentalCards() {
  const [rentals, setRentals] = useState([]);

  const addToCart = (rental) => {
    const product = {
      id: rental._id,
      title: `${rental.storageType} in ${rental.location}`,
      imageUrl: rental.productImages && rental.productImages.length > 0 ? rental.productImages[0] : '',
      price: [rental.price, rental.price],
      availability: rental.availabilityPeriod ? 'Available' : 'Limited Availability',
      qty: 1,
    };

    let cartArr = JSON.parse(Cookies.get("cart") || "[]");
    const existingProduct = cartArr.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.qty += 1;
    } else {
      cartArr.push(product);
    }

    Cookies.set("cart", JSON.stringify(cartArr), { expires: 7 });
    Cookies.set("CartbtnStatusClicked", "true", { expires: 7 });
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    const fetchStorageRentals = async () => {
      try {
        const response = await axios.get('/api/findstorage');
        setRentals(response.data.data.storageData);
      } catch (error) {
        console.error('Error fetching storage rentals:', error);
      }
    }
    fetchStorageRentals();
  }, []);

  return (
    <div className="rental-grid-unique">
      {rentals.map(rental => (
        <div key={rental._id} className="rental-card-unique">
          {rental.productImages && rental.productImages.length > 0 && (
            <div className="card-image-container-unique">
              <img 
                src={rental.productImages[0]} 
                alt={`${rental.storageType} storage`} 
                className="card-image-unique"
              />
            </div>
          )}
          
          <div className="card-content-unique">
            <div className="card-header-unique">
              <h2>{rental.storageType} Storage</h2>
              <span className="card-price-unique">${rental.price}/month</span>
            </div>

            <div className="card-details-unique">
              <div className="detail-item-unique">
                <MapPin className="detail-icon-unique" />
                <span>{rental.location}</span>
              </div>
              <div className="detail-item-unique">
                <Ruler className="detail-icon-unique" />
                <span>{rental.areaLength} x {rental.areaWidth} sq ft</span>
              </div>
              <div className="detail-item-unique">
                <Snowflake className="detail-icon-unique" />
                <span>{rental.climate || 'Standard Climate Control'}</span>
              </div>
              <div className="detail-item-unique">
                <Shield className="detail-icon-unique" />
                <span>{rental.securityFeatures || 'Basic Security'}</span>
              </div>
            </div>

            <div className="card-footer-unique">
              <div className="availability-info-unique">
                <span>Available from: {rental.availabilityPeriod || 'Immediate'}</span>
              </div>
              <button 
                className="add-to-cart-btn-unique"
                onClick={() => addToCart(rental)}
              >
                <ShoppingCart className="btn-icon-unique" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
