import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Profile Section */}
        <IconButton onClick={handleClick}>
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ mt: 1 }}
        >
          {/* User Info */}
          <Box sx={{ padding: "10px 20px", minWidth: "200px" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Sofia Rivers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              sofia.rivers@devias.io
            </Typography>
          </Box>
          <Divider />

          {/* Menu Items */}
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon
              fontSize="small"
              sx={{ marginRight: 1, color: "red" }}
            />
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
