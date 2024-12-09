$(document).ready(function (event) {});

function PressEnter() {
  const mainContainer = document.getElementsByClassName("TitleScreen");
  $("h1").hide();
  $("h3").hide();

  document.addEventListener("keydown", function (event) {
    /* Add code to make it so the 'he' accumulate */
    const funnyText = document.createElement(`p`);
    funnyText.innerHTML = "Good Luck hehehehehe";
    mainContainer.appendChild(funnyText);
  });
}
