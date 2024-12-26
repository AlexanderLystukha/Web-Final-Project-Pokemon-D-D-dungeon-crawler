"use strict";

const player = JSON.parse(localStorage.getItem("player")).name;
const character = JSON.parse(localStorage.getItem("character"));
console.log(character);
$("#Name").text(player);

const chosenEquipment = [];
const equipmentChoices = JSON.parse(localStorage.getItem("equipment"));
console.log(equipmentChoices);
const equipmentContainer = document.getElementById("equipmentChoices");

async function Main() {
  for (let choice in equipmentChoices) {
    //awaits for player choice
    let result = await DisplayChoices(
      equipmentChoices[choice],
      equipmentContainer
    );

    //once chosen remove buttons
    let buttons = Array.from(document.getElementsByTagName("button"));
    buttons.forEach((button) => {
      button.remove();
    });

    if (result === null) {
      chosenEquipment.push(equipmentChoices[choice]);
      break;
    }
    //removes the text choices
    document.getElementById("choicePrompt").remove();
    //adds choice to the players equipment
    chosenEquipment.push(result);
  }

  character.Equipment = chosenEquipment;
  console.log(character);
  localStorage.setItem("character", JSON.stringify(character));
  $("h2").text("Have fun...");
  const screen = document.getElementsByTagName("body");
  screen[0].style.opacity = 1;
  FadeScreen(screen[0], 5000);
  setTimeout(ChangeWindow, 5000);
}
//loops through all the equipment choices available for a class

//#region Random Functions
function FadeScreen(screen, duration) {
  let opacity = 1;
  let interval = 25;
  let increment = 1 / (duration / interval);

  const fade = setInterval(function () {
    opacity -= increment;

    if (opacity >= 1) {
      opacity = 1;
      clearInterval(fade);
    }

    screen.style.opacity = opacity;
  }, interval);
}

function ChangeWindow() {
  window.open("../pages/Gameplay.html");
  window.close();
}
//#endregion

//displays the buttons and text for the choice
async function DisplayChoices(choice, equipmentContainer) {
  if (choice.from.options !== undefined) {
    const choiceTag = document.createElement(`p`);
    choiceTag.textContent = choice.desc;
    choiceTag.id = "choicePrompt";
    equipmentContainer.appendChild(choiceTag);

    let count = 0;
    for (let option in choice.from.options) {
      const choiceButton = document.createElement(`button`);
      choiceButton.textContent = String.fromCharCode(97 + count);
      equipmentContainer.appendChild(choiceButton);
      count++;
    }

    return await OptionSelection(choice);
  }

  return null;
}

//returns value of the button pressed
function OptionSelection(choice) {
  return new Promise((resolve) => {
    document.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        resolve(
          choice.from.options[event.target.textContent.charCodeAt(0) - 97]
        );
      }
    });
  });
}

Main();
