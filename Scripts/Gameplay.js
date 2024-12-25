"use strict";

let inventory = {};

const player = JSON.parse(localStorage.getItem("player"));
const character = JSON.parse(localStorage.getItem("character"));

const dialogueBox = document.getElementById("gameText");
const choicesContainer = document.getElementById("optionsList");
let possibleChoices = document.querySelectorAll(`.choice`);
let choice = 0;

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
  possibleChoices.forEach((item) => item.classList.remove("selected"));
  // Add the 'selected' class to the current item
  possibleChoices[selectedIndex].classList.add("selected");
}

function OptionSelection() {
  return new Promise((resolve) => {
    choicesContainer.addEventListener("keydown", KeySelect);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        choicesContainer.removeEventListener("keydown", KeySelect);
        resolve();
      }
    });

    updateSelection();
    choicesContainer.focus();
  });
}

function KeySelect(event) {
  if (event.key === "ArrowDown") {
    // Move down to the next item
    selectedIndex = (selectedIndex + 1) % possibleChoices.length; // Loop back to the top
    updateSelection();
  } else if (event.key === "ArrowUp") {
    // Move up to the previous item
    selectedIndex =
      (selectedIndex - 1 + possibleChoices.length) % possibleChoices.length; // Loop back to the bottom
    updateSelection();
  } else if (event.key === "Enter") {
    // Handle selection (e.g., display the selected option)
    choice = possibleChoices[selectedIndex].textContent
      .match(/\d+/g)
      .map(Number);
  }
}

// All functions for gameplay loop
async function showTextDialogue(dialogueIndex) {
  const dialogue = TextDialogue.find(
    (dialogue) => dialogue.id === dialogueIndex
  );
  dialogueBox.innerHTML = dialogue.text;

  while (choicesContainer.firstChild) {
    choicesContainer.removeChild(choicesContainer.firstChild);
  }

  dialogue.options.forEach((option) => {
    if (showOption(option)) {
      const optionText = document.createElement(`div`);
      optionText.innerHTML = option.text;
      optionText.classList.add(`choice`);
      choicesContainer.appendChild(optionText);
    }
  });

  selectedIndex = 0;
  possibleChoices = document.querySelectorAll(`.choice`);
  await OptionSelection();
  selectOption(dialogue.options[choice - 1]);
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(inventory);
  // return true;
}

function selectOption(option) {
  const nextDialogueId = option.nextText;
  if (nextDialogueId <= 0) {
    localStorage.removeItem("save");
    return StartGame();
  }

  inventory = Object.assign(inventory, option.setInv);

  if (option.encounter) {
    localStorage.setItem("pokemon", option.encounter);
    localStorage.setItem("prompt", option.encounterText);
    localStorage.setItem("save", nextDialogueId);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    window.open("../pages/Battle.html");
    window.close();
  }

  showTextDialogue(nextDialogueId);
}

function StartGame() {
  if (localStorage.getItem("save") == null) {
    console.log("hi");
    localStorage.setItem("save", 1);
    inventory = {};
  } else {
    inventory = JSON.parse(localStorage.getItem("inventory"));
  }

  console.log(inventory);
  showTextDialogue(parseInt(localStorage.getItem("save")));
}

