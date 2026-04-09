// CommonJS custom server: Next.js + Socket.io
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // roomId -> Map<socketId, { peerId, userName }>
  const rooms = new Map();

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, peerId, userName }) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) rooms.set(roomId, new Map());
      rooms.get(roomId).set(socket.id, { peerId, userName });

      // Notify existing participants about the newcomer
      socket.to(roomId).emit("user-joined", { peerId, userName });

      // Send newcomer the list of everyone already in the room
      const existing = [];
      rooms.get(roomId).forEach((data, sid) => {
        if (sid !== socket.id) existing.push(data);
      });
      socket.emit("existing-users", existing);

      socket.on("disconnect", () => {
        if (rooms.has(roomId)) {
          rooms.get(roomId).delete(socket.id);
          if (rooms.get(roomId).size === 0) rooms.delete(roomId);
        }
        socket.to(roomId).emit("user-left", { peerId });
      });
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
