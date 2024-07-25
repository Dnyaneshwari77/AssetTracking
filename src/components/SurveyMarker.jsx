import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const SurveyMarker = ({ survey, icon }) => {
  return (
    <Marker
      position={[
        survey.location.coordinates[1],
        survey.location.coordinates[0],
      ]}
      icon={icon}
    >
      <Popup>
        <strong>Description:</strong> {survey.surveyDescription}
        <br />
        <strong>Time:</strong> {new Date(survey.time).toLocaleString()}
        <br />
        <strong>Speed:</strong> {survey.speed} m/s
        <br />
        <strong>Altitude:</strong> {survey.location.altitude} m
      </Popup>
    </Marker>
  );
};

export default SurveyMarker;
