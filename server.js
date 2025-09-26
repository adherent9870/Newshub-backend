const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log(`DB connected to: ${con.connection.host}`);
  console.log(`DB connected on port: ${con.connection.port}`);
  console.log("DB Connection Successful");
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev; restrict later in production
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 9. Listen for custom events from clients
  socket.on("chat_message", (msg) => {
    console.log("Received:", msg);
    io.emit("chat_message", msg); // broadcast to all connected clients
  });

  // 10. Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port.....${port}`);
});
