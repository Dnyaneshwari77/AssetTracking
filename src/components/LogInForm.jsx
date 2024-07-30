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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, setLoading, loading, role, setRole, user, deviceId } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Device ID", deviceId);

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ email, password, deviceId }),
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
        setRole(role);
      }

      localStorage.setItem("assets_sub_types", data.assets_sub_types);
      localStorage.setItem("assets_sub_types", data.assets_sub_types);
      localStorage.setItem("assets_types", data.assets_types);
      localStorage.setItem("department_names", data.department_name);
      localStorage.setItem("owners_names", data.owners_name);

      if (data.password_reset == false) {
        navigate("/reset/password/");
      } else {
        setLoading(false);
        login(data.token, data.role);

        navigate("/");

        if (data.role == "admin") {
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
