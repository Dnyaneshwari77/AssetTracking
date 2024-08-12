import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Badge,
} from "@mui/material";

// Component to display detailed survey information
const SurveyDetailModal = ({ survey, open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>Survey Details</DialogTitle>
    <DialogContent>
      <Typography variant="h6">Survey Description</Typography>
      <Typography variant="body1">{survey.surveyDescription}</Typography>
      <Typography variant="h6">Time</Typography>
      <Typography variant="body1">
        {new Date(survey.time).toLocaleString()}
      </Typography>
      <Typography variant="h6">Speed</Typography>
      <Typography variant="body1">{survey.speed} m/s</Typography>
      <Typography variant="h6">Coordinates</Typography>
      <Typography variant="body1">
        {survey.location.coordinates.join(", ")}
      </Typography>
      <Typography variant="h6">Altitude</Typography>
      <Typography variant="body1">{survey.location.altitude} m</Typography>
      <Typography variant="h6">Agent ID</Typography>
      <Typography variant="body1">{survey.agentId}</Typography>
      <Typography variant="h6">Files</Typography>
      <Typography variant="body1">{survey.files.length}</Typography>
      <Typography variant="h6">Remark</Typography>
      <Typography variant="body1">{survey.remark || "N/A"}</Typography>
      <Typography variant="h6">Sub Department</Typography>
      <Typography variant="body1">{survey.sub_department}</Typography>
      <Typography variant="h6">Asset Owner</Typography>
      <Typography variant="body1">{survey.asset_owner}</Typography>
      <Typography variant="h6">Asset Type</Typography>
      <Typography variant="body1">{survey.asset_type}</Typography>
      <Typography variant="h6">Sub Type</Typography>
      <Typography variant="body1">{survey.sub_type}</Typography>
      <Typography variant="h6">Asset Name</Typography>
      <Typography variant="body1">{survey.asset_name}</Typography>
      <Typography variant="h6">Status</Typography>
      <Typography variant="body1">{survey.status || "N/A"}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const SurveyCards = ({ survey }) => {
  const [openDetail, setOpenDetail] = useState(false);

  const handleOpen = () => setOpenDetail(true);
  const handleClose = () => setOpenDetail(false);

  return (
    <Grid item xs={12} sm={6} md={4} key={survey._id}>
      <Card
        style={{ position: "relative", margin: "10px 5px", cursor: "pointer" }}
        onClick={handleOpen}
      >
        <CardContent>
          <Typography variant="h6" component="div">
            {survey.asset_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {survey.surveyDescription}
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
        {survey.status && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "4px 8px",
              backgroundColor: survey.status === "active" ? "green" : "red",
              color: "white",
              borderRadius: "4px",
            }}
          >
            <Typography variant="body2">{survey.status}</Typography>
          </Box>
        )}
      </Card>

      {/* Detailed View Modal */}
      <SurveyDetailModal
        survey={survey}
        open={openDetail}
        onClose={handleClose}
      />
    </Grid>
  );
};

export default SurveyCards;
