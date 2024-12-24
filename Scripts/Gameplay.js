"use strict";

let inventory = {};

const player = JSON.parse(localStorage.getItem("player"));
const character = JSON.parse(localStorage.getItem("character"));

const dialogueBox = document.getElementById("gameText");
const choicesContainer = document.getElementById("optionsList");

// Populate all character info to the screen
function PopulatePlayerInfo(player, character) {
  const playerImage = document.getElementById(`playerImage`);
  $("#playerName").text(player.name);

  for (let stat in character.stats) {
    $(`#${stat.toLowerCase()}`).text(character.stats[stat]);
  }

  const newImage = character.image;
  playerImage.src = newImage;
}
// random logic for functionality

let selectedIndex = 0;

function updateSelection() {
  // Remove the 'selected' class from all items
  items.forEach((item) => item.classList.remove("selected"));
  // Add the 'selected' class to the current item
  items[selectedIndex].classList.add("selected");
}

function OptionSelection(choices) {
  return new Promise((resolve) => {
    choicesContainer.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        // Move down to the next item
        selectedIndex = (selectedIndex + 1) % choices.length; // Loop back to the top
        updateSelection();
      } else if (event.key === "ArrowUp") {
        // Move up to the previous item
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length; // Loop back to the bottom
        updateSelection();
      } else if (event.key === "Enter") {
        // Handle selection (e.g., display the selected option)
        resolve(selectedIndex);
      }
    });
  });
}

// All functions for gameplay loop
async function showTextDialogue(dialogueIndex) {
  const dialogue = TextDialogue.find(
    (dialogue) => dialogue.id === dialogueIndex
  );
  dialogueBox.textContent = dialogue.text;

  while (choicesContainer.firstChild) {
    console.log(choicesContainer.firstChild);
    choicesContainer.removeChild(choicesContainer.firstChild);
  }

  dialogue.options.forEach((option) => {
    if (showOption(option)) {
      console.log("hi");
      const optionText = document.createElement(`p`);
      optionText.innerHTML = option.text;
      optionText.classList.add(`choice`);
      choicesContainer.appendChild(optionText);
    }
  });

  selectedIndex = 0;
  const possibleChoices = document.getElementsByClassName(`choice`);
  const choice = await OptionSelection(possibleChoices);
  selectOption(choice);
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(inventory);
  // return true;
}

function selectOption(option) {
  const nextDialogueId = option.nextText;
  if (nextDialogueId <= 0) {
    return StartGame();
  }
  inv = Object.assign(inv, option.setInv);
  showTextDialogue(nextDialogueId);
}

function StartGame() {
  inventory = {};
  showTextDialogue(1);
}

const TextDialogue = [
  {
    id: 1,
    text: "test",
    options: [
      {
        text: "do your mom",
        setInv: { loveOfMom: true },
        nextText: 2,
      },
      {
        text: "kisses",
        nextText: 2,
      },
    ],
  },
  {
    id: 2,
    text: "omg so awesome sauce",
    options: [
      {
        text: "go ron mimi",
        requiredState: (currentInv) => currentInv.loveOfMom,
        setInv: { pillow: true },
        nextText: 3,
      },
      {
        text: "grinding hour",
        nextText: 3,
      },
    ],
  },
];

PopulatePlayerInfo(player, character);
StartGame();
let pageCount = 0;
