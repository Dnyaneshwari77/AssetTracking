import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user, loading, checkTokenValidity } = useContext(AuthContext);

  useEffect(() => {
    checkTokenValidity();
  }, []);

  console.log(user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
