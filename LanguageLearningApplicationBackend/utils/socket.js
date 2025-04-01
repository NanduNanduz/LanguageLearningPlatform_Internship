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
  // Render-specific allowed origins
  const allowedOrigins = [
    "https://languagelearningplatform-frontend.onrender.com", // Production frontend
    "https://languagelearningplatform-internship.onrender.com", // Production backend
    "http://localhost:5173", // Local development
  ];

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server)
        if (!origin) return callback(null, true);

        // Protocol-agnostic origin check
        const isAllowed = allowedOrigins.some(
          (allowedOrigin) =>
            origin === allowedOrigin ||
            origin.startsWith(allowedOrigin.replace("https://", "http://"))
        );

        if (isAllowed) {
          return callback(null, true);
        }

        console.error(`WebSocket CORS blocked: ${origin}`);
        return callback(new Error("Not allowed by CORS"), false);
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
    },
    // Render-specific WebSocket configuration
    transports: ["websocket"],
    pingInterval: 25000, // 25s (under Render's 30s timeout)
    pingTimeout: 5000,
    connectionStateRecovery: {
      maxDisconnectionDuration: 120000, // 2 minutes
      skipMiddlewares: true,
    },
    allowEIO3: true, // Socket.io v2/v3 compatibility
  });

  // Connection handling
  io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] Connected: ${socket.id}`);
    console.log("Socket Headers:", socket.handshake.headers);

    // Heartbeat monitoring
    socket.on("ping", (cb) => {
      if (typeof cb === "function") {
        cb();
      }
    });

    // Custom error handling
    socket.on("error", (err) => {
      console.error(`Socket Error (${socket.id}):`, err);
    });

    // Disconnection handling
    socket.on("disconnect", (reason) => {
      console.log(
        `[${new Date().toISOString()}] Disconnected: ${socket.id} (${reason})`
      );

      // Render-specific: Attempt reconnection if unexpected disconnect
      if (reason === "transport close") {
        console.log("Attempting reconnection...");
      }
    });

    // Custom events can be added here
  });

  // Engine-level monitoring
  io.engine.on("initial_headers", (headers, req) => {
    headers["X-Socket-Server"] = "Render-1.0";
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`Potential CORS violation attempt from: ${origin}`);
    }
  });

  io.engine.on("connection_error", (err) => {
    console.error("WebSocket Engine Error:", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  // Render-specific process handling
  process.on("SIGTERM", () => {
    console.log("Closing WebSocket connections gracefully...");
    io.close(() => {
      console.log("WebSocket server closed");
      process.exit(0);
    });
  });

  return io;
};

export default setupSocket;