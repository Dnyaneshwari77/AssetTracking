// SurveyMap.js
import React, { useContext, useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import SurveyMarker from "./SurveyMarker";
import { EditControl } from "react-leaflet-draw";
import SurveyList from "./SurveyList";
import { BASE_URL } from "../utils/constant";

// Define icon options
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://img.icons8.com/?size=160&id=XieTOK4V0QEI&format=png`,
    iconSize: [40, 45],
    iconAnchor: [10, 34],
    popupAnchor: [2, -40],
  });
};

// Main component
const SurveyMap = ({
  fillterSurvey,
  setFillterSurvey,
  filterData,
  setNewFillterSurvey,
}) => {
  const [surveys, setSurveys] = useState([]);

  // const [deviceId, setDeviceId] = useState("");
  const [mapLayeres, setMapLayers] = useState([]);

  const { user, deviceId } = useContext(AuthContext);

  const fetchSurveyData = async () => {
    const response = await fetch(`${BASE_URL}/admin/survey/`, {
      method: "GET",
      headers: {
        deviceid: deviceId,
        authorization: `Token ${user.token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });
    const data = await response.json();
    console.log("Data is", data);
    return data.Surveys;
  };

  const loadSurveys = async () => {
    const surveyData = await fetchSurveyData();
    console.log(surveyData);
    setSurveys(surveyData);
  };

  useEffect(() => {
    if (deviceId) {
      loadSurveys();
    }
  }, [deviceId]);

  const fetchSurveysWithinRegion = (layers) => {
    console.log("Request co ordinates", layers);
    fetch(`${BASE_URL}/admin/survey/region/`, {
      method: "POST",
      headers: {
        deviceid: deviceId,
        authorization: `Token ${user.token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      body: JSON.stringify({ polygons: layers }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Surveys within region:", data.surveys);
        setFillterSurvey(data);
        setNewFillterSurvey(data.surveys);
      })
      .catch((error) => {
        console.error("Error fetching surveys within region:", error);
      });
  };

  const _onCreated = (e) => {
    console.log(e);
    console.log("DeviceID", deviceId);

    const { layerType, layer } = e;
    if (layerType === "polygon" || layerType === "rectangle") {
      const { _leaflet_id } = layer;

      // Get the latLngs for the polygon or rectangle
      const latlngs = layer.getLatLngs();

      // Convert latlngs to the format [lng, lat]
      const convertedLatLngs = latlngs[0].map((coord) => [
        coord.lng,
        coord.lat,
      ]);

      // Create a new map layer with the updated latlngs
      const newLayer = { id: _leaflet_id, latlngs: [convertedLatLngs] };

      // Update the state with the new layer, preserving previous layers
      setMapLayers((prevLayers) => {
        const updatedLayers = [...prevLayers, newLayer];

        console.log("Updated map layers:", updatedLayers);

        // Perform the API call with the updated layers
        fetchSurveysWithinRegion(updatedLayers);

        return updatedLayers;
      });
    }
  };

  const _onEdited = (e) => {
    const editedLayers = [];
    e.layers.eachLayer((layer) => {
      const { _leaflet_id, _latlngs } = layer;

      // Convert _latlngs to the format [lng, lat]
      const convertedLatLngs = _latlngs[0].map((coord) => [
        coord.lng,
        coord.lat,
      ]);

      editedLayers.push({ id: _leaflet_id, latlngs: [convertedLatLngs] });
    });

    setMapLayers((layers) => {
      const updatedLayers = layers.map(
        (layer) =>
          editedLayers.find((editedLayer) => editedLayer.id === layer.id) ||
          layer
      );

      console.log("Updated coordinates", updatedLayers);

      fetchSurveysWithinRegion(updatedLayers);

      return updatedLayers;
    });
  };

  const _onDeleted = (e) => {
    const deletedIds = [];
    e.layers.eachLayer((layer) => {
      const { _leaflet_id } = layer;
      deletedIds.push(_leaflet_id);
    });

    console.log("Id to be deleted", deletedIds);
    setMapLayers((layers) => {
      const updatedLayers = layers.filter(
        (layer) => !deletedIds.includes(layer.id)
      );

      fetchSurveysWithinRegion(updatedLayers);

      return updatedLayers;
    });
  };

  return (
    <>
      <MapContainer
        center={[18.534545298974912, 73.81114386969357]}
        zoom={13}
        style={{ height: "100vh", width: "100%", marginTop: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreated}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
            draw={{
              polygon: true,
              rectangle: true,
              circle: false,
              marker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            return new L.DivIcon({
              html: `<div style="width: 50px; height: 50px; border-radius: 50%; font-weight: bold; padding: 5px; text-align: center; line-height: 20px;  display: flex;
              align-items: center;
              justify-content: center;
              font-style: bold;
            background-color: #470651;
            color: white;" ><span>${count}</span></div>`,
              className: "marker-cluster",
              iconSize: L.point(40, 40, true),
            });
          }}
        >
          {surveys &&
            surveys.map((survey) => (
              <SurveyMarker
                key={survey._id}
                survey={survey}
                icon={createCustomIcon("ff0000")} // Change color as needed
              />
            ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
};

export default SurveyMap;
