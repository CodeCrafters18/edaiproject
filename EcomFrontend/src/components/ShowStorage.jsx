import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Thermometer, Box, DollarSign, Shield, Calendar } from 'lucide-react';
import './ShowStorage.css';

export default function StorageSpaceDetail() {
  const [storageData, setStorageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); 
  
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const response = await axios.get('/api/getstorage');
        setStorageData(response.data.data.storageData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching storage data", error);
        setIsLoading(false);
      }
    };
  
    fetchStorageData();
  }, []);

  if (isLoading) {
    return <div className="loading-container">Loading storage data...</div>;
  }

  if (!storageData.length) {
    return <div className="loading-container">No storage spaces available</div>;
  }
  
  return (
    <div className="storage-grid">
      {storageData.map((storage, index) => (
        <div key={storage._id || index} className="storage-card">
          <div className="image-section">
            {storage.productImages && storage.productImages.length > 0 ? (
              <img 
                src={storage.productImages[0]} 
                alt={`${storage.storageType} storage`}
                className="storage-image"
              />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>
          
          <div className="content-section">
            <h2 className="storage-title">
              {storage.storageType ? 
                storage.storageType.charAt(0).toUpperCase() + storage.storageType.slice(1) : 
                'Storage'} Unit
            </h2>
            
            <div className="info-grid">
              <div className="info-item">
                <MapPin size={16} />
                <span>{storage.location || 'Location Not Specified'}</span>
              </div>
              
              <div className="info-item">
                <Box size={16} />
                <span>{storage.areaLength || 'N/A'} x {storage.areaWidth || 'N/A'} sq ft</span>
              </div>
              
              <div className="info-item">
                <Thermometer size={16} />
                <span>{storage.climate || 'Standard'}</span>
              </div>
              
              <div className="info-item">
                <Shield size={16} />
                <span>{storage.securityFeatures || 'Basic Security'}</span>
              </div>
              
              <div className="info-item">
                <Calendar size={16} />
                <span>{storage.availabilityPeriod || 'Available Now'}</span>
              </div>
              
              <div className="info-item price">
                <span>&#8377;{storage.price || 'N/A'}/month</span>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}