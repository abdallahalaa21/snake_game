const canvas = document.getElementById("gamePlay");
const ctx = canvas.getContext("2d");
const scale = 10;
ctx.scale(scale, scale);
const scoreEle = document.getElementById("score");
let dir, fruit, snake, totalScore;

const initialState = () => {
  dir = { x: 1, y: 0 };
  fruit = { x: 15, y: 0 };
  snake = [
    { x: 4, y: 0 },
    { x: 3, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ];
  totalScore = 0;
  scoreEle.innerHTML = 0;
};

window.addEventListener("keydown", e => {
  if (e.keyCode === 40 && dir.y !== -1) {
    dir = { x: 0, y: 1 };
  }
  if (e.keyCode === 38 && dir.y !== 1) {
    dir = { x: 0, y: -1 };
  }
  if (e.keyCode === 39 && dir.x !== -1) {
    dir = { x: 1, y: 0 };
  }
  if (e.keyCode === 37 && dir.x !== 1) {
    dir = { x: -1, y: 0 };
  }
});

const move = () => {
  snake.unshift({ x: snake[0].x + dir.x, y: snake[0].y + dir.y });

  if (snake[0].x == canvas.width / scale) {
    snake[0].x = 0;
  }
  if (snake[0].y == canvas.height / scale) {
    snake[0].y = 0;
  }
  if (snake[0].x < 0) {
    snake[0].x = canvas.width / scale - 1;
  }
  if (snake[0].y < 0) {
    snake[0].y = canvas.height / scale - 1;
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
    x: Math.floor(Math.random() * 30),
    y: Math.floor(Math.random() * 30),
  };
  snake.forEach(({ x, y }) => {
    if (fruit.x === x && fruit.y === y) {
      makeFruit();
    }
  });
};

const eating = () => {
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    makeFruit();
    totalScore++;
    scoreEle.innerText = totalScore;
    return true;
  } else {
    return false;
  }
};

const checkDied = () => {
  for (let i = 4; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
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
