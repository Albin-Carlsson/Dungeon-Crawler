/**************************************
 * Version 1.0
 * By Albin Carlsson, 2021-05-16
 * Main code in javascript for
 * game Dungeon Crawler.
 * ***********************************/

// set up canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); //2d canvas
// 16:9 canvas aspect ratio
canvas.width = window.innerHeight * (16 / 9);
canvas.height = window.innerHeight;

document.getElementById("body").style = "margin : 0"; //margin width =0
document.body.style.overflow = "hidden"; //remove scroll-lists

// loads music on page load
function playMusic() {
  document.getElementById("music").play();
}

// loads graphics library before you can start the game
// 10 images in total
let nrLoaded = 0; // nr of images loaded

let bulletImage = new Image();
bulletImage.addEventListener("load", onLoad);
bulletImage.src = "bullet.png";

let playerImage = new Image();
playerImage.addEventListener("load", onLoad);
playerImage.src = "playerleft.png";

let playerLeftImage = new Image();
playerLeftImage.addEventListener("load", onLoad);
playerLeftImage.src = "playerleft.png";

let playerRightImage = new Image();
playerRightImage.addEventListener("load", onLoad);
playerRightImage.src = "playerright.png";

let roomImage = new Image();
roomImage.addEventListener("load", onLoad);
roomImage.src = "Stage_Basement_floor_ps.png";

let wallImage = new Image();
wallImage.addEventListener("load", onLoad);
wallImage.src = "Room_1_ps.png";

let wallImage1 = new Image();
wallImage1.addEventListener("load", onLoad);
wallImage1.src = "Room_locked.png";

let wallImage2 = new Image();
wallImage2.addEventListener("load", onLoad);
wallImage2.src = "Room_unlocked.png";

let rockImage = new Image();
rockImage.addEventListener("load", onLoad);
rockImage.src = "rock.png";

let audioImage = new Image();
audioImage.addEventListener("load", onLoad);
audioImage.src = "audioImage.png";

let heartImage = new Image();
heartImage.addEventListener("load", onLoad);
heartImage.src = "heart.png";

function onLoad() {
  this.removeEventListener("load", onLoad);
  nrLoaded++;
  // when all images are loaded
  // ie nrLoaded == 11
  // you can press the start button
  // written in menu_vilmer.js
}

// Handles keypresses
// Allows for multiple keypresses at same time
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// variables allowing rebinds
let controls = [
  "w",
  "s",
  "a",
  "d",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];
let moveUpButton = controls[0];
let moveDownButton = controls[1];
let moveLeftButton = controls[2];
let moveRightButton = controls[3];
let shootUpButton = controls[4];
let shootDownButton = controls[5];
let shootLeftButton = controls[6];
let shootRightButton = controls[7];

// enemies killed variable used in enemies_vilmer.js
let enemiesKilled = 0;
// updates keybinds on rebind
function updateKeyBinds() {
  moveUpButton = controls[0];
  moveDownButton = controls[1];
  moveLeftButton = controls[2];
  moveRightButton = controls[3];
  shootUpButton = "ArrowUp";
  shootDownButton = "ArrowDown";
  shootLeftButton = "ArrowLeft";
  shootRightButton = "ArrowRight";
}
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;
let shootUp = false;
let shootDown = false;
let shootLeft = false;
let shootRight = false;

// if keyboard key is pressed
function keyDownHandler(e) {
  if (e.key.toLowerCase() === moveUpButton) {
    moveUp = true;
  } else if (e.key.toLowerCase() === moveDownButton) {
    moveDown = true;
  } else if (e.key.toLowerCase() === moveLeftButton) {
    moveLeft = true;
  } else if (e.key.toLowerCase() === moveRightButton) {
    moveRight = true;
  } else if (e.key === shootUpButton) {
    shootUp = true;
  } else if (e.key === shootDownButton) {
    shootDown = true;
  } else if (e.key === shootLeftButton) {
    shootLeft = true;
  } else if (e.key === shootRightButton) {
    shootRight = true;
  }
}

