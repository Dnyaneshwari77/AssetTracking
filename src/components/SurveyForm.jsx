import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import Box from "@mui/material/Box";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { BASE_URL } from "../utils/constant";

export default function SurveyForm() {
  const {
    location,
    logout,
    surveyDescription,
    setSurveyDescription,
    files,
    setFiles,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  console.log("Location ", location);

  const navigate = useNavigate();

  useEffect(() => {
    const loadFingerprintJS = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    loadFingerprintJS();
  }, []);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    const formData = new FormData();

    const data = {
      surveyDescription,
      location,
      speed: location.speed,
      time: location.time,
    };

    formData.append("data", JSON.stringify(data));

    files.forEach((file) => {
      formData.append("files", file);
    });

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/submit/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          deviceId: deviceId,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        // Reset form fields
        setSurveyDescription("");

        // setSpeed("");
        setFiles([]);
      } else if (response.status == 403) {
        logout();
        navigate("login");
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <Container style={{ padding: "10px" }}>
      <Typography variant="h4" gutterBottom>
        Survey Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextareaAutosize
          fullWidth
          minRows={10}
          placeholder="Survey Description"
          style={{ margin: "16px 0", width: "100%", padding: "10px" }}
          value={surveyDescription}
          onChange={(e) => setSurveyDescription(e.target.value)}
        />

        <div style={{ margin: "16px 0" }}>
          <input
            type="file"
            onChange={handleFileChange}
            accept="*/*"
            multiple // Allow multiple files
            style={{
              display: "none", // Hide the default file input
            }}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#470660",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#470660")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#470651")
            }
          >
            Upload Files
          </label>
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          style={{ marginTop: "10px" }}
          disabled={loading} // Disable the button when loading
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Container>
  );
}
