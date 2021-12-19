import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
  console.log("Listening on ws and http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    // 방에 입장하는 Socket.Io에서 제공하는 기본 API
    socket.join(roomName);
    console.log(socket.rooms);
    done();

    // fucntion은 마지막에 붙인다. 그렇게 하지 않으면 오류
    // Back-End에서 실행 시키는 것이 아닌 Front-End에 있는 함수를 실행시켜 주는 것이다.
    /* setTimeout(() => {
      done("hello from the backend");
    }, 15000); */

    // roomName에 있는 사람에게 전체 이벤트 발동
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      console.log(room);
      socket.to(room).emit("bye");
    });
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done(msg);
  });
});

httpServer.listen(3000, handleListen);

// const wss = new WebSocketServer({ server });
// const sockets = [];
// 없어도 ws 커넥션 연결은 됨.
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser ⭕");

//   socket.on("close", () => console.log("Disconnected to Browser ❌"));

//   socket.on("message", (message) => {
//     // console.log(message.toString());
//     const parsed = JSON.parse(message);

//     /* if (parsed.type === "new_message") {
//       sockets.forEach((each) => each.send(parsed.payload));
//     } else if (parsed.type === "nickname") {
//       console.log(parsed.payload);
//     } */
//     switch (parsed.type) {
//       case "new_message":
//         sockets.forEach((each) => each.send(`${socket.nickname}: ${parsed.payload}`));
//         break;
//       case "nickname":
//         socket["nickname"] = parsed.payload;
//         break;
//     }

//     // sockets.forEach((each) => each.send(message.toString()));
//     // socket.send(message.toString());
//   });
// });
