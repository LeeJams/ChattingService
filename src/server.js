import http from "http";
import { WebSocketServer } from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on ws and http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

// 없어도 ws 커넥션 연결은 됨.
wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log(sockets);
  console.log("Connected to Browser ⭕");

  socket.on("close", () => console.log("Disconnected to Browser ❌"))

  socket.on("message", (message) => {
    sockets.forEach(each => each.send(message.toString()));
    // socket.send(message.toString());
  })
})

server.listen(3000, handleListen);
