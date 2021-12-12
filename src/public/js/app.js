// Socket.IO 는 기본적으로 룸을 제공하기 때문에 들어오고 나가는 것이 쉽다.
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("Server is done!");
  });
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