// when keyboard key is released
function keyUpHandler(e) {
  if (e.key.toLowerCase() === moveUpButton) {
    moveUp = false;
  } else if (e.key.toLowerCase() === moveDownButton) {
    moveDown = false;
  } else if (e.key.toLowerCase() === moveLeftButton) {
    moveLeft = false;
  } else if (e.key.toLowerCase() === moveRightButton) {
    moveRight = false;
  } else if (e.key === shootUpButton) {
    shootUp = false;
  } else if (e.key === shootDownButton) {
    shootDown = false;
  } else if (e.key === shootLeftButton) {
    shootLeft = false;
  } else if (e.key === shootRightButton) {
    shootRight = false;
  }
}

// player obj
let player = {
  x: canvas.width * 0.5,
  y: canvas.height * 0.5,
  yPrevious: canvas.height * 0.5,
  xPrevious: canvas.width * 0.5,
  dx: 0,
  dy: 0,
  width: canvas.width * 0.05,
  height: canvas.width * 0.05,
  vY: 0,
  vX: 0,
  v: canvas.width * 0.004,
  health: 3,
};

// wall dimensions
let wall = {
  sideWidth: canvas.width * 0.04,
  sideHeight: canvas.height,
  topBottomWidth: canvas.width,
  topBottomHeight: canvas.width * 0.07,
  door: canvas.width * 0.07,
};
// the arrays closedwalls, openwalls, firstRoom, room1, room2
// store the coordinates of all the walls in the room
// as 1 object per wall
// with x, y, width and height values.
// arrays are used in sprite rendering and collision
// closedwalls and openwalls only include exterior wall information
// openwalls is used when level is complete.
// closedwalls or openwalls concat with room1/room2 (which only includes walls inside level)

