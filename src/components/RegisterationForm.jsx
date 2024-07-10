import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#470651",
    },
  },
});

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);
    try {
      const response = await fetch(
        "http://192.168.104.208:3000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      // Assuming the response includes a token
      const { token } = data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Reset form after successful registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        address: "",
      });

      // Handle any other actions after registration (e.g., redirect)
      console.log("Registration successful:", data.message);
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
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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

            <Typography align="center">
              Alredy have an account ? | <Link to="/login">Log In</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegistrationForm;
