import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    try {
      const response = await axios.get(
        "http://localhost/php/myapp/php/check_session.php",
        {
          withCredentials: true,
        }
      );
      if (response.data.authenticated) {
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to update the authenticated state when the user logs in or logs out
  const updateAuthenticated = (status) => {
    setAuthenticated(status);
  };

  return (
    <AuthContext.Provider value={{ authenticated, updateAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
