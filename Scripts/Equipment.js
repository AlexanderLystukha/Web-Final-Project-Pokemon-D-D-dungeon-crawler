"use strict";

$(document).ready(async function () {
  const player = JSON.parse(localStorage.getItem("player")).name;
  const character = JSON.parse(localStorage.getItem("character"));
  console.log(character);
  $("#Name").text(player);

  const chosenEquipment = [];
  const equipmentChoices = JSON.parse(localStorage.getItem("equipment"));
  console.log(equipmentChoices);
  const equipmentContainer = document.getElementById("equipmentChoices");

  for (let choice in equipmentChoices) {
    let result = await DisplayChoices(
      equipmentChoices[choice],
      equipmentContainer
    );

    let buttons = Array.from(document.getElementsByTagName("button"));
    buttons.forEach((button) => {
      button.remove();
    });

    if (result === null) {
      chosenEquipment.push(equipmentChoices[choice]);
      break;
    }
    document.getElementById("choicePrompt").remove();
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
});

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

//TODO:
//make program wait for a button to be pressed

//get the text content and do [value of the ascii character] - 97
//that will give the option desired
//return the object of said object
