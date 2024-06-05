import http from "http";
import app from "./app";
import { config } from "./config";
import { Server as SocketIOServer } from "socket.io";
import setupSocketHandlers from "./socket";

const port = config.app.port;
const host = config.app.host;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: config.app.frontend,
    methods: ["GET", "POST"],
  },
});

setupSocketHandlers(io);

server.listen(port, () => {
  console.log(`[server]: Server is running at ${host}:${port}`);
});
