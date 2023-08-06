import http = require("http");
import express = require("express");
import cors = require("cors");
import morgan = require("morgan");
import WebSocket = require("ws");
import { translateText } from "./translation/gcl.translate";

// TEST
const text = `
Il a recommencé et recommencé. Pratiquement tous les ordinateurs existants furent sous son contrôle. Il ne laissait pas de trace, ne se montrait pas. Et puis, il a découvert les dialogues en direct via Internet, le téléphone, la visio-conférence, la domotique...

Le général sorti un badge et se dirigea vers l’une des portes entourées de peinture jaune. Il glissa le badge dans la fente située à droite. La porte s’ouvrit. Une dizaine de militaires armées jusqu’aux dents étaient postés derrière.`;
const target = ["en", "ru"];

translateText(text, target);

// Config
const PORT = process.env.PORT || 4444;

// HTTP & WS server
const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

app.use(cors());
app.use(morgan("tiny"));

webSocketServer.on("connection", (webSocket: WebSocket) => {
  webSocket.on("message", (message: string) => {
    console.log("received message from client...");
    webSocket.send("Echo :: " + message);
  });
  webSocket.send("Welcome to chat !!");
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Gracefull shutdown
process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections: any[] = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}
