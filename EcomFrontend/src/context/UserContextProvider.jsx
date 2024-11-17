import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the UserContext
const UserContext = createContext();

// UserContextProvider component
 function UserContextProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/verify`, { withCredentials: true, headers: {
          'Content-Type': 'application/json',
        }});
        
        const { isAuthenticated, admin, user } = response.data.data;
        
        setIsAuthenticated(isAuthenticated);
        setIsAdmin(!!admin);
        
        if (admin) {
          setDetails(admin);
        } else if (user) {
          setDetails(user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setDetails({});
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [API_BASE_URL]);

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    isAdmin,
    setIsAdmin,
    isLoading,
    setIsLoading,
    details,
    setDetails,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
function useUserContext() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
}

export { UserContext,UserContextProvider,useUserContext };