// edge wall coordinates with no doors
let closedWalls = [
  // top wall
  { x: 0, y: 0, width: canvas.width, height: wall.topBottomHeight },
  // bottom wall
  {
    x: 0,
    y: canvas.height - wall.topBottomHeight,
    width: wall.topBottomWidth,
    height: wall.topBottomHeight,
  },
  // left wall
  { x: 0, y: 0, width: wall.sideWidth, height: wall.sideHeight },
  // right
  {
    x: canvas.width - wall.sideWidth,
    y: 0,
    width: wall.sideWidth,
    height: wall.sideHeight,
  },
];
// edge wall coordinates with  doors
let openWalls = [
  // top left wall
  {
    x: 0,
    y: 0,
    width: canvas.width / 2 - wall.door / 2,
    height: wall.topBottomHeight,
  },
  // top right wall
  {
    x: canvas.width / 2 + wall.door / 2,
    y: 0,
    width: wall.topBottomWidth,
    height: wall.topBottomHeight,
  },
  // bottom left wall
  {
    x: 0,
    y: canvas.height - wall.topBottomHeight,
    width: canvas.width / 2 - wall.door / 2,
    height: wall.topBottomHeight,
  },
  //bottom right wall
  {
    x: canvas.width / 2 + wall.door / 2,
    y: canvas.height - wall.topBottomHeight,
    width: wall.topBottomWidth,
    height: wall.topBottomHeight,
  },
  // left wall
  { x: 0, y: 0, width: wall.sideWidth, height: wall.sideHeight },
  // right
  {
    x: canvas.width - wall.sideWidth,
    y: 0,
    width: wall.sideWidth,
    height: wall.sideHeight,
  },
];
// edge walls in first room
let firstRoom = [
  {
    x: 0,
    y: 0,
    width: canvas.width / 2 - wall.door / 2,
    height: wall.topBottomHeight,
  }, // top left wall
  {
    x: canvas.width / 2 + wall.door / 2,
    y: 0,
    width: wall.topBottomWidth,
    height: wall.topBottomHeight,
  }, // top right wall
  {
    x: 0,
    y: canvas.height - wall.topBottomHeight,
    width: wall.topBottomWidth,
    height: wall.topBottomHeight,
  }, // bottom wall
  { x: 0, y: 0, width: wall.sideWidth, height: wall.sideHeight }, // left wall
  {
    x: canvas.width - wall.sideWidth,
    y: 0,
    width: wall.sideWidth,
    height: wall.sideHeight,
  }, // right
];
// used for collisions
// empty array is filled in with function gameLogic()
let cubes = [];
// standardized coordinates for cube placement
let cube = {
  // x & y represent grid - easier for making layout by multiplying x & y values from obj
  // can multiply from 1 to 15 on each axis
  x: (2 / 30) * canvas.width,
  y: (2 / 30) * canvas.height,
  width: (1 / 8) * (canvas.height - 2 * wall.sideWidth),
  height: (1 / 8) * (canvas.height - 2 * wall.sideWidth),
};
// room layouts
// startRoom has no walls
let startRoom = [];
let rooms = {
  room1: [
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height / 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height / 2 - cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height / 2 + cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height / 2 - 2 * cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height / 2 - 3 * cube.height,
      width: cube.width,
      height: cube.height,
    },

    {
      x: 10 * cube.x,
      y: canvas.height / 2 - cube.height / 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 10 * cube.x,
      y: canvas.height / 2 - cube.height / 2 - cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 10 * cube.x,
      y: canvas.height / 2 - cube.height / 2 + cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 10 * cube.x,
      y: canvas.height / 2 - cube.height / 2 + 2 * cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 10 * cube.x,
      y: canvas.height / 2 - cube.height / 2 - 2 * cube.height,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 10 * cube.x,
      y: canvas.height / 2 - cube.height / 2 + 3 * cube.height,
      width: cube.width,
      height: cube.height,
    },
  ],
  room2: [
    {
      x: 2 * cube.x,
      y: canvas.height / 2 - cube.height * 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 3 * cube.x,
      y: canvas.height / 2 - cube.height * 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height * 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 5 * cube.x,
      y: canvas.height / 2 - cube.height * 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 6 * cube.x,
      y: canvas.height / 2 - cube.height * 2,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 7 * cube.x,
      y: canvas.height / 2 - cube.height * 2,
      width: cube.width,
      height: cube.height,
    },

    {
      x: 7 * cube.x,
      y: canvas.height / 2 + cube.height * 1,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 8 * cube.x,
      y: canvas.height / 2 + cube.height * 1,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 9 * cube.x,
      y: canvas.height / 2 + cube.height * 1,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 10 * cube.x,
      y: canvas.height / 2 + cube.height * 1,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 11 * cube.x,
      y: canvas.height / 2 + cube.height * 1,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 12 * cube.x,
      y: canvas.height / 2 + cube.height * 1,
      width: cube.width,
      height: cube.height,
    },
  ],
  room3: [
    {
      x: 3 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 4 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 5 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 6 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 7 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 8 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 9 * cube.x,
      y: canvas.height / 2 - cube.height * 1.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 9 * cube.x,
      y: canvas.height / 2 - cube.height * 2.5,
      width: cube.width,
      height: cube.height,
    },
    {
      x: 9 * cube.x,
      y: canvas.height / 2 - cube.height * 3.5,
      width: cube.width,
      height: cube.height,
    },
  ],
};

// variable used for loot drops
// stores x & y coords for enemy deaths
let enemyKilledX;
let enemyKilledY;
// array for all bullets on screen
let bullets = [];
// array for all loot drops
let enemyLoots = [];

// generate room order using randomRoom
let randomRoom = Math.floor(Math.random() * Object.keys(rooms).length) + 1;
let roomOrder = [startRoom];
// for first room
roomOrder.push(rooms["room" + randomRoom]);
let roomInside = 0;

