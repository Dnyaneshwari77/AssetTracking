import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const ProtectedRoute = ({ HomePage, AdminHomePage }) => {
  // const [deviceId, setDeviceId] = useState("");
  const { user, loading, checkTokenValidity, role } = useContext(AuthContext);

  // const loadFingerprintJS = async () => {
  //   const fp = await FingerprintJS.load();
  //   const result = await fp.get();
  //   setDeviceId(result.visitorId);
  // };

  // useEffect(() => {
  //   loadFingerprintJS();
  //   checkTokenValidity(deviceId);
  // }, []);

  console.log("USer here .... ", user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && role == "admin" ? (
    AdminHomePage
  ) : user && role == "employee" ? (
    HomePage
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
