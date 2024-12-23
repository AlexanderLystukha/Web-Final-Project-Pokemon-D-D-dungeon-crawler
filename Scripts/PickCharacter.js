"use strict";

import { Character } from "../classes/character.js";

$(document).ready(function () {
  //Gets all the images
  const Images = document.querySelectorAll("img");
  const Classes = Array.from(document.getElementsByClassName("Class"));
  const Races = Array.from(document.getElementsByClassName("Race"));
  let selectedClass,
    selectedRace,
    characterCreated = false;
  let index = 0;
  /* Lazy Loading Images observer */
  LazyLoadImages(Images);

  SelectCharacteristic(Classes, function (selectionName) {
    selectedClass = selectionName;
  });
  SelectCharacteristic(Races, function (selectionName) {
    selectedRace = selectionName;
  });

  setInterval(() => {
    CreateCharacter(selectedClass, selectedRace, characterCreated);

    if (
      selectedClass != undefined &&
      selectedRace != undefined &&
      !characterCreated
    ) {
      const playerContainer = document.getElementById("PlayerContainer");
      characterCreated = true;
      const ready = document.createElement(`p`);
      ready.textContent = "Please press enter to start!";
      ready.style.color = " #c9a202";

      playerContainer.appendChild(ready);

      const colors = [
        //array of colors for animation
        "#c9a202",
        "#000000",
      ];

      function changeColor() {
        ready.style.color = colors[index];
        index = (index + 1) % colors.length;
      }

      setInterval(changeColor, 250);

      document.addEventListener("keydown", (event) => {
        PressEnter(event, selectedClass);
      });
    }
  }, 250);
});

function SelectCharacteristic(characteristics, callback) {
  characteristics.forEach((characteristic) => {
    characteristic.addEventListener("click", function () {
      characteristics.forEach((image) => {
        image.style.borderColor = "rgb(255, 255, 255)";
      });

      characteristic.style.borderColor = "rgb(214, 189, 2)";

      const imageUrl = characteristic.src;
      const selectionName = imageUrl //gets url of image clicked
        .split("/") //splits at the slashes
        .pop() //isolates the last part of the url (ex: fighter.png)
        .split(".") //splits the last part at the .
        .slice(0, -1) //removes the extension
        .join("."); //creates a string out of the array without the extension

      callback(selectionName);
    });
  });
}

function CreateCharacter(SelectedClass, SelectedRace) {
  const player = JSON.parse(localStorage.getItem("player"));

  if (SelectedClass != undefined && SelectedRace != undefined) {
    const playerImage = document.getElementById(`playerImage`);
    playerImage.src = `../public/Characters/${SelectedRace}-${SelectedClass}.png`;

    const playerGameName = document.getElementById(`characterName`);
    playerGameName.textContent = `${player.name}, a ${SelectedRace} ${SelectedClass}`;
  }
}

function LazyLoadImages(images) {
  const observerIMG = new IntersectionObserver((entries, observerIMG) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //TODO: make a check thing to see if the image exists
        const img = entry.target;

        img.src = img.dataset.src;

        observerIMG.unobserve(img);
      }
    });
  });

  images.forEach((image) => observerIMG.observe(image));
}

function PressEnter(event, className) {
  if (event.key === "Enter") {
    document.removeEventListener("keydown", PressEnter);

    const stats = {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    };

    GetCharacterThings(className, stats);

    const screen = document.getElementsByTagName("body");
    screen[0].style.opacity = 1;
    FadeScreen(screen[0], 5000);
    setTimeout(ChangeWindow, 5000);
  }
}

function ChangeWindow() {
  window.open("../pages/Equipment.html");
  window.close();
}

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

function GetRandomInt(min, max) {
  const minNum = Math.ceil(min);
  const maxNum = Math.floor(max);
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}

function CheckValidSpellForLevel(spell) {
  if (spell.level <= 3) {
    return spell;
  }
}

async function GetCharacterThings(className, stats) {
  const classInfo = await fetch(
    `https://www.dnd5eapi.co/api/classes/${className}`
  );
  const classData = await classInfo.json();

  FetchSpells(classData).then((spells) => {
    GenerateStats(stats);
    const character = new Character(className, spells, stats);
    localStorage.setItem("character", JSON.stringify(character));
    localStorage.setItem(
      "equipment",
      JSON.stringify(classData.starting_equipment_options)
    );
  });
}

async function FetchSpells(classData) {
  const hasSpells = classData.spellcasting;

  if (hasSpells === undefined) {
    //no spells available
    return;
  }

  const spellListUrl = classData.spells;
  const spells = await fetch(`https://www.dnd5eapi.co${spellListUrl}`);
  const spellsData = await spells.json();
  const filteredSpells = spellsData.results.filter(CheckValidSpellForLevel);

  /* Gets all spells for each level up to 3 */

  let level1Spells = filteredSpells
    .map((spell) => {
      if (spell.level === 1) {
        return spell;
      }
    })
    .filter((item) => item !== undefined);

  let level2Spells = filteredSpells
    .map((spell) => {
      if (spell.level === 2) {
        return spell;
      }
    })
    .filter((item) => item !== undefined);

  let level3Spells = filteredSpells
    .map((spell) => {
      if (spell.level === 3) {
        return spell;
      }
    })
    .filter((item) => item !== undefined);

  //get random amount of spells depending on how slots available
  //each character will get two level 1 spells, 1 level 2 and 3 spell for 4 total
  const characterSpells = [];

  for (let index = 0; index < 2; index++) {
    characterSpells.push(level1Spells[GetRandomInt(1, level1Spells.length)]);
  }

  characterSpells.push(level2Spells[GetRandomInt(1, level2Spells.length)]);
  characterSpells.push(level3Spells[GetRandomInt(1, level3Spells.length)]);

  return characterSpells;
}

function GenerateStats(stats) {
  for (let stat in stats) {
    for (let numOfRolls = 0; numOfRolls < 4; numOfRolls++) {
      let diceRoll = GetRandomInt(1, 6);
      stats[stat] = stats[stat] + diceRoll;
    }
  }
}
