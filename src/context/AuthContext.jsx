import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkTokenValidity = async () => {
    const token = localStorage.getItem("token");
    console.log("Checking token validity:", token);
    setLoading(true);

    if (token) {
      try {
        const response = await axios.get("http://192.168.104.208:3000/home", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log("Response:", response);
        if (response.status === 201) {
          setUser({ token });
          console.log("Token valid, user set:", { token });
        } else {
          console.log("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error checking token validity:", error);
        if (error.response && error.response.status === 403) {
          setUser(null);
          localStorage.removeItem("token");
          console.log("Token invalid, user logged out");
        } else {
          console.error("Unexpected error:", error);
        }
      }
    } else {
      console.log("No token found");
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(token);
  }, []);

  const login = (token) => {
    setUser({ token });
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, checkTokenValidity }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