// clears screen each frame, then draws all elements
// function also updates bullet coordinates
// optional can draw true rectangles for each obj (player/walls/bullets), currently commented out
function drawScreen() {
  // clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw background
  ctx.drawImage(roomImage, 0, 0, canvas.width, canvas.height);

  // draws doors if level is complete
  // if inside first room image is drawn depicting only one door open
  if (roomInside == 0) {
    ctx.drawImage(
      wallImage,
      -canvas.width * 0.085,
      -canvas.height * 0.055,
      canvas.width * 1.17,
      canvas.height * 1.11
    );
  } else if (levelComplete) {
    ctx.drawImage(
      wallImage2,
      -canvas.width * 0.085,
      -canvas.height * 0.055,
      canvas.width * 1.17,
      canvas.height * 1.11
    );
  } else {
    ctx.drawImage(
      wallImage1,
      -canvas.width * 0.085,
      -canvas.height * 0.055,
      canvas.width * 1.17,
      canvas.height * 1.11
    );
  }

  // draw player sprite
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

  // draw bullets sprite
  for (let i = 0; i < bullets.length; i++) {
    ctx.drawImage(
      bulletImage,
      bullets[i].x - 1.45 * bulletRadius,
      bullets[i].y - 1.25 * bulletRadius,
      2.5 * bulletRadius,
      2.5 * bulletRadius
    );
  }

  // draw walls sprite
  for (let i = 0; i < cubes.length; i++) {
    if (
      cubes[i].x > wall.sideWidth &&
      cubes[i].x < canvas.width - wall.sideWidth &&
      cubes[i].y > wall.topBottomHeight &&
      cubes[i].y < canvas.height - wall.topBottomHeight
    ) {
      ctx.drawImage(
        rockImage,
        cubes[i].x,
        cubes[i].y,
        cubes[i].width,
        cubes[i].height
      );
    }
  }

  // draw timer text
  ctx.font = "60px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    "Time left: " + gameTimer,
    5 * wall.sideWidth,
    wall.topBottomHeight * 0.7
  );

  // draw health text
  ctx.fillText(
    "Health: " + player.health,
    20 * wall.sideWidth,
    wall.topBottomHeight * 0.7
  );
  // draw audio icon
  ctx.drawImage(
    audioImage,
    canvas.width - canvas.width * 0.1,
    canvas.height - canvas.height * 0.1,
    canvas.width * 0.05,
    canvas.width * 0.05
  );

  // draw heart sprites from enemies
  for (let i = 0; i < enemyLoots.length; i++) {
    // healthLootRoom == room the heart spawned in
    // drawn only if hearts are in the same room as player
    if (enemyLoots[i].healthLootRoom == roomInside) {
      ctx.drawImage(
        heartImage,
        enemyLoots[i].x,
        enemyLoots[i].y,
        enemyLoots[i].width,
        enemyLoots[i].height
      );
    }
  }

  // bullets update coordinates
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y += bullets[i].vY;
    bullets[i].x += bullets[i].vX;
  }

  // game over screen
  // activates either when timer runs out or health is 0
  // Shows score (enemieskilled)
  // shows game over message
  if (gameOver == true || player.health == 0) {
    // draws black rectangle over screen
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // white text over black screen
    ctx.fillStyle = "white";
    ctx.fillText("Game Over!", canvas.width * 0.5, canvas.height * 0.4);
    ctx.fillText(
      "You got to level: " + roomInside,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    ctx.fillText(
      "Your Score : " + enemiesKilled,
      canvas.width * 0.5,
      canvas.height * 0.6
    );
    ctx.fillText(
      "Restart by Pressing (Ctrl R)",
      canvas.width * 0.5,
      canvas.height * 0.7
    );
  }
}

