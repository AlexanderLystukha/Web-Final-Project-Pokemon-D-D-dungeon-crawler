"use strict";

let inventory = {};
let invOpen = false;
let nextDialogueId;

const player = JSON.parse(localStorage.getItem("player"));
const character = JSON.parse(localStorage.getItem("character"));

const dialogueBox = document.getElementById("gameText");
const choicesContainer = document.getElementById("optionsList");
let possibleChoices = document.querySelectorAll(`.choice`);
let choice = 0;

const buttonSFX = document.getElementById("selectSFX");
buttonSFX.volume = 0.3;

const enterSFX = document.getElementById("enterSFX");
enterSFX.volume = 0.3;

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

//#region Random Methods
function OpenInventory() {
  if (invOpen) {
    showTextDialogue(nextDialogueId);
  } else {
    dialogueBox.innerHTML = "<h4>Inventory</h4>";

    Array.from().forEach((spell) => {
      const spellOption = document.createElement(`div`);
      spellOption.innerHTML = spell.name;
      spellOption.classList.add(`choice`);
      battleDialogue.appendChild(spellOption);
    });
  }
}

function ChangeWindow() {
  window.open("../pages/Gameplay.html");
  window.close();
}
//#endregion

//#region selection functionality

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
  if (event.key === "ArrowRight") {
    // Move down to the next item
    buttonSFX.play();
    selectedIndex = (selectedIndex + 1) % possibleChoices.length; // Loop back to the top
    updateSelection();
  } else if (event.key === "ArrowLeft") {
    // Move up to the previous item
    buttonSFX.play();
    selectedIndex =
      (selectedIndex - 1 + possibleChoices.length) % possibleChoices.length; // Loop back to the bottom
    updateSelection();
  } else if (event.key === "Enter") {
    // Handle selection (e.g., display the selected option)
    enterSFX.play();
    choice = possibleChoices[selectedIndex].textContent
      .match(/\d+/g)
      .map(Number);
  }
}
//#endregion

//#region All functions for gameplay loop
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
  nextDialogueId = option.nextText;

  if (nextDialogueId <= 0) {
    GameOver();
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
    localStorage.setItem("save", 1);
    inventory = {};
  } else {
    inventory = JSON.parse(localStorage.getItem("inventory"));
  }

  showTextDialogue(parseInt(localStorage.getItem("save")));
}

function GameOver() {
  localStorage.removeItem("save");
  localStorage.removeItem("inventory");
  localStorage.removeItem("character");
  if (nextDialogueId === -2) {
    window.open("../index.html");
    window.close();
  } else {
    setTimeout(ChangeWindow, 2000);
  }
}
//#endregion

