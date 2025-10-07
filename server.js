const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const Conversation = require("./models/conversationModel");
const Message = require("./models/messageModel");
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
  const { userId, name } = socket.handshake.query;
  console.log(`✅ ${name} (${userId}) connected with socket.id ${socket.id}`);

  socket.on("join_conversations", (conversationIds) => {
    conversationIds.forEach((id) => socket.join(id));
  });

  socket.on("send_message", async ({ convoId, senderId, content }) => {
    const convo = await Conversation.findById(convoId);
    if (!convo || !convo.participants.some((p) => p.toString() === senderId))
      return;

    const newMsg = await Message.create({
      conversation: convoId,
      sender: senderId,
      content,
    });

    // fetch populated message
    const populatedMsg = await Message.findById(newMsg._id)
      .populate("sender", "name email")
      .populate("conversation", "_id");

    io.to(convoId).emit("new_message", populatedMsg);
  });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port.....${port}`);
});
