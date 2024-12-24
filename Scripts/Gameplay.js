"use strict";

$(document).ready(function () {
  //Gets all the images
  const player = JSON.parse(localStorage.getItem("player"));
  const character = JSON.parse(localStorage.getItem("character"));

  PopulatePlayerInfo(player, character);
});

function PopulatePlayerInfo(player, character) {
  const playerImage = document.getElementById(`playerImage`);
  console.log(player.name);
  console.log(playerImage);
  $("#playerName").text(player.name);

  for (let stat in character.stats) {
    $(`#${stat.toLowerCase()}`).text(character.stats[stat]);
  }

  const newImage = character.image;
  console.log(newImage);
  playerImage.src = newImage;
}
