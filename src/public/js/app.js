const socket = io();

const welcome = document.getElementById("welcome");

const nickNameform = welcome.querySelector("form");
const roomNameForm = welcome.querySelector("form:nth-child(2)");

const room = document.getElementById("room");

room.hidden = true;
let roomName;
let hasNickname = false;

const nickname = nickNameform.querySelector("input");
const roomname = roomNameForm.querySelector("input");

function handleRoomListClick(event) {
  if(!hasNickname){
    alert("Please enter and save your nickname!");
    return
  }
  roomName = event.target.textContent
  socket.emit("enter_room", roomName, showRoom);
}

function handleRoomSubmit(event) {
  event.preventDefault();

  if(!roomname.value){
    alert("Please enter room name!");
    return
  }else if(!hasNickname){
    alert("Please enter and save your nickname!");
    return
  }

  socket.emit("enter_room", roomname.value, showRoom);
  roomName = roomname.value;
  roomname.value = "";
}

function showRoom(newCount) {
  console.log('newCount:' ,newCount);
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleNickNameSubmit(event) {
  event.preventDefault();
  if(!nickname.value){
    alert("Please enter your nickname!");
    return
  }
  socket.emit("nickname", nickname.value);
  hasNickname = true;
}

roomNameForm.addEventListener("submit", handleRoomSubmit);
nickNameform.addEventListener("submit", handleNickNameSubmit);

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  socket.emit("new_message", input.value, roomName, (msg) => {
    addMessage(`You: ${msg}`);
  });
  input.value = "";
}


socket.on("welcome", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${nickname} Joined!!`);
});

socket.on("bye", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${nickname} left!!`);
});

socket.on("new_message", addMessage);
socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length === 0){
    return;
  }
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    li.addEventListener("click", handleRoomListClick);
    roomList.append(li);
  })
});