//#region All the text nodes and options for the game
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
        text: "1. Go to the door to your left, marked with a rusted keyhole.",
        requiredState: (currentInv) => !currentInv.rustyKey || !currentInv.fang,
        nextText: 2,
      },
      {
        text: "2. Step through the door straight ahead, faint light spilling from beneath it.",
        nextText: 3,
      },
      {
        text: "3. Crawl into the narrow tunnel on your right, barely wide enough to fit through.",
        requiredState: (currentInv) => !currentInv.fur,
        nextText: 4,
      },
      {
        text: "4. Examine your surroundings for any items or clues that could help you escape.",
        nextText: 5,
      },
      {
        text: "5. Crawl into the narrow tunnel on your right, barely wide enough to fit through.",
        requiredState: (currentInv) => currentInv.fur,
        nextText: 12,
      },
      {
        text: "6. Go to the door to your left, marked with a rusted keyhole.",
        requiredState: (currentInv) => currentInv.rustyKey && currentInv.fang,
        nextText: 6,
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
        requiredState: (currentInv) => !currentInv.rustyKey,
        setInv: { rustyKey: true },
        nextText: 6,
      },
      {
        text: "2. Leave the Rusty Key behind and investigate the room for other items.",
        requiredState: (currentInv) => !currentInv.rustyKey,
        nextText: 1,
      },
      {
        text: "3. Fight Zubat, hoping it will reveal more useful items or information.",
        requiredState: (currentInv) => !currentInv.fang,
        setInv: { fang: true },
        encounter: "zubat",
        encounterText: "The Zubat is confused why you're attacking him",
        nextText: 2,
      },
      {
        text: "4. Go to the next room.",
        requiredState: (currentInv) => currentInv.rustyKey,
        nextText: 6,
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
        requiredState: (currentInv) => !currentInv.fur && !currentInv.orb,
        nextText: 11,
      },
      {
        text: "2. Pick up the Mysterious Orb and prepare for a fight.",
        requiredState: (currentInv) => !currentInv.fur && !currentInv.orb,
        setInv: { orb: true, fur: true },
        encounter: "mightyena",
        encounterText:
          "The Mightyena howls at you. It's ready to defend that orb.",
        nextText: 4,
      },
      {
        text: "3. Leave the cavern and return to the previous room to find another path.",
        nextText: 1,
      },
      {
        text: "4. Defeat the beast.",
        requiredState: (currentInv) => currentInv.orb && !currentInv.fur,
        setInv: { fur: true },
        encounter: "mightyena",
        encounterText: "The Mightyena remembers what you did. It's attack rose",
        nextText: 4,
      },
    ],
  },
  {
    id: 5,
    text: "You decide to look around carefully. As you move, you spot something glinting beneath a pile of rubble. Digging through it, you uncover a Healing Herb, its fragrance soothing and calming. You pocket the herb, knowing it could be valuable later. There are multiple doors visible along the walls, but you can only choose one. <br>",
    options: [
      {
        text: "1. Use the Healing Herb to recover some energy and proceed through the nearest door.",
        nextText: 12,
      },
      {
        text: "2. Look through the rubble some more",
        requiredState: (currentInv) => !currentInv.geo,
        setInv: { geo: true },
        encounter: "geodude",
        encounterText: "The goedude freaks out when you uncover him",
        nextText: 5,
      },
      {
        text: "3. Head toward one of the nearby doors, hoping to find something useful beyond.",
        nextText: 1,
      },
    ],
  },
  {
    id: 6,
    text:
      "You insert the Rusty Key into the keyhole, and with a loud click, the door swings open. You enter a small chamber, and immediately, a Zubat swoops toward you. You have no choice but to defend yourself. You wave your hands ferociously and manage to send the Zubat flying. <br>" +
      "In the room, you find a small chest hidden behind a stone pillar. You open it to reveal balls with a button in the middle of each of them, some kind of different coloured discs, and a Doll which resembles the monsters you found — maybe you could use it as a distraction?. You feel more prepared as you continue forward, wondering what lies deeper into the dungeon.",
    options: [
      {
        text: "1. Continue forward",
        nextText: 9,
      },
      {
        text: "2. Grab the doll",
        requiredState: (currentInv) => !currentInv.doll,
        setInv: { doll: true },
        nextText: 6,
      },
      {
        text: "3. Investigate the chest for any hidden compartments or extra items.",
        nextText: 10,
      },
      {
        text: "4. Go back",
        nextText: 1,
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
        nextText: 21,
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
  {
    id: 9,
    text:
      "Turning a corner, I entered a vast, dimly lit room. At its center stood a Dragapult, behind it was a massive barrier of shimmering, unknown matter, probably the exit you're looking for. The strange barrier pulsated with an otherworldly glow, its surface shifting like liquid yet unyielding to touch." +
      "The Dragapult’s eyes glinted with an ancient intelligence, its body rigid as it watched me without a hint of movement. My presence seemed to make no difference to the guardian; it stood resolute." +
      "You look around and see a door to your left and another to your right.",
    options: [
      {
        text: "1. Talk to the Dragapult",
        requiredState: (currentInv) => !currentInv.respect,
        nextText: 14,
      },
      {
        text: "2. Go to the left door",
        nextText: 17,
      },
      {
        text: "3. Go to the right door",
        nextText: 19,
      },
      {
        text: "4. Go back",
        nextText: 6,
      },
      {
        text: "5. Go to the barrier",
        requiredState: (currentInv) => currentInv.respect,
        nextText: 15,
      },
    ],
  },
  {
    id: 11,
    text:
      "You approach the Mightyena slowly and carefully. The Mightyena is still on high alert by your presence. With each step the beast starts" +
      "sensing that you might not be a danger. While approaching you managed to get next to the orb." +
      "You sense that this orb might have some importance. The Mightyena is now at arms reach",
    options: [
      {
        text: "1. Pet the Mightyena",
        requiredState: (currentInv) => !currentInv.fur,
        setInv: { fur: true },
        encounter: "mightyena",
        encounterText:
          "The Mightyena loves the pets you gave him. He lets his guard down. His attack fell.",
        nextText: 12,
      },
      {
        text: "2. Try to grab the orb",
        requiredState: (currentInv) => !currentInv.fur,
        setInv: { orb: true, fur: true },
        nextText: 12,
        encounter: "mightyena",
        encounterText: "The Mightyena's might startles you",
      },
      {
        text: "3. Back off and go back to the starting room",
        nextText: 1,
      },
      {
        text: "4. Throw the doll behind the Mightyena",
        requiredState: (currentInv) => currentInv.doll,
        setInv: { doll: true },
        nextText: 13,
      },
      {
        text: "5. Take the orb",
        requiredState: (currentInv) => currentInv.fur,
        setInv: { orb: true },
        nextText: 1,
      },
    ],
  },
  {
    id: 12,
    text: "A silence enters the room, but it is quickly disturbed by the humming coming from the orb.",
    options: [
      {
        text: "1. Back off and go back to the starting room",
        nextText: 1,
      },
      {
        text: "2. Take the orb",
        requiredState: (currentInv) => !currentInv.orb && currentInv.fur,
        setInv: { orb: true },
        nextText: 12,
      },
    ],
  },
  {
    id: 13,
    text: "You threw the doll behind the Mightyena and it turns its back on you",
    options: [
      {
        text: "1. Grab the orb and run away",
        setInv: { orb: true },
        nextText: 1,
      },
      {
        text: "2. Run back to the original room",
        nextText: 1,
      },
    ],
  },
  {
    id: 14,
    text:
      "The Dragapult tells you he is the dungeon master of this dungeon. The only way to open the barrier is using the magic of a certain orb." +
      "But he tells you that if you want to get to the barrier you have to get through him first. He will only" +
      "accept the challenge if you have the orb with you.",
    options: [
      {
        text: "1. Go look elsewhere",
        setInv: { orb: true },
        nextText: 9,
      },
      {
        text: "2. Challenge the dungeon master.",
        requiredState: (currentInv) => currentInv.orb,
        setInv: { respect: true },
        encounter: "dragapult",
        encounterText: "The Dragapult is ready to humble you...",
        nextText: 15,
      },
    ],
  },
  {
    id: 15,
    text: "The barrier glows and you start feeling strange...",
    options: [
      {
        text: "1. Find the missing piece",
        setInv: { orb: true },
        nextText: 9,
      },
      {
        text: "2. Undo the barrier.",
        requiredState: (currentInv) => currentInv.orb && currentInv.starcore,
        nextText: 16,
      },
    ],
  },
  {
    id: 16,
    text:
      "The barrier fades away and you're suddenly blinded by a multicolored beam of light and you as you thought you have died." +
      "you open your eyes and see an open space of a strange world... Out of no where, a man appears at the place of the barrier." +
      "'You seemed quite accustomed with these creatures huh?'<br><br>" +
      "To be continued...",
    options: [
      {
        text: "1. Go back to the main menu",
        setInv: { orb: true },
        nextText: -2,
      },
      {
        text: "2. Restart",
        requiredState: (currentInv) => currentInv.orb && currentInv.starcore,
        nextText: -1,
      },
    ],
  },
  {
    id: 17,
    text:
      "You enter the room and witness a very stranger merchant which is going through his findings and merchandise as if he was desperate to find something" +
      "He notices you and he sees that you're not some ordinary creature. He approaches hoping to get something out of you, but you stop him first and ask him what he has" +
      "for sale. He says that he has nothing he wants to sell to me, except this random 'junk' he found somewhere in this dungeon." +
      "he says that if you bring enough things, he would give you in exchange of them.",
    options: [
      {
        text: "1. Go back",
        nextText: 9,
      },
      {
        text: "2. Ask him what he wants",
        requiredState: (currentInv) =>
          (!currentInv.fur ||
            !currentInv.geo ||
            !currentInv.fang ||
            !currentInv.weirdShrooms) &&
          !currentInv.alientech,
        nextText: 18,
      },
      {
        text: "3. Get the item from the man",
        requiredState: (currentInv) =>
          currentInv.fur &&
          currentInv.geo &&
          currentInv.fang &&
          currentInv.weirdShrooms &&
          !currentInv.alientech,
        setInv: {
          alientech: true,
          fur: false,
          geo: false,
          fang: false,
          weirdShrooms: false,
        },
        nextText: 17,
      },
    ],
  },
  {
    id: 18,
    text:
      "He tells you that he has seen a bunch of creatures around this dungeon and that he would like to get some of their" +
      "''belongings''. This man is very strange...",
    options: [
      {
        text: "1. Go back",
        nextText: 9,
      },
    ],
  },
  {
    id: 19,
    text:
      "You stand in front of the door. It towers over you and an ominous energy radiates from it. You enter the room and to your" +
      "disappointment, there is just a multitude of cells around the place. Among these cells a door catches your eye... Why does it have" +
      "a weird dent in the middle of it?",
    options: [
      {
        text: "1. Go back",
        nextText: 9,
      },
      {
        text: "2. Open the door",
        requiredState: (currentInv) => currentInv.orb && currentInv.key,
        nextText: 20,
      },
    ],
  },
  {
    id: 20,
    text:
      "You enter this mysterious door and all you can see is a silhouette in the middle. You come close to it" +
      " and try to make it move on its own in any way possible, but nothing happens.",
    options: [
      {
        text: "1. Go back",
        nextText: 19,
      },
      {
        text: "2. Use the ancient alien technology",
        requiredState: (currentInv) => currentInv.alientech,
        setInv: { starcore: true, alientech: false },
        encounter: "necrozma",
        encounterText:
          "An ancient creature has awoken before you! It screeches, destroys the ancient tech and starts illuminating the place with lights!",
        nextText: 20,
      },
    ],
  },
  {
    id: 21,
    text: "<h1>Game Over<h1>",
    options: [
      {
        text: "1. Main Menu",
        nextText: -2,
      },
      {
        text: "2. Restart",
        nextText: -1,
      },
    ],
  },
];
//#endregion

/* GAME STARTS THIS WAY */

PopulatePlayerInfo(player, character);
StartGame();
let pageCount = 0;
