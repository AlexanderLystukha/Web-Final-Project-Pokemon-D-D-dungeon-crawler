"use strict";

$(document).ready(function () {
  const player = JSON.parse(localStorage.getItem("player")).name;
  const character = JSON.parse(localStorage.getItem("character"));
  $("#Name").text(player);
  DisplayChoices(character);
});

function DisplayChoices(persona) {
  const equipmentChoices = JSON.parse(localStorage.getItem("equipment"));
  console.log(equipmentChoices);
  const equipmentContainer = document.getElementById("equipmentChoices");
  equipmentChoices.forEach((choice) => {
    const choiceTag = document.createElement(`p`);
    choiceTag.textContent = choice.desc;
    equipmentContainer.appendChild(choiceTag);

    let count = 0;
    choice.from.options.forEach(() => {
      const choiceButton = document.createElement(`button`);
      choiceButton.textContent = String.fromCharCode(97 + count);
      equipmentContainer.appendChild(choiceButton);
      count++;
    });

    const choiceMade = OptionSelection(choice);
    persona.Equipment.push(choiceMade); //need to test if this actually works lol
  });
}

async function OptionSelection(choice) {
  let pendingChoice = await (() => {
    //TODO:
    //make program wait for a button to be pressed
    document.addEventListener("click", (event) => {
      if (event.target.tagName === "button") {
        return choice.from.options[event.target.textContent.charCodeAt(0) - 97];
      }
    });
    //get the text content and do [value of the ascii character] - 97
    //that will give the option desired
    //return the object of said object
  });

  return pendingChoice;
}
