// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   Container,
// } from "@mui/material";
// import { io } from "socket.io-client";

// const socket = io(`${import.meta.env.VITE_API_URL}`, {
//   withCredentials: true,
// });

// // Function to generate a random color based on the username
// const getRandomColor = (name = "U") => {
//   const colors = ["#1E88E5", "#FBC02D", "#43A047", "#E53935", "#8E24AA"];
//   return colors[name.charCodeAt(0) % colors.length]; // Ensures no undefined values
// };

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchNotifications();

//     // Listen for real-time notifications from Socket.io
//     socket.on("new-notification", (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.off("new-notification");
//     };
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const token = sessionStorage.getItem("logintoken");

//       if (!token) {
//         setError("User not authenticated. Please log in.");
//         return;
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/student/notifications`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (Array.isArray(response.data)) {
//         setNotifications(response.data);
//       } else {
//         setError("Unexpected response format from server.");
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Failed to fetch notifications. Please try again.");
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Box
//         sx={{ mt: 4, backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}
//       >
//         <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
//           Notifications 🔔
//         </Typography>

//         {error && (
//           <Typography color="error" sx={{ mt: 2 }}>
//             {error}
//           </Typography>
//         )}

//         <List>
//           {notifications.length === 0 ? (
//             <Typography
//               color="textSecondary"
//               sx={{ textAlign: "center", mt: 2 }}
//             >
//               No notifications yet.
//             </Typography>
//           ) : (
//             notifications.map((notification) => (
//               <React.Fragment key={notification._id}>
//                 <ListItem
//                   sx={{ backgroundColor: "#fff", borderRadius: 2, mb: 1 }}
//                 >
//                   <ListItemAvatar>
//                     <Avatar
//                       sx={{ bgcolor: getRandomColor(notification.user?.name) }}
//                     >
//                       {notification.user?.name?.charAt(0).toUpperCase() || "A"}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={
//                       <Typography sx={{ fontWeight: "bold" }}>
//                         {notification.user?.name || "Admin"} {notification.type}
//                       </Typography>
//                     }
//                     secondary={notification.message}
//                   />
//                 </ListItem>
//                 <Divider />
//               </React.Fragment>
//             ))
//           )}
//         </List>
//       </Box>
//     </Container>
//   );
// };

// export default Notifications;



import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { io } from "socket.io-client";

// Function to generate a random color based on the username
const getRandomColor = (name = "U") => {
  const colors = ["#1E88E5", "#FBC02D", "#43A047", "#E53935", "#8E24AA"];
  return colors[name.charCodeAt(0) % colors.length];
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Socket.IO event handlers
    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setSocketError(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setSocketError("Realtime updates unavailable. Trying to reconnect...");
    });

    newSocket.on("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    fetchNotifications();

    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("new-notification");
      newSocket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("logintoken");

      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // 5 seconds timeout
        }
      );

      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError("");
    setSocketError(null);
  };

  return (
    <Container maxWidth="md">
      {/* Error Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!socketError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {socketError}
        </Alert>
      </Snackbar>

      <Box
        sx={{ mt: 4, backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Notifications 🔔
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography color="textSecondary" sx={{ textAlign: "center", mt: 2 }}>
            No notifications yet.
          </Typography>
        ) : (
          <List>
            {notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  sx={{ backgroundColor: "#fff", borderRadius: 2, mb: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ bgcolor: getRandomColor(notification.user?.name) }}
                    >
                      {notification.user?.name?.charAt(0).toUpperCase() || "A"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "bold" }}>
                        {notification.user?.name || "Admin"} {notification.type}
                      </Typography>
                    }
                    secondary={notification.message}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Notifications;