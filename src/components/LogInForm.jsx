import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Link, useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";

import {
  TextField,
  Button,
  Box,
  Container,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";

import AuthContext from "../context/AuthContext";
import { BASE_URL } from "../utils/constant";

const theme = createTheme({
  palette: {
    primary: {
      main: "#470651",
    },
  },
});

const LogInForm = () => {
  // Removed async here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, setLoading, loading, role, setRole, user, deviceId } =
    useContext(AuthContext);

  const getOS = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown";
  };

  const getLocation = async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          resolve("Unknown");
        }
      );
    });
  };

  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      return "smartphone";
    } else if (width <= 1200) {
      return "tablet";
    } else {
      return "laptop/desktop";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Device ID", deviceId);

    const location = await getLocation(); // Moved inside handleSubmit

    let deviceDetails = {
      device: getDeviceType(),
      location: location,
      model: "Unknown Model",
      time: new Date().toISOString(),
      imei: "unique number", // Replace with actual unique ID
      os: getOS(),
    };

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          email,
          password,
          deviceId,
          deviceDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Login failed. Please check your credentials and try again."
        );
      }

      const data = await response.json();

      console.log("Data here ", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setEmail("");
        setPassword("");
      }

      if (data.role) {
        setRole(data.role); // Use the role from the API response
      }

      localStorage.setItem("owners_names", JSON.stringify(data.owners_name));
      localStorage.setItem(
        "department_names",
        JSON.stringify(data.department_name)
      );
      localStorage.setItem(
        "assets_sub_types",
        JSON.stringify(data.assets_sub_types)
      );
      localStorage.setItem("assets_types", JSON.stringify(data.assets_types));
      localStorage.setItem("regions", JSON.stringify(data.regions));
  
      
      if (data.password_reset === false) {
        navigate("/reset/password/");
      } else {
        setLoading(false);
        login(data.token, data.role);
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
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
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Log In
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 3 }}
                onSubmit={handleSubmit}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mt: 2 }}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
              </Box>

              <Typography>
                Create a new account | <Link to="/register">Register</Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LogInForm;
