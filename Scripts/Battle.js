"use strict";

const player = JSON.parse(localStorage.getItem("player"));
const character = JSON.parse(localStorage.getItem("character"));
const pokemonName = localStorage.getItem("pokemon");
const initialDialogue = localStorage.getItem("prompt");
const battleDialogue = document.getElementById("battleDialogue");
const battleOST = document.getElementById("battleMusic");
const battleBG = document.getElementById("battle");
let possibleChoices = document.querySelectorAll(`.choice`);
let choice = 0;
let defenseModifier, attackModifier;
let pokemonImage;
let pokemon;
let bestMove;
let weapon;
let weaponDices;
let pokemonHealth, maxPokemonHealth;
let playerHealth;

// const c = document.getElementById("fightBox");
// let ctx = c.getContext("2d");

function GetRandomInt(min, max) {
  const minNum = Math.ceil(min);
  const maxNum = Math.floor(max);
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}

function PopulateScreenInfo() {
  document.getElementById("battleMusic").volume = 0.2;
  document.getElementById("playerImage").src = character.image;
  document.getElementById("playerName").innerText = player.name;
  battleDialogue.innerHTML = initialDialogue;
  const roll = GetRandomInt(1, 1000);
  if (roll > 900) {
    pokemonImage = pokemon.sprites.front_shiny;
  } else {
    pokemonImage = pokemon.sprites.front_default;
  }

  document.getElementById("pokemonImage").src = pokemonImage;
}

async function GetPokemonInfo() {
  const pokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );

  const pokemon = await pokemonResponse.json();
  return pokemon;
}

let selectedIndex = 0;

function updateSelection() {
  // Remove the 'selected' class from all items
  possibleChoices.forEach((item) => item.classList.remove("selected"));
  // Add the 'selected' class to the current item
  possibleChoices[selectedIndex].classList.add("selected");
}

function OptionSelection() {
  return new Promise((resolve) => {
    battleDialogue.addEventListener("keydown", KeySelect);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        battleDialogue.removeEventListener("keydown", KeySelect);
        resolve();
      }
    });

    updateSelection();
    battleDialogue.focus();
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
    choice = selectedIndex;
  }
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

function ChangeWindow() {
  window.open("../pages/Gameplay.html");
  window.close();
}

async function GameOver() {
  battleOST.src =
    "../public/music/Pokemon Black & White Music_ Unwavering Emotions.mp3";
  battleOST.load();
  battleOST.play();
  battleDialogue.innerHTML = "You died...<br><br>Restart?";
  document.getElementById("fight").remove();
  document.getElementById("act").remove();
  let restartOptions = ["Yes", "No"];

  for (let restartOption in restartOptions) {
    const option = document.createElement(`div`);
    option.innerHTML = restartOptions[restartOption];
    option.classList.add(`choice`);
    battleDialogue.appendChild(option);
  }

  selectedIndex = 0;
  possibleChoices = document.querySelectorAll(`.choice`);
  await OptionSelection();
  localStorage.removeItem("character");
  localStorage.removeItem("save");
  localStorage.removeItem("inventory");
  localStorage.removeItem("prompt");
  localStorage.removeItem("pokemon");

  if (choice === 0) {
    window.open("../pages/PickCharacter.html");
    window.close();
  } else {
    window.close();
  }
}
// function DrawFightBox() {
//   // Step 1 - Create an image
//   let img = new Image();
//   img.src = "../public/player.png";

//   // Step 2 - Init position for our brave soul
//   let x = 140;
//   let y = 55;
//   const width = 25;
//   const height = 13;

//   // Step 3 - Draw the image at position (10, 10) with dimensions 150
//   img.onload = function () {
//     ctx.drawImage(img, x, y, width, height);
//   };

//   // Step 4 - let's create a reusable function :^)
//   function movePlayer(e) {
//     // Step 5 - Clear the canvas before moving the image
//     ctx.clearRect(0, 0, c.width, c.height);

//     // Step 6 - Adjust position based on key
//     console.log("hi");
//     if (e.key === "ArrowUp") {
//       y -= 10;
//     } else if (e.key === "ArrowDown") {
//       y += 10;
//     } else if (e.key === "ArrowLeft") {
//       x -= 10;
//     } else if (e.key === "ArrowRight") {
//       x += 10;
//     }

//     if (x < 0) {
//       x = 0;
//     } else if (x > 275) {
//       x = 275;
//     } else if (y < 0) {
//       y = 0;
//     } else if (y > 137) {
//       y = 137;
//     }
//     // (you can also do the above with a switch case for cleaner code)

//     // Step 7 - draw our son again
//     ctx.drawImage(img, x, y, width, height);
//   }
//   // Step 8 - Event listener for keyboard inputs
//   window.addEventListener("keydown", movePlayer);
// }

/* Battle Functionality methods */

