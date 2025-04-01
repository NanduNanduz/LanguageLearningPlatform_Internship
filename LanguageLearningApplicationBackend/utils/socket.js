// import { Server } from "socket.io";

// const setupSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173", // Allow requests from the frontend
//       methods: ["GET", "POST"], // Allowed HTTP methods
//       credentials: true, // Allow credentials (if needed)
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });

//   return io; // Return the io instance
// };

// export default setupSocket;


import { Server } from "socket.io";

const setupSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://language-learning-platform-internship-yiok.vercel.app",
    "https://language-learning-platform-internship.vercel.app",
  ];

  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", socket.id, "Reason:", reason);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  // Log CORS errors
  io.engine.on("initial_headers", (headers, req) => {
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`Blocked WebSocket connection from origin: ${origin}`);
    }
  });

  return io;
};

export default setupSocket;