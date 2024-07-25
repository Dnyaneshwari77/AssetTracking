import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const SurveyCards = ({ survey }) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={survey._id}>
      <Card style={{ margin: "10px 5px" }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Survey Description: {survey.surveyDescription}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time: {new Date(survey.time).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Speed: {survey.speed} m/s
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coordinates: {survey.location.coordinates.join(", ")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Altitude: {survey.location.altitude} m
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agent ID: {survey.agentId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Files: {survey.files.length}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SurveyCards;
