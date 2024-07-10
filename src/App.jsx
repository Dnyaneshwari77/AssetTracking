// src/App.jsx
import React from "react";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./theme";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LogInPage from "./pages/LogInPage";
import NoPage from "./pages/NoPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
                    path="/"
                    element={<ProtectedRoute element={<HomePage />} />}
                  />
                  {/* <Route path="/" element={<HomePage/>}/> */}

                  <Route path="login" element={<LogInPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
