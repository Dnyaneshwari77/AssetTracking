import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import MapComponent from "../components/MapComponent";
import SurveyForm from "../components/SurveyForm";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);
  return (
    <Box>
      <NavBar />
      <Box
        display="flex"
        flexDirection="column"
        alignContent="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          flexDirection={{ sm: "column", md: "row" }} // Flex column on small devices, row on medium and up
          justifyContent="space-between"
          p={2}
          minWidth={"100vw"}
          // minHeight={"500px"}
          minHeight={{ sm: "100vh", md: "500px" }}
        >
          <Box
            bgcolor="#ECEBE9"
            boxShadow={3}
            borderRadius={2}
            p={2}
            flex={1} // Allows the form to grow
            m={1} // Margin for spacing
          >
            <SurveyForm />
          </Box>
          <Box
            flex={2} // Allows the map to grow more than the form
            m={1} // Margin for spacing
            minHeight={{ sm: "900px", md: "500px" }}
          >
            <MapComponent />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
