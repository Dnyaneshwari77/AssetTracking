import React, { useState, useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AuthContext from "../context/AuthContext";

const bigIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/3710/3710297.png",
  iconRetinaUrl: "https://cdn-icons-png.flaticon.com/128/3710/3710297.png",
  iconSize: [50, 82],
  iconAnchor: [25, 82],
  popupAnchor: [0, -76],
});

const LocateUser = ({ setLoading, setLocationData }) => {
  const map = useMapEvents({
    locationfound: (e) => {
      const { latitude, longitude, altitude, speed, timestamp } = e;
      const locationData = {
        coordinates: [longitude, latitude],
        altitude: altitude || 0,
        speed: speed || 0,
        time: new Date(timestamp).toISOString(),
      };

      const radius = e.accuracy / 2;
      L.marker(e.latlng, { icon: bigIcon })
        .addTo(map)
        .bindPopup(
          `  <div>
              <b> You are within ${radius} meters from this point</b>
                <div>You are here.</div>
                <div>Latitude: ${latitude} meters</div>
                <div>Logitude: ${longitude} m/s</div>

              </div>
             `
        )
        .openPopup();
      // <img src="https://imgs.search.brave.com/lWBUnCHMil_2KEHZNW3oEivWP2sm4EcN51WNRg2_PZ8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z2FkZ2V0YnJpZGdl/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wNy93aGVy/ZWlzdGhlcGljdHVy/ZS5qcGc" style={{maxWidth:"20px",height="50px"}}/>

      setLocationData(locationData);
      setLoading(false);
    },
    locationerror: () => {
      console.log("Location access denied.");
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    map.locate({
      setView: true,
      maxZoom: 16,
    });
  }, [map, setLoading]);

  return null;
};

const MapComponent = () => {
  const { location, setLocation } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude, altitude, speed, timestamp } =
            position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          setCurrentAddress(data.display_name);

          setLocation({
            coordinates: [longitude, latitude],
            altitude: altitude || 0,
            speed: speed || 0,
            time: new Date(timestamp).toISOString(),
          });

          console.log(data);
          console.log("Location updated", location);
        });
      }
    };

    getCurrentLocation();
    console.log("Current Address:", currentAddress);
  }, []);

  useEffect(() => {
    if (location.coordinates.length > 0) {
      console.log("Location Data: ", location);
    }
  }, [location]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        zIndex: 10,
      }}
      className="box-shadow"
    >
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -99,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{
            loading: () => setLoading(true),
            load: () => setLoading(false),
          }}
        />
        <LocateUser setLoading={setLoading} setLocationData={setLocation} />

        {console.log(location.coordinates)}
        {location.coordinates.length > 0 && (
          <Marker position={location.coordinates} icon={bigIcon}>
            <Popup height={"200px"}>{console.log(location)}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
