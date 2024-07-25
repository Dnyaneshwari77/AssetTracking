import React, {useContext } from "react";
import RegisterationForm from "../components/RegisterationForm";
import {
  Container,
  Typography,
  Box,
  styled,
  useMediaQuery,
} from "@mui/material";
import ImageContainer from "../components/ImageContainer";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useEffect } from "react";

const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: theme.palette.secondary.main,
}));

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
  marginTop: "auto", // Push the strip to the bottom
}));

const HeadingContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const PageTitle = styled(Typography)({
  fontWeight: "bold",
});

const FormContainer = styled(Container)(({ theme, islargescreen }) => ({
  zIndex: 99,
  display: "flex",
  justifyContent: islargescreen ? "flex-start" : "center",
  marginTop: "-60px",
  marginBottom: "50px",
  flexGrow: 1, // Allow the container to grow and fill the available space
}));

const ImageConatiner = styled(Container)(({ theme }) => ({
  zIndex: 99,
  position: "absolute",
  top: 30,
  right: 40,
}));

const FormWrapper = styled(Box)(({ theme, islargescreen }) => ({
  width: islargescreen ? "50%" : "80%",
  padding: theme.spacing(3),
  backgroundColor: "#ECEBE9",
  boxShadow: theme.shadows[3],
  borderRadius: "10px",
}));

export default function RegisterPage() {
  const islargescreen = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <PageContainer>
      <UpperStrip maxWidth="100vw">
        <HeadingContainer>
          <PageTitle variant="h3">Sign Up</PageTitle>
          <Typography variant="subtitle1">Explore more and get more</Typography>
        </HeadingContainer>
      </UpperStrip>

      <FormContainer islargescreen={islargescreen}>
        <FormWrapper islargescreen={islargescreen}>
          <RegisterationForm />
        </FormWrapper>
      </FormContainer>

      {islargescreen && (
        <ImageConatiner maxWidth="sm">
          <ImageContainer />
        </ImageConatiner>
      )}

      <DownStrip maxWidth="100vw"></DownStrip>
    </PageContainer>
  );
}