function cubeCollision() {
  // *variation of aabb vs aabb collision
  // *checks if player is in cube and where it previously was
  // *you can only collide with one side at a time allowing if/else statement

  for (let i = 0; i < cubes.length; i++) {
    //if colliding with bottom side
    if (
      player.y <= cubes[i].y + cubes[i].height &&
      player.yPrevious > cubes[i].y + cubes[i].height &&
      player.x + player.width > cubes[i].x &&
      player.x < cubes[i].x + cubes[i].width
    ) {
      player.y = cubes[i].y + cubes[i].height + 0.1;
      // colliding with right side
    } else if (
      player.y + player.height > cubes[i].y &&
      player.y < cubes[i].y + cubes[i].height &&
      player.x <= cubes[i].x + cubes[i].width &&
      player.xPrevious > cubes[i].x + cubes[i].width
    ) {
      player.x = cubes[i].x + cubes[i].width + 0.1;
      // colliding with top side
    } else if (
      player.y + player.height >= cubes[i].y &&
      player.yPrevious + player.height < cubes[i].y &&
      player.x + player.width > cubes[i].x &&
      player.x < cubes[i].x + cubes[i].width
    ) {
      player.y = cubes[i].y - player.height - 0.1;
      // colliding with left side
    } else if (
      player.y + player.height > cubes[i].y &&
      player.y < cubes[i].y + cubes[i].height &&
      player.x + player.width > cubes[i].x &&
      player.xPrevious + player.width < cubes[i].x
    ) {
      player.x = cubes[i].x - player.width - 0.1;
    }
  }
}

// saves var for bulletHitAnimation()
let bulletCollisionX;
let bulletCollisionY;

function bulletCollision() {
  // simplified collision
  // bullet hitbox is a square with the length of sqrt(2)*radius
  // ie the largest square that fits inside a circle
  for (let i = 0; i < cubes.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      if (
        // bottom of circle
        (bullets[j].y + 0.5 * (Math.sqrt(2) * bulletRadius) > cubes[i].y &&
          // top of circle
          bullets[j].y - 0.5 * (Math.sqrt(2) * bulletRadius) <
            cubes[i].y + cubes[i].height &&
          // left of circle
          bullets[j].x - 0.5 * (Math.sqrt(2) * bulletRadius) <
            cubes[i].x + cubes[i].width &&
          // right of circle
          bullets[j].x + 0.5 * (Math.sqrt(2) * bulletRadius) > cubes[i].x) ||
        // leaves top of screen
        bullets[j].y < 0 ||
        // leaves bottom of screen
        bullets[j].y > canvas.height
      ) {
        bullets.splice(j, 1);
      }
    }
  }
}