async function Battle(pokemon) {
  const fightBtn = document.getElementById("fight");
  const actBtn = document.getElementById("act");

  bestMove = await GetPokemonBestAttack(pokemon);
  await FindWeapon();

  if (weaponDices === undefined) {
    weaponDices = "1d12";
  }
  /* console for info */

  console.log(character);
  console.log(player);
  console.log(pokemon);
  console.log(bestMove);

  fightBtn.addEventListener("click", FightOption);
  actBtn.addEventListener("click", ChooseSpell);
}

async function FightOption() {
  while (battleDialogue.firstChild) {
    battleDialogue.removeChild(battleDialogue.firstChild);
  }
  console.log(weaponDices);
  //damage the pokemon
  let damage = CalculateDamage(character, weaponDices, "physical");
  pokemonHealth = decreaseHealth(
    damage,
    pokemonHealth,
    maxPokemonHealth,
    "healthBarPokemon"
  );

  let damageText = document.createElement(`div`);
  damageText.innerHTML = `You dealt ${damage} to ${pokemonName}!`;
  battleDialogue.appendChild(damageText);

  //pokemon damage you
  //DrawFightBox();
  if (pokemonHealth <= 0) {
    battleDialogue.innerHTML = `You defeated ${pokemonName}!`;
    const screen = document.getElementsByTagName("body");
    screen[0].style.opacity = 1;
    FadeScreen(screen[0], 3000);
    await setTimeout(ChangeWindow, 3000);
  } else {
    await PokemonAttack(bestMove, character);
  }
}

async function PokemonAttack(move) {
  setTimeout(() => {
    //if (hit) {
    let damage = CalculateDamage(pokemon, move, "physical");
    playerHealth = decreaseHealth(
      damage,
      playerHealth,
      character.health,
      "healthBar"
    );

    let damageText = document.createElement(`div`);
    damageText.innerHTML = `${pokemonName} used ${move.name}! It dealt ${damage} to you!`;
    battleDialogue.appendChild(damageText);

    document.getElementById(
      "healthCount"
    ).innerHTML = `${playerHealth}<span id="maxHealth">/100</span>`;

    if (playerHealth <= 0) {
      setTimeout(GameOver, 1500);
    }
    // }
  }, 1000);
}

function FindWeapon() {
  let isWeapon = false;
  let weapon;
  for (let equipment in character.Equipment) {
    if (character.Equipment[equipment].option_type === "multiple") {
      character.Equipment[equipment].items.forEach((item) => {
        CheckEquipment(item);
      });
    } else {
      CheckEquipment(character.Equipment[equipment]);
    }
  }

  return weapon;
}

async function CheckEquipment(item) {
  let response = await fetch(`https://www.dnd5eapi.co${item.of.url}`);
  let equipment = await response.json();

  if (equipment.equipment_category.name === "Weapon") {
    weaponDices = equipment.damage.damage_dice;
  }
}

async function ChooseSpell() {
  battleDialogue.innerHTML = "";

  character.spells.forEach((spell) => {
    const spellOption = document.createElement(`div`);
    spellOption.innerHTML = spell.name;
    spellOption.classList.add(`choice`);
    const spellInfo = document.createElement(`div`);
    spellInfo.classList.add(`spellInfo`);

    GetSpellInfo(spell).then((info) => {
      spellInfo.innerHTML = info;
    });

    const spellBox = document.createElement(`div`);
    spellBox.classList.add(`spellBox`);

    spellBox.appendChild(spellOption);
    spellBox.appendChild(spellInfo);
    battleDialogue.appendChild(spellBox);
  });

  selectedIndex = 0;
  possibleChoices = document.querySelectorAll(`.choice`);
  await OptionSelection();
  await SelectedSpell();
  if (pokemonHealth <= 0) {
    battleDialogue.innerHTML = `You defeated ${pokemonName}!`;
    const screen = document.getElementsByTagName("body");
    screen[0].style.opacity = 1;
    FadeScreen(screen[0], 3000);
    await setTimeout(ChangeWindow, 3000);
  } else {
    await PokemonAttack(bestMove);
  }
}

async function GetSpellInfo(spell) {
  const response = await fetch(`https://www.dnd5eapi.co${spell.url}`);
  const spellDetails = await response.json();

  return spellDetails.desc;
}

async function SelectedSpell() {
  const response = await fetch(
    `https://www.dnd5eapi.co${character.spells[choice].url}`
  );
  const spellDetails = await response.json();

  if (spellDetails.damage !== undefined) {
    let diceRoll = spellDetails.damage.damage_at_slot_level[3];
    let damage = CalculateDamage(character, diceRoll, "spell");
    pokemonHealth = decreaseHealth(
      damage,
      pokemonHealth,
      maxPokemonHealth,
      "healthBarPokemon"
    );

    battleDialogue.innerHTML = `You casted ${spellDetails.name}! You dealt ${damage} to ${pokemonName}!`;
  } else if (spellDetails.heal_at_slot_level !== undefined) {
    let healing = CalculateHealing(spellDetails.heal_at_slot_level[3]);
    playerHealth = increaseHealth(
      healing,
      playerHealth,
      character.health,
      "healthBar"
    );

    battleDialogue.innerHTML = `You casted ${spellDetails.name}! You healed ${healing} damage!`;

    document.getElementById(
      "healthCount"
    ).innerHTML = `${playerHealth}<span id="maxHealth">/100</span>`;
  } else {
    battleDialogue.innerHTML =
      `You tried to cast ${spellDetails.name}! ${pokemonName} seemed confused by your hand movement. <br>` +
      `It had no effect!`;
  }
}

