"use strict";

console.log("test");

const startButton = document.getElementById("start");
const settingsButton = document.getElementById("settings");
const inSettings = document.getElementById("inSettings");
const menu = document.getElementById("menu");
const backButton = document.getElementById("backToMenu");
const keyBindButtons = document.getElementsByClassName("settingsButton");

settingsButton.addEventListener("click", accessSettings);
backButton.addEventListener("click", backToMenu);

function accessSettings() {
  inSettings.style.display = "block";
  menu.style.display = "none";
}

let isListening = true;
function backToMenu() {
  if (isListening == true) {
    inSettings.style.display = "none";
    menu.style.display = "block";
  }
}

inSettings.addEventListener("click", changeKey);

let selectedKeyBind;

// makes the button clarify that it can be changed
// >new bind<  <-- like that
function changeKey(e) {
  if (isListening && Object.values(keyBindButtons).includes(e.target)) {
    selectedKeyBind = e.target.innerText.split(" ");
    selectedKeyBind.push(e.target);
    e.target.innerText = ">new bind<";

    // listens for new keybind
    document.addEventListener("keydown", newKeyBind);
    isListening = false;
  }
}

// checks if the new keybind is allowed (no duplicates) and if so saves and changed the keybind.
function newKeyBind(e) {
  if (controls.includes(e.key) == false) {
    selectedKeyBind[2].innerText = selectedKeyBind[0] + " " + e.key;
    isListening = true;
    document.removeEventListener("keydown", newKeyBind);
    console.log(selectedKeyBind[1]);
    console.log(e.key);
    for (let i = 0; i < controls.length; i++) {
      // console.log(selectedKeyBind[1].toLowerCase() + "  " + controls[i]);
      if (selectedKeyBind[1] == controls[i]) {
        controls[i] = e.key;
      }
    }
  }
}

startButton.addEventListener("click", start);

// variables defined in dungeoncrawler_Albin.js.
function updateControls() {
  moveUpButton = controls[0];
  moveDownButton = controls[1];
  moveLeftButton = controls[2];
  moveRightButton = controls[3];
  shootUpButton = controls[4];
  shootDownButton = controls[5];
  shootLeftButton = controls[6];
  shootRightButton = controls[7];
}

// gets rid of menu and starts game
function start() {
  if (nrLoaded == 11) {
    // if all images are loaded
    menu.style.display = "none";
    canvas.style.display = "block";
    document.getElementById("body").style.backgroundImage = "none";
    requestAnimationFrame(mainLoop);
    enemyLoop();
    updateControls();
  }
}