function movePlayer() {
  // saves previous pos for collision resolution
  player.yPrevious = player.y;
  player.xPrevious = player.x;

  var diagonalSpeed = 1 / Math.sqrt(2);

  switch (true) {
    // move up
    case (moveUp && moveLeft == false && moveRight == false) ||
      (moveUp && moveLeft && moveRight && moveDown == false):
      player.vY = -player.v;
      player.y += player.vY;
      break;
    // move down
    case (moveDown && moveLeft == false && moveRight == false) ||
      (moveDown && moveLeft && moveRight && moveUp == false):
      player.vY = player.v;
      player.y += player.vY;
      break;
    // move left
    case (moveLeft &&
      moveUp == false &&
      moveDown == false &&
      moveRight == false) ||
      (moveLeft && moveDown && moveUp && moveRight == false):
      player.vX = -player.v;
      player.x += player.vX;
      playerImage = playerLeftImage;
      break;
    // move right
    case (moveRight &&
      moveUp == false &&
      moveDown == false &&
      moveLeft == false) ||
      (moveRight && moveDown && moveUp && moveLeft == false):
      player.vX = player.v;
      player.x += player.vX;
      playerImage = playerRightImage;
      break;
    // up right
    case moveRight && moveUp && moveLeft == false && moveDown == false:
      player.vX = player.v * diagonalSpeed;
      player.vY = -player.v * diagonalSpeed;
      player.x += player.vX;
      player.y += player.vY;
      playerImage = playerRightImage;
      break;
    // down right
    case moveRight && moveDown && moveLeft == false && moveUp == false:
      player.vX = player.v * diagonalSpeed;
      player.vY = player.v * diagonalSpeed;
      player.x += player.vX;
      player.y += player.vX;
      playerImage = playerRightImage;
      break;
    // up left
    case moveLeft && moveUp && moveRight == false && moveDown == false:
      player.vX = -player.v * diagonalSpeed;
      player.vY = -player.v * diagonalSpeed;
      player.x += player.vX;
      player.y += player.vY;
      playerImage = playerLeftImage;
      break;
    // down left
    case moveLeft && moveDown && moveRight == false && moveUp == false:
      player.vX = -player.v * diagonalSpeed;
      player.vY = player.v * diagonalSpeed;
      player.x += player.vX;
      player.y += player.vY;
      playerImage = playerLeftImage;
      break;
    // left & right
    // or up & down
    // or all buttons together
    // or no buttons
    // ie all keypresses where the player does not move
    case (moveLeft && moveRight && moveUp == false && moveDown == false) ||
      (moveUp && moveDown && moveRight == false && moveLeft == false) ||
      (moveLeft && moveDown && moveRight && moveUp) ||
      (moveLeft == false &&
        moveRight == false &&
        moveDown == false &&
        moveUp == false):
      player.vX = 0;
      player.vY = 0;
      break;
  }
}

// bullet info
let cooldown = false;
let timeBetweenBullets = 450; //ms
let bulletRadius = canvas.height * 0.02;

// bullet velocity
let bulletVX = canvas.height * 0.01;
let bulletVY = canvas.height * 0.01;

// function pushes bullet type to array: bullets
// bullet position updates in drawScreen()
function shootProjectile() {
  // returns function if shooting too rapdily
  if (cooldown) {
    return;
  }
  // objects for each cardinal direction a bullet can travel
  let upBullet = {
    x: player.x + 0.5 * player.width,
    y: player.y,
    radius: bulletRadius,
    vX: 0,
    vY: -bulletVY,
  };
  let downBullet = {
    x: player.x + 0.5 * player.width,
    y: player.y + player.height,
    radius: bulletRadius,
    vX: 0,
    vY: bulletVY,
  };
  let leftBullet = {
    x: player.x,
    y: player.y + 0.5 * player.height,
    radius: bulletRadius,
    vX: -bulletVX,
    vY: 0,
  };
  let rightBullet = {
    x: player.x + player.width,
    y: player.y + 0.5 * player.height,
    radius: bulletRadius,
    vX: bulletVX,
    vY: 0,
  };
  // adds correct bullet obj to array bullets[]
  if (shootUp) {
    bullets.push(upBullet);
    bulletCountdown();
  } else if (shootDown) {
    bullets.push(downBullet);
    bulletCountdown();
  } else if (shootLeft) {
    bullets.push(leftBullet);
    bulletCountdown();
  } else if (shootRight) {
    bullets.push(rightBullet);
    bulletCountdown();
  }
}
// timer so you can't shoot too rapidly
// called by shootProjectile()
// cooldown time variable is controlled by timeBetweenBullets
function bulletCountdown() {
  cooldown = true;
  setTimeout(function () {
    cooldown = false;
  }, timeBetweenBullets);
}
// true when timer reaches zero or player.health = 0
let gameOver = false;
// true when all enemeies in room are killed
// called by enemies_vilmer.js
let levelComplete = false;
function gameLogic() {
  // if player goes through top door and into next room
  if (player.y < -player.width) {
    // teleport player to bottom middle of screen
    player.y = canvas.height - player.height - wall.topBottomHeight;
    levelComplete = false;
    roomInside++;
  }
  // if player goes back one room
  if (player.y > canvas.height) {
    player.y = wall.topBottomHeight;
    levelComplete = false;
    roomInside--;
  }
  // generates a new room with a random layout from list
  // when you are at the last currently generated room
  // randomizes what room type (room1, room2 and so forth)
  // will be in the next room.
  // order is saved so you can reenter old rooms
  if (roomInside === roomOrder.length) {
    randomRoom = Math.floor(Math.random() * Object.keys(rooms).length) + 1;
    roomOrder.push(rooms["room" + randomRoom]);
  }

  // gives room info to array cubes[]
  // combines if walls are open or not with walls inside level
  if (roomInside == 0) {
    cubes = firstRoom;
  } else if (levelComplete) {
    cubes = openWalls.concat(roomOrder[roomInside]);
  } else {
    cubes = closedWalls.concat(roomOrder[roomInside]);
  }
}

