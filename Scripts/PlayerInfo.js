"use strict";

import { Player } from "../classes/player.js";

$(document).ready(function () {
  const duration = document.getElementById("duration");
  $("#login").on("submit", function (event) {
    $("#ageErr").hide();
    $("#playerErr").hide();

    const player = document.getElementById("playerName").value;
    const age = document.getElementById("ageID").value;

    if (age < 18) {
      event.preventDefault();
      $("#ageErr").show();
    }

    if (player === "") {
      event.preventDefault();
      $("#playerErr").show();
    }

    if (age >= 18 && player != "") {
      event.preventDefault();
      const gameDuration = duration.value;
      const newPlayer = new Player(player, age, gameDuration);
      localStorage.setItem("player", JSON.stringify(newPlayer));
      console.log(newPlayer);
      SubmitSuccessful();
    }
  });
  duration.addEventListener("input", DisplayDuration);
});

function SubmitSuccessful() {
  let index = 0;

  const button = document.getElementById("SubmitBtn");

  const submitColors = [
    //array of colors for animation
    "#c9a202",
    "#d6bd02",
  ];

  function changeColor() {
    button.style.color = submitColors[index];
    button.style.borderColor = submitColors[index];
    index = (index + 1) % submitColors.length;
  }

  setInterval(changeColor, 100);

  setTimeout(function () {
    window.open("./PickCharacter.html");
    clearInterval(changeColor);
    window.close();
  }, 2000);
}

function DisplayDuration() {
  const difficultyArray = ["Baby Mode", "Easy", "Normal", "Hard", "Uh oh"];
  const newDifficulty = document.getElementById("duration").value;
  $("#difficulty").text(difficultyArray[newDifficulty - 1]);
}