function CalculateHealing(move) {
  const healRoll = move.match(/(\d+)d(\d+)\s*\+\s*(\d+)?/);
  let healing = 0;
  let numDice = parseInt(healRoll[1], 10);
  let numSides = parseInt(healRoll[2], 10);
  let bonus = healRoll[3] ? parseInt(healRoll[3], 10) : 0;

  if (bonus === "MOD") {
    bonus = character.stats.Intelligence;
  }

  for (let roll = 0; roll < numDice; roll++) {
    healing += GetRandomInt(1, numSides);
  }

  return healing + bonus;
}

function CalculateDamage(attacker, move, moveType) {
  let attackStat;
  let defenderDefense;
  let movePower;
  let attackerLevel;

  console.log(move);

  if (attacker.name === character.name) {
    const attackRoll = move.match(/(\d+)d(\d+)\s*\+?\s*(\d+)?/);
    let numDice = parseInt(attackRoll[1], 10);
    let numSides = parseInt(attackRoll[2], 10);
    let bonus = attackRoll[3] ? parseInt(attackRoll[3], 10) : 0;
    let damageDealt = 0;
    for (let roll = 0; roll < numDice; roll++) {
      damageDealt += GetRandomInt(1, numSides);
    }

    damageDealt += bonus;

    if (moveType === "spell") {
      attackStat = (attacker.stats.Intelligence + 10) * 4;
      defenderDefense = pokemon.stats[4].base_stat;
    } else {
      attackStat = (attacker.stats.Strength + 10) * 4;
      defenderDefense = pokemon.stats[2].base_stat;
    }
    movePower = damageDealt * 7;
    attackerLevel = 30;
  } else {
    let attackStatIndex;
    if (move.damage_class.name === "physical") {
      attackStatIndex = 1;
    } else {
      attackStatIndex = 3;
    }

    movePower = move.power * (player.difficulty / 3);
    attackStat = attacker.stats[attackStatIndex].base_stat;
    defenderDefense = ((character.stats.Dexterity - 10) / 2 + 10) * 7;
    attackerLevel = 40;
  }

  return Math.floor(
    (((2 * attackerLevel) / 5 + 2) * attackStat * movePower) /
      defenderDefense /
      50 +
      2
  );
}

async function GetPokemonBestAttack(pokemon) {
  const moves = pokemon.moves;

  // Step 3: Iterate through each move and fetch the move's details
  let mostPowerfulMove = null;
  let maxPower = 0;

  for (let move of moves) {
    // Fetch the move details from the PokeAPI
    const moveResponse = await fetch(move.move.url);
    const moveDetails = await moveResponse.json();

    // Step 4: Check if the move has a power stat and compare it to the most powerful move found
    if (moveDetails.power && moveDetails.power > maxPower) {
      mostPowerfulMove = moveDetails;
      maxPower = moveDetails.power;
    }
  }

  // Step 5: Return the most powerful move
  if (mostPowerfulMove) {
    return mostPowerfulMove; // Return the name of the most powerful move
  } else {
    return "No powerful move found";
  }
}

function updateHealthBar(health, maxHealth, characterHealthBar) {
  const healthBar = document.getElementById(characterHealthBar);
  // update the width dynamically
  healthBar.style.width = `${(health * 100) / maxHealth}%`;
}

// Call this function to decrease health
function decreaseHealth(amount, health, maxHealth, characterHealthBar) {
  // Pro Tip 👉 Prevent health from going below 0
  health = Math.max(0, health - amount);
  updateHealthBar(health, maxHealth, characterHealthBar);
  return health;
}

// Call this function to increase health
function increaseHealth(amount, health, maxHealth, characterHealthBar) {
  // Pro Tip 👉 Prevent health from going above 100
  health = Math.min(100, health + amount);
  updateHealthBar(health, maxHealth, characterHealthBar);
  return health;
}

/* CALLING PLACE IS HERE BEFORE ARE FUNCTIONS */

if (pokemonName === "necrozma") {
  battleBG.style.backgroundImage = "url('../public/download.gif')";
  battleOST.src =
    "../public/music/THE WORLD REVOLVING (Jevil's Theme) - Deltarune (Extended).mp3";
} else if (pokemonName === "dragapult") {
  battleBG.style.backgroundImage = "url('../public/barrier.gif')";
  battleOST.src =
    "../public/music/Undertale Ost_ 098 - Battle Against a True Hero.mp3";
}

battleOST.load();
battleOST.play();

GetPokemonInfo().then((result) => {
  pokemon = result;
  pokemonHealth = pokemon.stats[0].base_stat * (player.difficulty / 3);
  maxPokemonHealth = pokemonHealth;
  playerHealth = character.health;
  PopulateScreenInfo();
  Battle(pokemon);
});
