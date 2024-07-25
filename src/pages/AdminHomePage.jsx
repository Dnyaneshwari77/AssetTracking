import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Box,
  ListItemText,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import { Dashboard, Menu, Logout } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import RegisterEmployee from "../components/RegisterEmployee";
import DashboardComponent from "../components/DashboardComponent"; // Import your components
import UserProfile from "../components/UserProfile"; // Import your components
import EmployeeList from "../components/EmployeeList"; // Import your components
import AuthContext from "../context/AuthContext";
import SurveyMap from "../components/SurveyMap";

const drawerWidth = 240;

const AppBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.paper,
}));

function AdminHomePage() {
  const navigate = useNavigate();
  const { role, user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  if (user == null || role !== "admin") {
    logout();
    navigate("/login");
  }

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <DashboardComponent />;
      case "RegisterEmployee":
        return <RegisterEmployee />;
      case "EmployeeList":
        return <EmployeeList />;
      case "UserProfile":
        return <UserProfile />;
      case "SurveyMap":
        return <SurveyMap />;
      default:
        return <DashboardComponent />;
    }
  };

  return (
    <div>
      <NavBar />
      <div
        style={{
          display: "flex",
          height: "auto",
          minHeight: "100vh",
          zIndex: 99,
        }}
      >
        <Box marginLeft={"56px"} flexGrow={1} style={{}}>
          <div style={{ padding: "10px", marginTop: "56px" }}>
            {renderComponent()}
          </div>
        </Box>
        <motion.div
          animate={{ width: open ? drawerWidth : 56 }}
          transition={{ duration: 0.3 }}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 64,
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            overflow: "hidden",
            zIndex: 99,
          }}
        >
          <Drawer
            variant="permanent"
            anchor="right"
            open={open}
            PaperProps={{
              style: {
                width: "100%",
                position: "absolute",
                overflow: "hidden",
                height: "100%",
              },
            }}
          >
            <div>
              <IconButton onClick={handleDrawerToggle}>
                <Menu />
              </IconButton>
            </div>
            <Divider />
            <List style={{ minHeight: "85%" }}>
              <ListItem onClick={() => setSelectedComponent("Dashboard")}>
                <ListItemIcon style={{ cursor: "pointer" }}>
                  <Dashboard />
                </ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItem>

              <ListItem
                onClick={() => setSelectedComponent("RegisterEmployee")}
              >
                <ListItemIcon style={{ cursor: "pointer" }}>
                  <AppRegistrationIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Add Employee" />}
              </ListItem>

              <ListItem onClick={() => setSelectedComponent("EmployeeList")}>
                <ListItemIcon style={{ cursor: "pointer" }}>
                  <FormatListBulletedRoundedIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Employee List" />}
              </ListItem>

              <ListItem
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedComponent("SurveyMap")}
              >
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Survey Locations" />}
              </ListItem>
              <ListItem
                onClick={() => setSelectedComponent("UserProfile")}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  bottom: "50px",
                }}
              >
                <ListItemIcon style={{ cursor: "pointer" }}>
                  <PersonIcon />
                </ListItemIcon>
                {open && <ListItemText primary="User" />}
              </ListItem>

              <ListItem
                style={{ cursor: "pointer", position: "absolute", bottom: 0 }}
                onClick={logout}
              >
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                {open && <ListItemText primary="Logout" />}
              </ListItem>
            </List>
          </Drawer>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminHomePage;
