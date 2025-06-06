const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

const box = 40;
let score = 0;

const scoreDisplay = document.getElementById("score");
scoreDisplay.textContent = "Score: " + score;

const headImg = new Image();
headImg.src = "images/snake.png";

const bodyImg = new Image();
bodyImg.src = "images/body.png";

const foodImg = new Image();
foodImg.src = "images/food Background Removed.png";

// Sounds
const footEatSound = document.getElementById("footEatSound");
const gameOverSound = document.getElementById("gameOverSound");

let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};
let direction = "RIGHT";
let game;

let imagesLoaded = 0;
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 3) {
    startGame();
  }
}

headImg.onload = imageLoaded;
bodyImg.onload = imageLoaded;
foodImg.onload = imageLoaded;

document.addEventListener("keydown", setDirection);

function setDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

  for (let i = 0; i < snake.length; i++) {
    const part = snake[i];
    if (i === 0) ctx.drawImage(headImg, part.x, part.y, box, box);
    else ctx.drawImage(bodyImg, part.x, part.y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  if (headX === food.x && headY === food.y) {
    score++;
    footEatSound.play();
    scoreDisplay.textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 || headX >= gameBoard.width ||
    headY < 0 || headY >= gameBoard.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    setTimeout(() => {
      alert("Game Over! Score: " + score);
    }, 100);
    return;
  }

  snake.unshift(newHead);
}

function collision(head, body) {
  for (let segment of body) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }
  return false;
}

function startGame() {
  if (game) clearInterval(game);
  game = setInterval(draw, 200);
}

function resetGame() {
  clearInterval(game);

  score = 0;
  scoreDisplay.textContent = "Score: " + score;
  snake = [{ x: 9 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
  direction = "RIGHT";
  startGame();
}

document.querySelector(".reset").addEventListener("click", resetGame);
