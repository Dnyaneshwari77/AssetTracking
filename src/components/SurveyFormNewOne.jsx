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
import axios from "axios";
import { BASE_URL } from "../utils/constant";

import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const SurveyForm = () => {
  const [formValues, setFormValues] = useState({
    region: "",
    owner: "",
    department: "",
    assetType: "",
    assets: "",
    year: null,
    projectName: "",
    schemeComponent: "",
    description: "",
    status: "",
    
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [regions, setRegions] = useState([]);
  const [owners, setOwners] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);

  const { deviceId, location } = useContext(AuthContext);
  useEffect(() => {
    const regionsData = JSON.parse(localStorage.getItem("regions")) || [];
    setRegions(regionsData);
    const ownersData = JSON.parse(localStorage.getItem("owners_names")) || [];
    setOwners(ownersData);
    const departmentsData =
      JSON.parse(localStorage.getItem("department_names")) || [];
    setDepartments(departmentsData);
    const assetsData =
      JSON.parse(localStorage.getItem("assets_sub_types")) || [];
    setAssets(assetsData);
    const assetTypesData =
      JSON.parse(localStorage.getItem("assets_types")) || [];
    setAssetTypes(assetTypesData);
  }, []);

  useEffect(() => {
    if (formValues.region) {
      const ownersData = JSON.parse(localStorage.getItem("owners_names")) || [];
      setOwners(
        ownersData.filter((owner) => owner.region_name === formValues.region)
      );
    } else {
      setOwners([]);
    }
    setFormValues((prev) => ({
      ...prev,
      owner: "",
      department: "",
      assetType: "",
      assets: "",
    }));
  }, [formValues.region]);

  useEffect(() => {
    if (formValues.owner) {
      const departmentsData =
        JSON.parse(localStorage.getItem("department_names")) || [];
      setDepartments(
        departmentsData.filter((dept) => dept.owner_name === formValues.owner)
      );
    } else {
      setDepartments([]);
    }
    setFormValues((prev) => ({
      ...prev,
      department: "",
      assetType: "",
      assets: "",
    }));
  }, [formValues.owner]);

  useEffect(() => {
    if (formValues.department) {
      const assetTypesData =
        JSON.parse(localStorage.getItem("assets_types")) || [];
      setAssetTypes(
        assetTypesData.filter(
          (type) => type.department_name === formValues.department
        )
      );
    } else {
      setAssetTypes([]);
    }
    setFormValues((prev) => ({ ...prev, assetType: "", assets: "" }));
  }, [formValues.department]);

  useEffect(() => {
    if (formValues.assetType) {
      const assetsData =
        JSON.parse(localStorage.getItem("assets_sub_types")) || [];
      setAssets(
        assetsData.filter(
          (subType) => subType.asset_type_name === formValues.assetType
        )
      );
    } else {
      setAssets([]);
    }
    setFormValues((prev) => ({ ...prev, assets: "" }));
  }, [formValues.assetType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormValues({ ...formValues, year: date });
  };

  const handleReset = () => {
    setFormValues({
      region: "",
      owner: "",
      department: "",
      assetType: "",
      assets: "",
      year: null,
      projectName: "",
      schemeComponent: "",
      description: "",
      status: "",
      image: null,
    });
    setImagePreview(null);
    setImageName("");
    setError(null);
    setSuccess(null);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      const fileData = {
        name: file.name,
        preview: null,
        type: file.type,
        file: file,
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.name === file.name ? { ...f, preview: reader.result } : f
            )
          );
        };
        reader.readAsDataURL(file);

        setSelectedFiles((prevFiles) => [...prevFiles, { ...fileData }]);
      } else {
        setSelectedFiles((prevFiles) => [...prevFiles, fileData]);
      }
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");
  //   try {
  //     const formData = new FormData();

  //     console.log("Location is ", location);
  //     const data = {
  //       ...formValues,
  //       location,
  //       speed: location.speed,
  //       time: location.time,
  //     };

  //     formData.append("data", JSON.stringify(data));

  //     if (selectedFiles && selectedFiles.length > 0) {
  //       selectedFiles.forEach((file) => {
  //         formData.append("files", file);
  //       });
  //     }

  //     const response = await fetch(`${BASE_URL}/submit`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         deviceId: deviceId,
  //         "ngrok-skip-browser-warning": "69420",
  //       },
  //       body: formData,
  //     });

  //     const result = await response.json();
  //     if (response.ok) {
  //       console.log("Survey submitted successfully:", result);
  //       toast.success("Survey Uploaded");
  //     } else {
  //       console.error("Failed to submit survey:", result.error);
  //       toast.error("Failed to submit survey.");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while submitting the survey:", error);
  //     toast.error("An unexpected error occurred.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

    
      const data = {
        ...formValues,
        location,
        speed: location.speed,
        time: location.time,
      };

      // Append the data object as a JSON string
      formData.append("data", JSON.stringify(data));

      // Append files to FormData
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("files", file.file); // Ensure that file.file contains the actual File object
        });
      }

      // Make the fetch request to submit the form data
      const response = await fetch(`${BASE_URL}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          deviceId: deviceId,
          "ngrok-skip-browser-warning": "69420", 
          
        },
        body: formData,
      });

      // Handle the response
      const result = await response.json();
      if (response.ok) {
        console.log("Survey submitted successfully:", result);
        toast.success("Survey Uploaded");
      } else {
        console.error("Failed to submit survey:", result.error);
        toast.error("Failed to submit survey.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the survey:", error);
      toast.error("An unexpected error occurred.");
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
                <InputLabel id="region-label">Region</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="region"
                    value={formValues.region}
                    onChange={handleChange}
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.name} value={region.name}>
                        {region.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Owner</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="owner"
                    value={formValues.owner}
                    onChange={handleChange}
                  >
                    {owners.map((owner) => (
                      <MenuItem key={owner.owner_name} value={owner.owner_name}>
                        {owner.owner_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Department</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="department"
                    value={formValues.department}
                    onChange={handleChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.department_name}
                        value={dept.department_name}
                      >
                        {dept.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Asset Type</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="assetType"
                    value={formValues.assetType}
                    onChange={handleChange}
                  >
                    {assetTypes.map((type, index) => (
                      <MenuItem
                        key={type.asset_type_name}
                        value={type.asset_type_name}
                      >
                        {type.asset_type_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel required>Assets</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="assets"
                    value={formValues.assets}
                    onChange={handleChange}
                  >
                    {assets.map((subType, index) => (
                      <MenuItem
                        key={subType.asset_sub_type_name}
                        value={subType.asset_sub_type_name}
                      >
                        {subType.asset_sub_type_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Year</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year"]}
                    value={formValues.year}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Project Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  sx={{ borderRadius: "5px" }}
                  name="projectName"
                  value={formValues.projectName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Scheme Component</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  sx={{ borderRadius: "5px" }}
                  name="schemeComponent"
                  value={formValues.schemeComponent}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Description</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ borderRadius: "5px" }}
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Status</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Select
                    sx={{ borderRadius: "5px" }}
                    name="status"
                    value={formValues.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} sm={4}>
                <InputLabel>Upload Image</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <input
                  accept="image/*,.pdf,.jpg,.jpeg,.png,.xls,.xlsx,.mp4"
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="image-upload">
                  <Button variant="contained" component="label">
                    Upload Files
                    <input
                      type="file"
                      hidden
                      accept="image/*, .pdf, .docx, .xlsx"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </Button>
                </label>

                {selectedFiles.map((file, index) => (
                  <Box mt={2} key={index}>
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={`Preview ${index}`}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    ) : (
                      <Typography variant="body2">{file.name}</Typography>
                    )}
                  </Box>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ borderRadius: "5px", marginTop: "16px" }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    borderRadius: "5px",
                    marginTop: "16px",
                    marginLeft: "8px",
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SurveyForm;
