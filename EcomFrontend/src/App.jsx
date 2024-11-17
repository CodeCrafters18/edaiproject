import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUserContext, UserContextProvider } from './context/UserContextProvider';
import MorphingLoader from './components/MorphingLoader';

// Import your components
import Home from './pages/Home';
import ProductPage from './pages/Productpage';
import Authpage from './pages/Authpage';
import AdminCreateProduct from './pages/admin.createProduct';
import Productlist from './pages/Productlist';
import EditProductForm from './components/Editproductdetails';
import Checkout from './pages/Checkoutpage';
import Auth from './components/Auth';
import Orders from './pages/Orders';
import OrderToday from './pages/adminTodayorder';
import AdminOrderTodayDetail from './pages/AdminTodayOrderDetail';

// ProtectedRoute components
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useUserContext();

  if (isLoading) {
    return <MorphingLoader />;
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return <Navigate to="/authpage" replace />;
  }

  return children;
};

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) {
    return <MorphingLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/authpage" replace />;
  }
  return children;
};

// AppContent component
function AppContent() {
  const { isAuthenticated, isAdmin, isLoading, details } = useUserContext();

  if (isLoading) {
    return <MorphingLoader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage  />} />
        <Route path="/authpage" element={<Authpage  />} />
        <Route 
          path="/admin/create" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCreateProduct />
            </ProtectedRoute>
          } 
        />
        <Route path="/products/:category" element={<Productlist  />} />
        <Route 
          path="/update/:id" 
          element={
            <ProtectedRoute adminOnly={true}>
              <EditProductForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <UserProtectedRoute>
              <Checkout  />
            </UserProtectedRoute>
          }
        />
        <Route path="/mobileotp" element={<Auth />} />
        <Route 
          path="/todayorders" 
          element={
            <ProtectedRoute adminOnly={true}>
              <OrderToday  />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/:id" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrderTodayDetail  />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/:username/myorders' 
          element={
            <UserProtectedRoute>
              <Orders />
            </UserProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

// Main App component
function App() {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
}

export default App;