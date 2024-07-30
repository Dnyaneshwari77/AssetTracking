import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { BASE_URL } from "../utils/constant";

// Validation Schema using Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setLoading, login, deviceId, user } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(user);
      const token = localStorage.getItem("token");
      console.log(token);
      setLoading(true);
      axios
        .put(
          `${BASE_URL}/auth/update/resetPassword`,
          { password: values.password },
          {
            headers: {
              Authorization: `Token ${token}`,
              deviceId: deviceId,
            },
          }
        )
        .then((response) => {
          console.log("Password reset successful", response.data);
          const { token, role } = response.data;
          // Update token in local storage
          localStorage.setItem("token", token);

          // Login and navigate based on role
          setLoading(false);
          login(token, role);
          navigate(role === "admin" ? "/admin" : "/");
        })
        .catch((error) => {
          console.error("Error resetting password", error);
          setLoading(false);
        });
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#470651",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          margin: "0 auto",
          height: "350px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ECEBE9",
        }}
      >
        <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
          Change your password
        </Typography>
        <Typography variant="body2" align="center" sx={{ marginBottom: 2 }}>
          Enter a new password below to change your password
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            margin="dense"
            label="New password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            id="confirmPassword"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                type="submit"
                color="primary"
                sx={{
                  marginTop: 2,
                  background: "#470651",
                  color: "white",
                  paddingRight: 5,
                  paddingLeft: 5,
                  width: "100%",
                  "&:hover": {
                    background: "#470651", // Same as background to remove hover effect
                    opacity: 1, // Ensure no opacity change on hover
                  },
                }}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
