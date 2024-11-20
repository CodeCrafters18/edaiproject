import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MorphingLoader from './MorphingLoader';
import './StorageRentalForm.css';

export default function StorageRentalForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    areaLength: '',
    areaWidth: '',
    climate: '',
    price: '',
    storageType: '',
    securityFeatures: '',
    availabilityPeriod: '',
    productImages: [], 
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude}, ${longitude}`;
  
            setFormData((prevData) => ({
              ...prevData,
              location: address,
            }));
          } catch (error) {
            console.error('Error fetching address:', error);
            alert('Could not fetch address. Please try again.');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      productImages: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      console.log("Form Data ",formData);
      const response = await axios.post(`${API_BASE_URL}/api/addstorage`, formData , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  

      if (response.status === 201) {
        navigate("/", { state: { message: response.data.message } });
        setFormData({
          areaLength: '',
          areaWidth: '',
          climate: '',
          price: '',
          storageType: '',
          securityFeatures: '',
          availabilityPeriod: '',
          productImages: [], 
        });
      } else {
        console.error('Error submitting storage form');
      }
    } catch (error) {
      console.error('Error:', error);
      // Optionally, add user-facing error handling
      alert('Failed to submit form. Please check your inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>{isSubmitting && <MorphingLoader />}{
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Rent Your Storage Space to Farmers</h2>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <div>
              <label htmlFor="areaLength">Area Length (in meters)</label>
              <input
                type="number"
                id="areaLength"
                name="areaLength"
                value={formData.areaLength}
                onChange={handleChange}
                min="1"
                max="1000"
                required
              />
            </div>
            <div>
              <label htmlFor="areaWidth">Area Width (in meters)</label>
              <input
                type="number"
                id="areaWidth"
                name="areaWidth"
                value={formData.areaWidth}
                onChange={handleChange}
                min="1"
                max="1000"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="climate">Suitable Climate</label>
            <select
              id="climate"
              name="climate"
              value={formData.climate}
              onChange={handleChange}
              required
            >
              <option value="">Select climate</option>
              <option value="cold">Cold</option>
              <option value="moderate">Moderate</option>
              <option value="hot">Hot</option>
            </select>
          </div>

          <div>
        <label htmlFor="productImages">Upload Photos</label>
        <input
          type="file"
          id="productImages"
          name="productImages"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          required
        />
            {/* Optional: Show selected file names */}
            {formData.productImages.length > 0 && (
              <div className="selected-files">
                {formData.productImages.map((file, index) => (
                  <span key={index}>{file.name}</span>
                ))}
              </div>
            )}
          </div>


          <div>
  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
    Location of Storage Space
  </label>
  <div className="flex items-center gap-2">
    <input
      type="text"
      id="location"
      name="location"
      value={formData.location}
      onChange={handleChange}
      placeholder="Enter address or fetch location"
      required
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    <button
      type="button"
      onClick={fetchLocation}
      className="locations-button"
    >
      Fetch Location
    </button>
  </div>
</div>


          <div>
            <label htmlFor="price">Price per Month (in ₹)</label>
            <div className="price-input">
              <span>₹</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="100"
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="storageType">Type of Storage</label>
            <select
              id="storageType"
              name="storageType"
              value={formData.storageType}
              onChange={handleChange}
              required
            >
              <option value="">Select storage type</option>
              <option value="warehouse">Warehouse</option>
              <option value="silo">Silo</option>
              <option value="coldStorage">Cold Storage</option>
              <option value="openYard">Open Yard</option>
            </select>
          </div>

          <div>
            <label htmlFor="securityFeatures">Security Features</label>
            <input
              type="text"
              id="securityFeatures"
              name="securityFeatures"
              value={formData.securityFeatures}
              onChange={handleChange}
              placeholder="e.g., CCTV, 24/7 guard, alarm system"
            />
          </div>

          <div>
            <label htmlFor="availabilityPeriod">Availability Period</label>
            <input
              type="text"
              id="availabilityPeriod"
              name="availabilityPeriod"
              value={formData.availabilityPeriod}
              onChange={handleChange}
              placeholder="e.g., Jan-Dec, All Year"
            />
          </div>

          <div>
            <button type="submit" className="submit-button">
              Submit Listing
            </button>
          </div>
        </form>
      </div>
    </div>}</>
  );
}