// game countdown
// when gameTimer = 0 game is over
let gameTimer = 60;
let timerCooldown = false;
// makes sure that timer counts down every 1000 ms
function timerCooldownFunction() {
  timerCooldown = true;
  setTimeout(function () {
    timerCooldown = false;
  }, 1000);
}
function gameCountdown() {
  // game over check
  // if game timer is 0 then game is over
  if (gameTimer == 0) {
    gameOver = true;
    return;
  }
  // does not subtract timer if it has not been one second yet
  if (timerCooldown) {
    return;
    // else subtract timer by one (each second)
  } else {
    gameTimer--;
    timerCooldownFunction();
  }
}
// called in enemies_vilmer.js damageEnemy()
// when an enemy is killed
// 33% chance to spawn heart drop
function spawnEnemyLoot() {
  let probability = Math.random();
  if (probability > 0.66) {
    enemyLoots.push({
      x: enemyKilledX,
      y: enemyKilledY,
      width: player.width,
      height: player.height,
      // stores which room it spawned in
      healthLootRoom: roomInside,
    });
  }
}

// if player collides with enemy loot (hearts)
// remove the heart from array enemyLoots
// and heal player with one hp
function pickUpEnemyLoot() {
  for (let i = 0; i < enemyLoots.length; i++) {
    if (
      player.x < enemyLoots[i].x + enemyLoots[i].width &&
      player.x + player.width > enemyLoots[i].x &&
      player.y < enemyLoots[i].y + enemyLoots[i].height &&
      player.y + player.height > enemyLoots[i].y
    ) {
      enemyLoots.splice(i, 1);
      player.health++;
    }
  }
}

// main loop called when pressing start button in menu
function mainLoop() {
  drawScreen();
  movePlayer();
  requestAnimationFrame(mainLoop);
  cubeCollision();
  gameLogic();
  shootProjectile();
  // does not check bullet collision when there are no bullets
  if (bullets.length != 0) {
    bulletCollision();
  }
  // starts timer after exiting first room
  // stops timer when inside first room after reentering
  if (levelComplete == false) {
    gameCountdown();
  }
  pickUpEnemyLoot();
}

// plays and pauses music when pressing audio button in game
let musicIsPaused = false;
canvas.addEventListener("mousedown", clicked, false);
function clicked(event) {
  // logs x & y coords for mouse click
  var x = event.clientX;
  var y = event.clientY;
  // if click is inside the square where the audio sprite is
  if (
    x > canvas.width - canvas.width * 0.1 &&
    x < canvas.width + canvas.width * 0.1 &&
    y > canvas.height - canvas.height * 0.1 &&
    y < canvas.height + canvas.height * 0.1
  ) {
    // if music is playing
    // pause the music and change sprite
    if (musicIsPaused == false) {
      document.getElementById("music").pause();
      audioImage.src = "audioImageMute.png";
      musicIsPaused = true;
    } else {
      // else, when music is paused, play music and change sprite
      document.getElementById("music").play();
      audioImage.src = "audioImage.png";
      musicIsPaused = false;
    }
  }
}
