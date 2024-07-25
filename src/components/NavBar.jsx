import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Icon } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IoIosLogOut } from "react-icons/io";
import { icon } from "leaflet";
import AuthContext from "../context/AuthContext";

const CustomAppBar = styled(AppBar)({
  backgroundColor: "primary.main",
});

const Title = styled(Typography)({
  flexGrow: 1,
});

const Logouticon = styled(icon)({});

export default function NavBar() {
  const { logout } = useContext(AuthContext);
  return (
    <CustomAppBar position="fixed">
      <Toolbar style={{ zIndex: 99 }}>
        <Title variant="h6">AssetTracker</Title>
        <Icon onClick={logout}>
          <IoIosLogOut />
        </Icon>
      </Toolbar>
    </CustomAppBar>
  );
}
