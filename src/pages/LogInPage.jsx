import React, { useContext, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  styled,
  createTheme,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import ImageContainer from "../components/ImageContainer";
import LogInForm from "../components/LogInForm";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpperStrip = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  color: "#fff",
  height: "200px",
}));

const DownStrip = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  color: "#fff",
  height: "100px",
  position: "absolute",
  bottom: 0,
  width: "100%",
  zIndex: 10,
}));

const HeadingContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const PageTitle = styled(Typography)({
  fontWeight: "bold",
});

const FormImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  minHeight: "calc(100vh - 300px)", // Subtract height of UpperStrip and DownStrip
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

const FormWrapper = styled(Container)(({ theme, islargescreen }) => ({
  zIndex: 99,
  width: islargescreen ? "40%" : "80%",
  padding: theme.spacing(3),
  backgroundColor: "#ECEBE9",
  boxShadow: theme.shadows[3],
  borderRadius: "10px",
  marginTop: "-60px", // Move the form upwards
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  width: "40%",
  display: "flex",
  zIndex: 99,
  justifyContent: "flex-end",
  alignItems: "flex-start",
}));

export default function LogInPage() {
  const islargescreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const { user, role } = useContext(AuthContext);

  useEffect(() => {
    if (user && role == "employee") {
      navigate("/");
    } else if (user && role == "admin") {
      navigate("/admin");
    }
  }, [user, role]);
  return (
    <>
      <UpperStrip maxWidth="100vw">
        <HeadingContainer>
          <PageTitle variant="h3">Log In</PageTitle>
          <Typography variant="subtitle1">Explore more and get more</Typography>
        </HeadingContainer>
      </UpperStrip>

      <FormImageContainer>
        <FormWrapper islargescreen={islargescreen}>
          <LogInForm />
        </FormWrapper>
        {islargescreen && (
          <ImageWrapper>
            <ImageContainer />
          </ImageWrapper>
        )}
      </FormImageContainer>

      <DownStrip maxWidth="100vw" />
    </>
  );
}
