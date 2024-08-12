import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const SimpleHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Sample survey data (Replace this with your actual data fetch)
    const fetchSurveyData = async () => {
      const sampleData = [
        {
          location: { coordinates: [73.81114386969357, 18.534545298974912] },
          speed: 10,
        },
        {
          location: { coordinates: [73.81214386969357, 18.535545298974912] },
          speed: 20,
        },
        // Add more data points as needed
      ];
      const data = sampleData.map((survey) => [
        survey.location.coordinates[1], // Latitude
        survey.location.coordinates[0], // Longitude
        survey.speed, // Intensity (or weight)
      ]);
      setHeatmapData(data);
    };

    fetchSurveyData();
  }, []);

  useEffect(() => {
    if (mapRef.current && heatmapData.length > 0) {
      if (mapRef.current.hasLayer(heatmapLayerRef.current)) {
        mapRef.current.removeLayer(heatmapLayerRef.current);
      }

      heatmapLayerRef.current = L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      }).addTo(mapRef.current);
    }
  }, [heatmapData]);

  const heatmapLayerRef = useRef(null);

  return (
    <MapContainer
      center={[18.534545298974912, 73.81114386969357]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default SimpleHeatmap;
