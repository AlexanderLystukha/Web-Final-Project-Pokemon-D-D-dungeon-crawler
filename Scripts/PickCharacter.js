"use strict";

$(document).ready(function () {
  //Gets all the images
  const Images = document.querySelectorAll("img");
  const Classes = Array.from(document.getElementsByClassName("Class"));
  const Races = Array.from(document.getElementsByClassName("Race"));
  let SelectedClass, SelectedRace;
  const characterCreated = false;
  const player = localStorage.getItem("player");
  console.log(player);
  /* Lazy Loading Images observer */
  LazyLoadImages(Images);

  SelectedClass = SelectCharacteristic(Classes);
  SelectedRace = SelectCharacteristic(Races);

  setInterval(console.log("hello"), 1000);
  //CreateCharacter(player, characterCreated, SelectedClass, SelectedRace),

  document.addEventListener("keydown", PressEnter);
});

function SelectCharacteristic(characteristics) {
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

      return selectionName;
    });
  });
}

function CreateCharacter(
  player,
  characterCreated,
  SelectedClass,
  SelectedRace
) {
  console.log(SelectedClass);
  console.log(SelectedRace);
  if (
    SelectedClass != undefined &&
    SelectedRace != undefined &&
    characterCreated === false
  ) {
    const playerContainer = document.getElementById("playerContainer");

    const playerImage = document.createElement(`img`);
    playerImage.src = `../public/Characters/${SelectedRace}-${SelectedClass}.png`;
    playerImage.id = "playerImage";

    const playerGameName = document.createElement(`p`);
    playerGameName.textContent = `${player.name}, a ${SelectedRace} ${SelectedClass}`;

    const ready = document.createElement(`p`);
    ready.textContent = "Please press enter to start!";

    playerContainer.appendChild(playerImage);
    playerContainer.appendChild(playerGameName);
    playerContainer.appendChild(ready);

    characterCreated = true;
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

function PressEnter(event) {
  if (event.key === "Enter") {
    document.removeEventListener("keydown", PressEnter);

    const screen = document.getElementsByTagName("html");
    screen.style.opacity = 1;
    FadeText(screen, 5000);
    setTimeout(ChangeWindow, 5000);
  }
}

function ChangeWindow() {
  window.replace("../pages/Gameplay.html");
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
