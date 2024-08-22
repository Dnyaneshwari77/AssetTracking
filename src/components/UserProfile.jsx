import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Cancel } from "@mui/icons-material";
import { BASE_URL } from "../utils/constant";
import AuthContext from "../context/AuthContext";

const Input = styled("input")({
  display: "none",
});

const UserProfile = () => {
  const [userDatafromAPI, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const { user, deviceId } = useContext(AuthContext);

  const updateUserProfile = async (userData) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/auth/update/profile`,
        userData,
        {
          headers: {
            Authorization: `
              Token ${user.token}`,
            deviceid: deviceId,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log("User profile updated successfully");
      return response.data.agent;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/myprofile`, {
        headers: {
          Authorization: `Token ${user.token}`,
          deviceid: deviceId,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      console.log(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        console.log("User", userDatafromAPI);
        // setProfileImage(userData.profileImage || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: userDatafromAPI?.username || "",
      employeeID: userDatafromAPI?.employeeID || "",
      email: userDatafromAPI?.email || "",
      resignation: userDatafromAPI?.resignation || "",
      firstName: userDatafromAPI?.firstName || "",
      lastName: userDatafromAPI?.lastName || "",
      middleName: userDatafromAPI?.middleName || "",
      phone: userDatafromAPI?.phone || "",
      address: userDatafromAPI?.address || "",
      office: userDatafromAPI?.office || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      employeeID: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      resignation: Yup.string().required("Required"),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      phone: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      // Handle form submission

      handleSubmit(values);
      console.log("Form values:", values);
      setEditMode(false);
    },
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const updatedprofile = await updateUserProfile(values);
      // Optionally, update local state or notify user of success

      console.log("update profile is ==", updatedprofile);
      setUser(updatedprofile);
      setEditMode(false);
    } catch (error) {
      // Handle error or notify user of failure
      console.error("Failed to update profile:", error);
    }
  };

  if (!userDatafromAPI) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Avatar
              src={profileImage}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            {editMode && (
              <label htmlFor="profileImageUpload">
                <Input
                  accept="image/*"
                  id="profileImageUpload"
                  type="file"
                  onChange={handleImageChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  style={{ display: "block", margin: "10px auto" }}
                >
                  Upload Image
                </Button>
              </label>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Typography variant="h4" gutterBottom>
              {userDatafromAPI.username}
            </Typography>
            {editMode ? (
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="middleName"
                      name="middleName"
                      label="Middle Name"
                      value={formik.values.middleName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.middleName &&
                        Boolean(formik.errors.middleName)
                      }
                      helperText={
                        formik.touched.middleName && formik.errors.middleName
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.phone && Boolean(formik.errors.phone)
                      }
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      name="address"
                      label="Address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="office"
                      name="office"
                      label="Office"
                      value={formik.values.office}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="resignation"
                      name="resignation"
                      label="Resignation"
                      value={formik.values.resignation}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.resignation &&
                        Boolean(formik.errors.resignation)
                      }
                      helperText={
                        formik.touched.resignation && formik.errors.resignation
                      }
                    />
                  </Grid>
                </Grid>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                  style={{ marginTop: "20px" }}
                >
                  Save
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  type="text"
                  startIcon={<Cancel />}
                  style={{ marginTop: "20px" }}
                  onClick={() => setEditMode(false)}
                >
                  Cancle
                </Button>
              </form>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>First Name:</strong> {userDatafromAPI.firstName}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Name:</strong> {userDatafromAPI.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Middle Name:</strong> {userDatafromAPI.middleName}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {userDatafromAPI.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {userDatafromAPI.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {userDatafromAPI.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Office:</strong> {userDatafromAPI.office}
                </Typography>
                <Typography variant="body1">
                  <strong>Resignation:</strong> {userDatafromAPI.resignation}
                </Typography>
                <IconButton onClick={handleEditClick}>
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
