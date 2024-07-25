// src/App.jsx
import React from "react";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./theme";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LogInPage from "./pages/LogInPage";
import NoPage from "./pages/NoPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminHomePage from "./pages/AdminHomePage";
import ResetPassword from "./components/ResetPasswordComponent";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        disableGutters
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="App">
          <BrowserRouter>
            <AuthProvider>
              {" "}
              <Routes>
                <Route path="/">
                  <Route
                    index
                    element={
                      <ProtectedRoute
                        HomePage={<HomePage />}
                        AdminHomePage={<AdminHomePage />}
                      />
                    }
                  />

                  <Route path="admin" element={<AdminHomePage />} />
                  <Route path="reset/password/" element={<ResetPassword />} />
                  <Route path="login" element={<LogInPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
