import React, { useState, useEffect, useContext } from "react";
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
import axios from "axios"; // Import Axios
import { BASE_URL } from "../utils/constant";
import AuthContext from "../context/AuthContext";

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
  });

  const [image, setImage] = useState(null); // State for image file
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [imageName, setImageName] = useState(""); // State for image file name
  const [error, setError] = useState(null); // State for handling errors
  const [success, setSuccess] = useState(null); // State for handling success

  const [ownersNames, setOwnersNames] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [assetsSubTypes, setAssetsSubTypes] = useState([]);
  const [assetsTypes, setAssetsTypes] = useState([]);

  const { deviceId, location } = useContext(AuthContext);
  useEffect(() => {
    const ownersNamesData = localStorage.getItem("owners_names");
    const departmentNamesData = localStorage.getItem("department_names");
    const assetsSubTypesData = localStorage.getItem("assets_sub_types");
    const assetsTypesData = localStorage.getItem("assets_types");

    if (ownersNamesData) {
      setOwnersNames(JSON.parse(ownersNamesData));
    }

    if (departmentNamesData) {
      setDepartmentNames(JSON.parse(departmentNamesData));
    }

    if (assetsSubTypesData) {
      setAssetsSubTypes(JSON.parse(assetsSubTypesData));
    }

    if (assetsTypesData) {
      setAssetsTypes(JSON.parse(assetsTypesData));
    }
  }, []);

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
    });
    setImage(null); // Reset image
    setImagePreview(null); // Reset preview
    setImageName(""); // Reset image name
    setError(null); // Reset error message
    setSuccess(null); // Reset success message
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
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
  
    // Prepare form data object
    const data = {
      ...formValues,
      location,
      speed: location.speed,
      time: location.time,
      year: formValues.year ? formValues.year.format("YYYY-MM-DD") : null, // Format date if present
    };
  
    console.log(data);
  
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("files", image);
    }
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(`${BASE_URL}/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          deviceId: deviceId,
          // Axios sets the content-type to multipart/form-data automatically when using FormData
          // "Content-Type": "multipart/form-data", 
        },
      });
  
      // Check if response is JSON
      if (response.headers["content-type"] && response.headers["content-type"].includes("application/json")) {
        const result = response.data;
        console.log(result);
        setSuccess("Form submitted successfully!");
        handleReset(); // Reset form fields
      } else {
        // Handle unexpected response type
        console.error("Unexpected response type:", response.headers["content-type"]);
        setError("Unexpected response format. Please try again.");
      }
    } catch (error) {
      // Improved error logging
      console.error("Error details:", error.response ? error.response.data : error.message);
      setError("Failed to submit form. Please try again.");
    }
  }
  

  return (
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
                  {departmentNames &&
                    departmentNames.map((element) => (
                      <MenuItem key={element.name} value={element.name}>
                        {element.name}
                      </MenuItem>
                    ))}
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
                  {ownersNames &&
                    ownersNames.map((owner) => (
                      <MenuItem key={owner.name} value={owner.name}>
                        {owner.name}
                      </MenuItem>
                    ))}
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
                  {assetsTypes &&
                    assetsTypes.map((asset) => (
                      <MenuItem key={asset.name} value={asset.name}>
                        {asset.name}
                      </MenuItem>
                    ))}
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
                  {assetsSubTypes &&
                    assetsSubTypes.map((subType) => (
                      <MenuItem key={subType.name} value={subType.name}>
                        {subType.name}
                      </MenuItem>
                    ))}
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
                  renderInput={(params) => <TextField {...params} fullWidth />}
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
  );
};

export default SurveyForm;
