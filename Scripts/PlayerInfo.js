"use strict";

$(document).ready(function () {
  $("#login").on("submit", function (event) {
    $("#ageErr").hide();
    $("#playerErr").hide();

    const player = document.getElementById("playerName").value;
    const age = document.getElementById("ageID").value;
    const duration = document.getElementById;

    if (age < 18) {
      event.preventDefault();
      $("#ageErr").show();
    }

    if (player === "") {
      event.preventDefault();
      $("#playerErr").show();
    }

    if (age >= 18 && player != "") {
      event.preventDefault();
      localStorage.setItem("username", player);
      SubmitSuccessful();
    }
  });
});

function SubmitSuccessful() {
  let index = 0;

  const button = document.getElementById("SubmitBtn");

  const submitColors = [
    //array of colors for animation
    "#c9a202",
    "#d6bd02",
  ];

  function changeColor() {
    button.style.color = submitColors[index];
    button.style.borderColor = submitColors[index];
    index = (index + 1) % submitColors.length;
  }

  setInterval(changeColor, 100);

  setTimeout(function () {
    window.open("./PickCharacter.html");

    window.close();
  }, 2000);
}
