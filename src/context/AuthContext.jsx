import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState();
  const [role, setRole] = useState("");
  const [location, setLocation] = useState({
    coordinates: [],
    altitude: null,
    speed: null,
    time: null,
  });
  const [error, setError] = useState(null);
  const [surveyDescription, setSurveyDescription] = useState("");
  const [files, setFiles] = useState([]);

  const checkTokenValidity = async (deviceIdnew) => {
    const token = localStorage.getItem("token");
    console.log("Checking token validity:", token);
    setLoading(true);

    if (token) {
      console.log(deviceId);
      try {
        const response = await fetch("http://192.168.104.208:3000/home", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deviceIdnew }),
        });

        console.log("Response:", response);
        if (response.status === 201) {
          setUser({ token });
          console.log("Token valid, user set:", { token });
        } else {
          setUser(null);
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

  const createDeviceID = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    setDeviceId(result.visitorId);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    createDeviceID();
    setRole(role);
    setUser(token);
    setLoading(false);
  }, []);

  const login = (token, role) => {
    setUser({ token });
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    setRole("");
    localStorage.removeItem("token");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        location,
        surveyDescription,
        files,
        role,
        deviceId,
        setFiles,
        setSurveyDescription,
        login,
        logout,
        checkTokenValidity,
        setLocation,
        setLoading,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
