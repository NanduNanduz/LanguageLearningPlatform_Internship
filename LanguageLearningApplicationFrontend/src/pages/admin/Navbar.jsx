// import React from "react";
// import { Box, Typography, Avatar, IconButton } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// const Navbar = ({ title }) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "10px 20px",
//         backgroundColor: "#fff",
//         boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
//       }}
//     >
//       <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//         {title}
//       </Typography>
//       <Box sx={{ display: "flex", alignItems: "center" }}>
//         <IconButton>
//           <NotificationsIcon />
//         </IconButton>
//         <Avatar sx={{ marginLeft: 2 }}>
//           <AccountCircleIcon />
//         </Avatar>
//       </Box>
//     </Box>
//   );
// };

// export default Navbar;


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
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Navbar = ({ title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        {/* Notifications Icon */}
        <IconButton>
          <NotificationsIcon />
        </IconButton>

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
          <MenuItem onClick={handleClose}>
            <SettingsIcon fontSize="small" sx={{ marginRight: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <PersonIcon fontSize="small" sx={{ marginRight: 1 }} />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
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
