import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const ribbonStyle = {
  zIndex: "100",
  "--f": "10px",
  "--r": "15px",
  "--t": "10px",

  position: "absolute",
  inset: "var(--t) calc(-1 * var(--f)) auto auto",
  padding: "0 10px var(--f) calc(10px + var(--r))",
  clipPath: `polygon(
      0 0, 
      100% 0, 
      100% calc(100% - var(--f)), 
      calc(100% - var(--f)) 100%, 
      calc(100% - var(--f)) calc(100% - var(--f)), 
      0 calc(100% - var(--f)), 
      var(--r) calc(50% - var(--f) / 2)
    )`,
  background: "#BD1550",
  boxShadow: "0 calc(-1 * var(--f)) 0 inset #0005",
};

const getAddressFromCoordinates = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lon}&lon=${lat}`
    );
    const data = await response.json();

    console.log(data);
    return data.display_name;
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unknown address";
  }
};

const SurveyCard = ({ address, Time, Region, Department, Owner, name }) => {
  const [formattedAddress, setFormattedAddress] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Convert coordinates to an address
    const fetchAddress = async () => {
      // const [lat, lon] = address;

      const lat = address[0];
      const lon = address[1];

      console.log("Lat and lon", lat, lon);
      const addressString = await getAddressFromCoordinates(lat, lon);
      setFormattedAddress(addressString);
      console.log(addressString);
    };

    if (address && address.length === 2) {
      fetchAddress();
    }

    // Format the date
    const date = new Date(Time);
    setFormattedDate(date.toLocaleDateString());
  }, [address, Time]);

  return (
    <Card
      sx={{
        minWidth: 500,
        borderRadius: "16px",
        backgroundColor: "#32004B",
        color: "#FFFFFF",
        position: "relative",
        padding: "16px",
      }}
      style={{
        maxWidth: "500px",
        height: "200px",
        margin: "50px auto 0",
        position: "relative",
      }}
    >
      <div className="ribbon-2" style={ribbonStyle}>
        Active Status
      </div>
      <Typography
        sx={{
          fontSize: 14,
          position: "absolute",
          top: 16,
          left: 16,
        }}
        margin={"10px"}
        padding={"5px"}
      >
        {formattedDate}
      </Typography>
      {/* Decorative lines */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          height: "70%",
          width: "4px",
          backgroundColor: "#9C27B0",
          transform: "rotate(-45deg)",
          transformOrigin: "center",
          "&:before": {
            content: '""',
            position: "absolute",
            left: "8px",
            top: 0,
            height: "100%",
            width: "4px",
            backgroundColor: "#9C27B0",
          },
        }}
      />
      <CardContent
        margin={"10px"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginTop: "5px",
          padding: "10px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: "8px",
            marginTop: "10px",
          }}
        >
          {name}
        </Typography>

        {/* Asset Details */}
        <Typography>{Department}</Typography>
        <Typography>{Region}</Typography>
        <Typography>{Owner}</Typography>
        <Typography
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,

            marginLeft: "10px",
            width: "400px",
          }}
        >
          {formattedAddress}
        </Typography>
      </CardContent>
      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          top: 100,
          left: 10,
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
        }}
      />
    </Card>
  );
};

export default SurveyCard;
