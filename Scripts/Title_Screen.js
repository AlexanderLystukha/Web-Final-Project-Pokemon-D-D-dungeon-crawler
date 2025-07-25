"use strict";

let index = 0;
const text = document.getElementById("PressEnter");

const colors = [
  //array of colors for animation
  "#ffffff",
  "#000000",
];

function changeColor() {
  text.style.color = colors[index];
  index = (index + 1) % colors.length;
}

setInterval(changeColor, 250);

document.addEventListener("keydown", PressEnter);

function PressEnter(event) {
  if (event.key === "Enter") {
    document.removeEventListener("keydown", PressEnter);

    ChangeWindow();
  }
}

function ChangeWindow() {
  window.open("./pages/PlayerInfo.html");
  window.location.reload();
}