const TextDialogue = [
  {
    id: 1,
    text:
      "You wake up with a start. Your head aches, and as you sit up, you realize you're lying on cold, rough stone. The air smells musty, thick with dampness. As your eyes adjust to the gloom, you realize you're trapped inside a dark dungeon. Strange Pokémon lurk in the shadows, some curious, others hostile. You're not alone, but you're certain of one thing: you need to escape.<br>" +
      "Around you, the dungeon stretches in every direction, with multiple pathways. The walls are damp and covered with moss, and the eerie sound of distant growls fills the air. A faint glow from an unknown source lights up the corridor ahead. <br>" +
      "You stand and quickly survey the area. In front of you, there are several doors leading deeper into the dungeon. Each seems to promise a different challenge.<br><br>" +
      "What will you do?",
    options: [
      {
        text: "1. Enter the door to your left, marked with a rusted keyhole.",
        setInv: { loveOfMom: true },
        nextText: 2,
      },
      {
        text: "2. Step through the door straight ahead, faint light spilling from beneath it.",
        nextText: 3,
      },
      {
        text: "3. Crawl into the narrow tunnel on your right, barely wide enough to fit through.",
        nextText: 4,
      },
      {
        text: "4. Examine your surroundings for any items or clues that could help you escape.",
        nextText: 5,
      },
    ],
  },
  {
    id: 2,
    text:
      "You approach the door cautiously, the rusted keyhole drawing your attention. It looks old, but something about it catches your eye — the faint outline of an inscription on the door. As you get closer, you hear the sound of shifting stones, and suddenly, a Zubat flies out from behind the door, screeching. <br>" +
      "Startled, you step back, but as you do, you notice something peculiar: a small shiny object on the ground. It’s a Rusty Key, old but possibly useful.",
    options: [
      {
        text: "1. Use the Rusty Key to unlock the door and continue forward.",
        requiredState: (currentInv) => currentInv.loveOfMom,
        setInv: { rustyKey: true },
        nextText: 6,
      },
      {
        text: "2. Leave the Rusty Key behind and investigate the room for other items.",
        nextText: 1,
      },
      {
        text: "3. Fight Zubat, hoping it will reveal more useful items or information.",
        nextText: 3,
      },
    ],
  },
  {
    id: 3,
    text:
      "The door creaks open as you push it, revealing a dimly lit room. The faint glow comes from glowing mushrooms that line the walls, casting an eerie light. In the center of the room, there's an odd-looking chest. Before you can approach it, you hear the skittering of claws — a Shelmet scuttles into view, eyes locked on you. It’s guarding something, and it doesn’t look like it wants visitors. <br>" +
      "You notice a faint glimmer near the chest — a small Potion, clearly visible just beyond Shelmet’s guarding position.",
    options: [
      {
        text: "1. Attempt to defeat Shelmet and grab the Potion.",
        requiredState: (currentInv) => !currentInv.healingPotion,
        setInv: { healingPotion: true },
        nextText: 7,
        encounter: "shelmet",
        encounterText: "The shelmet has its guard up. Their defense rose!",
      },
      {
        text: "2. Try to sneak past Shelmet and open the chest.",
        requiredState: (currentInv) => !currentInv.key,
        setInv: { key: true },
        nextText: 7,
        encounter: "shelmet",
        encounterText: "The shelmet jumps towards you!",
      },
      {
        text: "3. Investigate the glowing mushrooms for any clues or hidden items.",
        requiredState: (currentInv) => !currentInv.weirdShrooms,
        nextText: 8,
      },
      {
        text: "4. Leave this room",
        nextText: 1,
      },
    ],
  },
  {
    id: 4,
    text:
      "You crawl through the narrow tunnel, the stones scraping against your arms. It’s tight, but you manage to squeeze through. After what feels like forever, you reach a small, open cavern. In the center stands an odd stone pedestal, and on it rests a Mysterious Orb, glowing faintly. As you approach, you hear a growl from behind you. <br>" +
      "A Mightyena has appeared, stepping into the cavern. It looks at the orb, then at you. It seems like it’s protecting it — and perhaps you’ll need it for your escape.",
    options: [
      {
        text: "1. Approach Mightyena and try to reason with it.",
        nextText: -1,
      },
      {
        text: "2. Pick up the Mysterious Orb and prepare for a fight.",
        nextText: -1,
      },
      {
        text: "3. Leave the cavern and return to the previous room to find another path.",
        nextText: 1,
      },
    ],
  },
  {
    id: 5,
    text: "You decide to look around carefully. As you move, you spot something glinting beneath a pile of rubble. Digging through it, you uncover a Healing Herb, its fragrance soothing and calming. You pocket the herb, knowing it could be valuable later. A small scratched map is also hidden among the rocks — it's unclear, but it might provide a hint about the dungeon’s layout. There are multiple doors visible along the walls, but you can only choose one. <br>",
    options: [
      {
        text: "1. Use the Healing Herb to recover some energy and proceed through the nearest door.",
        nextText: -1,
      },
      {
        text: "2. Study the map to see if it offers any hints or shortcuts to the dungeon’s exit.",
        nextText: -1,
      },
      {
        text: "3. Head toward one of the nearby doors, hoping to find something useful beyond.",
        nextText: -1,
      },
    ],
  },
  {
    id: 6,
    text:
      "You insert the Rusty Key into the keyhole, and with a loud click, the door swings open. You enter a small chamber, and immediately, a Zubat swoops toward you. You have no choice but to defend yourself, summoning your Pokémon to fight. It’s a quick battle, and after a few rounds, you manage to send the Zubat flying. <br>" +
      "In the room, you find a small chest hidden behind a stone pillar. You open it to reveal Poké Balls, a few TMs for moves, and a Poké Doll — a cute but potentially useful distraction. You feel more prepared as you continue forward, wondering what lies deeper into the dungeon.",
    options: [
      {
        text: "1. Continue forward, using the newfound items to your advantage.",
        nextText: -1,
      },
      {
        text: "2. Investigate the chest for any hidden compartments or extra items.",
        nextText: -1,
      },
    ],
  },
  {
    id: 7,
    text:
      "The shelmet lays on the floor without its shell. You're disturbed by what you've just seen. <br>" +
      "Somehow it stands up but with no energy left",
    options: [
      {
        text: "1. Open the chest and make the shelmet rest in peace",
        requiredState: (currentInv) =>
          currentInv.healingPotion && !currentInv.key,
        setInv: { key: true },
        nextText: 3,
      },
      {
        text: "2. Grab the potion and make the shelmet rest in peace",
        requiredState: (currentInv) =>
          !currentInv.healingPotion && currentInv.key,
        setInv: { healingPotion: true },
        nextText: 3,
      },
      {
        text: "3. Investigate the glowing mushrooms for any clues or hidden items.",
        requiredState: (currentInv) => !currentInv.weirdShrooms,
        nextText: 8,
      },
      {
        text: "4. Leave the room",
        nextText: 1,
      },
    ],
  },
  {
    id: 8,
    text:
      "You get a really weird smell from these mushrooms, but at the same time you really crave to eat them for some reason <br>" +
      "Your parents told you not to eat stuff you find in random places, especially not run down dungeons.",
    options: [
      {
        text: "1. Eat the mushrooms",
        requiredState: (currentInv) => !currentInv.weirdShrooms,
        nextText: -1,
      },
      {
        text: "2. Cultivate the mushrooms and go back",
        requiredState: (currentInv) => !currentInv.weirdShrooms,
        setInv: { weirdShrooms: true },
        nextText: 3,
      },
      {
        text: "3. Go look at the other things in the room",
        nextText: 3,
      },
    ],
  },
];

PopulatePlayerInfo(player, character);
StartGame();
let pageCount = 0;
