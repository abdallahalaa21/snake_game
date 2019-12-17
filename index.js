const canvas = document.getElementById("gamePlay");
const scoreEle = document.getElementById("score");
if (innerWidth < 500) {
  canvas.width = window.screen.width - 10;
}

if (innerHeight < 600) {
  canvas.height = window.screen.height - 100;
}
const ctx = canvas.getContext("2d");
const scale = 10;
ctx.scale(scale, scale);
let dir, fruit, snake, totalScore;
let x1, y1, x2, y2;
const failAudio = new Audio("./assets/fail.mp3");
const eatingAudio = new Audio("./assets/eat.mp3");

const directions = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 }
};

const initialState = () => {
  dir = directions.right;
  snake = [
    { x: 4, y: 0 },
    { x: 3, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ];
  makeFruit();
  totalScore = 0;
  scoreEle.innerHTML = 0;
};

window.addEventListener("keydown", e => {
  if (e.keyCode === 40 && dir.y !== -1) {
    dir = directions.down;
  }
  if (e.keyCode === 38 && dir.y !== 1) {
    dir = directions.up;
  }
  if (e.keyCode === 39 && dir.x !== -1) {
    dir = directions.right;
  }
  if (e.keyCode === 37 && dir.x !== 1) {
    dir = directions.left;
  }
});

window.addEventListener("touchstart", e => {
  handleMobile(e);
});

window.addEventListener("touchend", e => {
  handleMobile(e);
});

const handleMobile = e => {
  if (e && e.touches[0] && e.touches[0].screenX) {
    x1 = e.touches[0].screenX;
    y1 = e.touches[0].screenY;
  }
  if (e && e.changedTouches[0] && e.changedTouches[0].screenX) {
    x2 = e.changedTouches[0].screenX;
    y2 = e.changedTouches[0].screenY;
  }
  if (Math.abs((x1 - x2) / (y1 - y2)) > 1) {
    if (x1 - x2 > 0 && dir.x !== 1) {
      // console.log("left");
      dir = directions.left;
    }
    if (x1 - x2 < 0 && dir.x !== -1) {
      // console.log("right");
      dir = directions.right;
    }
  }
  if (Math.abs((y1 - y2) / (x1 - x2)) > 1) {
    if (y1 - y2 > 0 && dir.y !== 1) {
      // console.log("up");
      dir = directions.up;
    }
    if (y1 - y2 < 0 && dir.y !== -1) {
      // console.log("down");
      dir = directions.down;
    }
  }
};

const move = () => {
  snake.unshift({ x: snake[0].x + dir.x, y: snake[0].y + dir.y });
  if (snake[0].x == Math.floor(canvas.width / scale)) {
    snake[0].x = 0;
  }
  if (snake[0].y == Math.floor(canvas.height / scale)) {
    snake[0].y = 0;
  }
  if (snake[0].x < 0) {
    snake[0].x = Math.floor(canvas.width / scale) - 1;
  }
  if (snake[0].y < 0) {
    snake[0].y = Math.floor(canvas.height / scale) - 1;
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff971d";
  ctx.fillRect(fruit.x, fruit.y, 1, 1);
  ctx.fillStyle = "#ffffff";
  snake.forEach(({ x, y }) => ctx.fillRect(x, y, 1, 1));
};

const makeFruit = () => {
  fruit = {
    x: Math.floor(Math.random() * (canvas.width / scale)),
    y: Math.floor(Math.random() * (canvas.height / scale))
  };
  snake.forEach(({ x, y }) => {
    if (fruit.x === x && fruit.y === y) {
      makeFruit();
    }
  });
};

const eating = () => {
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    eatingAudio.play();
    makeFruit();
    totalScore++;
    scoreEle.innerText = totalScore;
    return true;
  } else {
    return false;
  }
};

const checkDied = () => {
  for (let i = 3; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      failAudio.play();
      alert("dieeed");
      initialState();
    }
  }
};

(() => {
  initialState();
  draw();
  window.setInterval(() => {
    move();
    const isEated = eating();
    if (!isEated) {
      snake.pop(snake.length);
    }
    checkDied();
    draw();
  }, 100);
})();
