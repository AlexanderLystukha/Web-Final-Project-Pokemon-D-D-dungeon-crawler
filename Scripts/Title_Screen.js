$(document).ready(function () {
  let index = 0;
  const text = document.getElementById("PressEnter");

  const colors = [
    //array of colors for animation
    "#ffffff",
    "#000000",
  ];

  function changeColor() {
    text.style.color = colors[index];
    index = (index + 1) % colors.length;
  }

  setInterval(changeColor, 250);

  document.addEventListener("keydown", PressEnter);

  //http://127.0.0.1:3000/index.html
});

function PressEnter(event) {
  if (event.key === "Enter") {
    document.removeEventListener("keydown", PressEnter);
    const mainContainer = document.getElementById("TitleScreen");
    $("h1").hide();
    $("h3").hide();

    /* Add code to make it so the 'he' accumulate (only after it actually works) */
    const funnyText = document.createElement(`p`);
    funnyText.textContent = "Good Luck hehehehehe";
    funnyText.style.color = "white";
    funnyText.style.opacity = 1;
    //TODO: add font to the text
    mainContainer.appendChild(funnyText);

    FadeText(funnyText, 5000);
    setTimeout(ChangeWindow, 5000);
  }
}

function ChangeWindow() {
  window.open("./pages/PlayerInfo.html");
  window.location.reload();
}

function FadeText(text, duration) {
  let opacity = 1;
  let interval = 25;
  let increment = 1 / (duration / interval);

  const fade = setInterval(function () {
    opacity -= increment;

    if (opacity >= 1) {
      opacity = 1;
      clearInterval(fade);
    }

    text.style.opacity = opacity;
  }, interval);
}
