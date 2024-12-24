"use strict";

let inventory = {}

const player = JSON.parse(localStorage.getItem("player"));
const character = JSON.parse(localStorage.getItem("character"));

const dialogueBox = document.getElementById("gameText") 

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

function showTextDialogue(dialogueIndex){
  const dialogue = TextDialog.find(dialogue => dialogue.id === dialogueIndex)
  dialogueBox.textContent = dialogue.text
  while()
}

function StartGame(){

}

const TextDialog = [
  {
    id: 1,
    text: "test",
    options: [
      {
        text: "do your mom",
        nextText: 2
      },
      {
        text: "kisses",
        nextText: 2
      }
    ]
  },
]

PopulatePlayerInfo(player, character);

let pageCount = 0;


