import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import AuthContext from "../context/AuthContext";
import { ColorRing } from "react-loader-spinner";
import { BASE_URL } from "../utils/constant";
const theme = createTheme({
  palette: {
    primary: {
      main: "#470651",
    },
  },
});

const RegistrationForm = () => {
  const { login, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    employeeID: "",
    username: "",
    resignation: "",
    phone: "",
    password: "",
    office: "",
    address: "",
    role: "",
    deviceId: "",
  });

  useEffect(() => {
    const loadFingerprintJS = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      setFormData((prevData) => ({
        ...prevData,
        deviceId: result.visitorId,
      }));
    };
    loadFingerprintJS();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Form Data here ..", formData);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast.error('Registration failed"');
        setLoading(false);
        throw new Error("Registration failed");
      } else {
        toast.success("Employee Registered Successfully");

        const data = await response.json();
        const { token } = data;
        localStorage.setItem("token", token);
        setFormData({
          firstName: "",
          lastName: "",
          middleName: "",
          email: "",
          employeeID: "",
          username: "",
          resignation: "",
          phone: "",
          password: "",
          office: "",
          address: "",
          role: "",
          deviceId: "",
        });

        setLoading(false);
        login(token);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error registering:", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? (
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#470651", "#470760", "#480651"]}
            />
          ) : (
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <TextField
                  autoComplete="mname"
                  name="middleName"
                  required
                  fullWidth
                  id="middleName"
                  label="middle Name"
                  value={formData.middleName}
                  onChange={handleChange}
                />
                <TextField
                  autoComplete="lname"
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="employeeID"
                label="Employee ID"
                name="employeeID"
                autoComplete="employeeID"
                value={formData.employeeID}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phone"
                  autoComplete="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="resignation"
                  label="Resignation"
                  name="resignation"
                  autoComplete="resignation"
                  value={formData.resignation}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                    autoComplete="role"
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                margin="normal"
                required
                fullWidth
                id="office"
                label="Office"
                name="office"
                autoComplete="office"
                value={formData.office}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                multiline
                rows={4}
                value={formData.address}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>

              {/* <Typography align="center">
                Already have an account? <Link to="/login">Log In</Link>
              </Typography> */}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegistrationForm;
