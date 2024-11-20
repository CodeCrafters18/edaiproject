import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StorageSpaceDetail from '../components/ShowStorage';

const StoragePage = () => {
//   // This would typically come from an API call or your state management
//   const storageSpaces = [
//     {
//       _id: '1',
//       areaLength: 50,
//       areaWidth: 30,
//       climate: 'moderate',
//       location: 'Mumbai Central',
//       price: 5000,
//       storageType: 'warehouse',
//       securityFeatures: '24/7 surveillance, gated access',
//       productImages: ['https://content.jdmagicbox.com/v2/comp/mumbai/x5/022pxx22.xx22.180529203302.c5x5/catalogue/space-valet-sewri-mumbai-warehouse-for-household-goods-22pal7n2ax.jpg'],
//       availabilityPeriod: 'Available from July 1st',
//     },
//     // ... more storage spaces
//   ];

  return (
    <div>
    <Header/>
    <Navbar />
    <h1>FarmConnect Storage Marketplace</h1>
    <StorageSpaceDetail />
    <Footer />
  </div>
  );
}

export default StoragePage;