import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios"; // Import Axios

const SurveyForm = () => {
  const [formValues, setFormValues] = useState({
    subDepartment: "",
    owner: "",
    type: "",
    subType: "",
    year: null,
    projectName: "",
    schemeComponent: "",
    location: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [imageName, setImageName] = useState(""); // State for image file name
  const [error, setError] = useState(null); // State for handling errors
  const [success, setSuccess] = useState(null); // State for handling success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormValues({ ...formValues, year: date });
  };

  const handleReset = () => {
    setFormValues({
      subDepartment: "",
      owner: "",
      type: "",
      subType: "",
      year: null,
      projectName: "",
      schemeComponent: "",
      location: "",
      image: null,
    });
    setImagePreview(null); // Reset preview
    setImageName(""); // Reset image name
    setError(null); // Reset error message
    setSuccess(null); // Reset success message
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({ ...formValues, image: file });
      setImageName(file.name); // Set the image file name

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key === "image" && formValues[key]) {
        formData.append(key, formValues[key]);
      } else {
        formData.append(key, formValues[key]);
      }
    });

    try {
      const response = await axios.post("/api/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Form submitted successfully!");
      console.log(response.data);
    } catch (error) {
      setError("Failed to submit form. Please try again.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{ p: 4, bgcolor: "#f5f5f5", borderRadius: "16px" }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ paddingBottom: "13px", paddingTop: "0px" }}
        >
          Survey Form
        </Typography>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" align="center">
            {success}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Sub Department</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="subDepartment"
                    value={formValues.subDepartment}
                    onChange={handleChange}
                  >
                    <MenuItem value="department1">Department 1</MenuItem>
                    <MenuItem value="department2">Department 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Asset/Activity Owner</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="owner"
                    value={formValues.owner}
                    onChange={handleChange}
                  >
                    <MenuItem value="owner1">Owner 1</MenuItem>
                    <MenuItem value="owner2">Owner 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Asset/Activity Type</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="type"
                    value={formValues.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="type1">Type 1</MenuItem>
                    <MenuItem value="type2">Type 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Sub Type</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="subType"
                    value={formValues.subType}
                    onChange={handleChange}
                  >
                    <MenuItem value="subType1">Sub Type 1</MenuItem>
                    <MenuItem value="subType2">Sub Type 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Asset/Activity Year</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    fullWidth
                    value={formValues.year}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    sx={{
                      width: "525px",
                      borderRadius: "5px",
                      "& .MuiOutlinedInput-root": { borderRadius: "5px" },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Asset/Activity Project Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  sx={{
                    borderRadius: "5px",
                    "& .MuiOutlinedInput-root": { borderRadius: "5px" },
                  }}
                  name="projectName"
                  value={formValues.projectName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Component Of Scheme</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  sx={{
                    borderRadius: "5px",
                    "& .MuiOutlinedInput-root": { borderRadius: "5px" },
                  }}
                  name="schemeComponent"
                  value={formValues.schemeComponent}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Location</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  sx={{
                    borderRadius: "5px",
                    "& .MuiOutlinedInput-root": { borderRadius: "5px" },
                  }}
                  name="location"
                  value={formValues.location}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Upload Image</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                  />
                </Button>
                {imagePreview && (
                  <Box mt={2} display="flex" alignItems="center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        borderRadius: "8px",
                        marginRight: "16px",
                      }}
                    />
                    <Typography variant="body2">{imageName}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    width: "250px",
                    marginLeft: "90px",
                    borderRadius: "5px",
                  }}
                >
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleReset}
                  sx={{
                    width: "250px",
                    marginRight: "90px",
                    borderRadius: "5px",
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SurveyForm;
