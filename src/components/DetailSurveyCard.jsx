import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DownloadIcon from "@mui/icons-material/Download";
import { Document, Page } from "react-pdf";
import { BASE_URL } from "../utils/constant";
import PDFViewer from "./PDFViewer";

import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DetailSurveyCard = ({ survey, open, onClose }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const filePromises = survey.files.map(async (fileId) => {
          const response = await fetch(`${BASE_URL}/files/byId/${fileId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          });

          if (!response.ok) {
            throw new Error(`Error fetching file with ID: ${fileId}`);
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);

          console.log("Blob", blob);
          console.log("ObjectURL", objectUrl);
          return { objectUrl, name: fileId, blob };
        });

        const fetchedFiles = await Promise.all(filePromises);
        setFiles(fetchedFiles);
      } catch (err) {
        setError(err.message);
      }
    };

    if (open) {
      fetchFiles();
    }

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.objectUrl));
    };
  }, [survey.files, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "0px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#4B0F50",
            width: "40%",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#FFFFFF", marginBottom: "8px" }}
          >
            Media uploaded
          </Typography>
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              padding: "8px",
            }}
          >
            {error && <Typography color="error">{error}</Typography>}
            {!error && files.length > 0 && (
              <Carousel
                showArrows={true}
                showThumbs={false}
                dynamicHeight={false}
                autoPlay
                infiniteLoop
                style={{ width: "100%" }}
              >
                {files.map((file, index) => (
                  <div key={index}>
                    {file.blob.type.startsWith("image/") && (
                      <img src={file.objectUrl} alt={`Media ${index + 1}`} />
                    )}
                    {console.log("File is ", file)}
                    {file.blob.type === "application/pdf" && (
                      <div
                        style={{
                          width: "500px",
                          height: "500px",
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <PDFViewer fileUrl={file.objectUrl} />
                      </div>
                    )}
                    {/* {file.blob.type ===
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.objectUrl}`}
                        width="100%"
                        height="500px"
                        title="Excel Viewer"
                      />
                    )} */}
                    {/* {file.blob.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.objectUrl}`}
                        width="100%"
                        height="500px"
                        title="Word Viewer"
                      />
                    )} */}
                    {/* Add more conditions here for other file types */}
                  </div>
                ))}
              </Carousel>
            )}
          </Box>
          <IconButton
            sx={{
              position: "absolute",
              top: "8px",
              left: "8px",
              color: "#FFFFFF",
            }}
            onClick={() => {
              files.forEach((file) => {
                const link = document.createElement("a");
                link.href = file.objectUrl;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "60%",
            backgroundColor: "#F9F5F5",
            padding: "16px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginBottom: "16px" }}
          >
            Survey Details
          </Typography>
          <Divider sx={{ marginBottom: "16px" }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Region:</strong> {survey.region}
              </Typography>
              <Typography variant="body1">
                <strong>Time:</strong> {new Date(survey.time).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Speed:</strong> {survey.speed} m/s
              </Typography>
              <Box sx={{ marginTop: "8px" }}>
                <Typography variant="body1">
                  <strong>Remark:</strong>
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={survey.remark || ""}
                  InputProps={{
                    sx: {
                      borderColor: "#000000",
                      borderWidth: "2px",
                      "& fieldset": {
                        borderColor: "#000000",
                      },
                    },
                  }}
                />
              </Box>
              <Typography variant="body1">
                <strong>Asset Name:</strong> {survey.asset_name}
              </Typography>
              <Typography variant="body1">
                <strong>Asset Year:</strong> {survey.asset_year}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong> {survey.department}
              </Typography>
              <Typography variant="body1">
                <strong>Scheme Component:</strong> {survey.scheme_component}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Agent ID:</strong> {survey.agent_id}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {survey.status}
              </Typography>
              <Typography variant="body1">
                <strong>Asset Owner:</strong> {survey.asset_owner}
              </Typography>
              <Typography variant="body1">
                <strong>Asset Type:</strong> {survey.asset_type}
              </Typography>
              <Typography variant="body1">
                <strong>Sub Department:</strong> {survey.sub_department}
              </Typography>
              <Typography variant="body1">
                <strong>Sub Type:</strong> {survey.sub_type}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailSurveyCard;
