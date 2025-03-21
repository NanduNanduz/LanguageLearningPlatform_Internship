import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow requests from the frontend
      methods: ["GET", "POST"], // Allowed HTTP methods
      credentials: true, // Allow credentials (if needed)
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io; // Return the io instance
};

export default setupSocket;
