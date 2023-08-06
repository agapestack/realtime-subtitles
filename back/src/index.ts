import http = require("http");
import express = require("express");
import cors = require("cors");
import WebSocket = require("ws");

const PORT = process.env.PORT || 4444;

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

app.use(cors());

webSocketServer.on("connection", (webSocket: WebSocket) => {
  webSocket.on("message", (message: string) => {
    console.log("Message from client :: " + message);
    webSocket.send("Echo :: " + message);
  });
  webSocket.send("Welcome to chat !!");
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
