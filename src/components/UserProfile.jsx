import React, { useState, useEffect } from "react";
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

const Input = styled("input")({
  display: "none",
});

const fetchUserProfile = async () => {
  try {
    const response = await axios.get(
      "http://192.168.150.208:3000/auth/myprofile",
      {
        headers: {
          Authorization:
            "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OThhMTBjM2Y4MWNkNDY1ZTU2ZWEwNSIsInVzZXJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImRldmljZUlkIjoiNDBiODYxNTM5ZWRlODg2Yzg1MDYzZWY3OWFlMmU1ZjEiLCJpYXQiOjE3MjE3MTA0NDIsImV4cCI6MTcyMjMxNTI0Mn0.cbCQ8IsLsUEI5Wg6EY9VC34BatG_DfhIs2RAVg0dtQc",
          deviceid: "40b861539ede886c85063ef79ae2e5f1",
        },
      }
    );
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const updateUserProfile = async (userData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/auth/update/profile`,
      userData,
      {
        headers: {
          Authorization:
            "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OThhMTBjM2Y4MWNkNDY1ZTU2ZWEwNSIsInVzZXJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImRldmljZUlkIjoiNDBiODYxNTM5ZWRlODg2Yzg1MDYzZWY3OWFlMmU1ZjEiLCJpYXQiOjE3MjE3MTA0NDIsImV4cCI6MTcyMjMxNTI0Mn0.cbCQ8IsLsUEI5Wg6EY9VC34BatG_DfhIs2RAVg0dtQc",
          deviceid: "40b861539ede886c85063ef79ae2e5f1",
        },
      }
    );
    return response.data.agent;
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        console.log("User", user);
        setProfileImage(userData.profileImage || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      employeeID: user?.employeeID || "",
      email: user?.email || "",
      resignation: user?.resignation || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      middleName: user?.middleName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      office: user?.office || "",
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

  if (!user) {
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
              {user.username}
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
                  <strong>First Name:</strong> {user.firstName}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Name:</strong> {user.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Middle Name:</strong> {user.middleName}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {user.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {user.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Office:</strong> {user.office}
                </Typography>
                <Typography variant="body1">
                  <strong>Resignation:</strong> {user.resignation}
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
