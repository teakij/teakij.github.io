import { createGame, restartGame, setDirection, startGame, stepGame, togglePause } from './snake-game.js';

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const canvas = document.querySelector('#snake-canvas');
const statusEl = document.querySelector('[data-status]');
const scoreEl = document.querySelector('[data-score]');
const highScoreEl = document.querySelector('[data-high-score]');
const actionButtons = document.querySelectorAll('[data-action]');
const directionButtons = document.querySelectorAll('[data-direction]');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (!canvas) {
  throw new Error('Game canvas is missing.');
}

const context = canvas.getContext('2d');
const gameDefaults = {
  gridWidth: 20,
  gridHeight: 20,
  random: Math.random,
};

let game = createGame(gameDefaults);
let timerId = null;

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function syncScores() {
  if (scoreEl) {
    scoreEl.textContent = String(game.score);
  }

  if (highScoreEl) {
    highScoreEl.textContent = String(game.highScore);
  }
}

function fitCanvas() {
  const maxSize = Math.min(window.innerWidth - 32, 560);
  const size = Math.max(320, Math.floor(maxSize));

  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.width = size;
  canvas.height = size;
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawGrid(size) {
  const cellSize = size / game.gridWidth;
  context.strokeStyle = 'rgba(82, 255, 155, 0.08)';
  context.lineWidth = 1;

  for (let i = 0; i <= game.gridWidth; i += 1) {
    context.beginPath();
    context.moveTo(i * cellSize, 0);
    context.lineTo(i * cellSize, size);
    context.stroke();
  }

  for (let i = 0; i <= game.gridHeight; i += 1) {
    context.beginPath();
    context.moveTo(0, i * cellSize);
    context.lineTo(size, i * cellSize);
    context.stroke();
  }
}

function drawCell(cell, color, size) {
  const cellSize = size / game.gridWidth;
  context.fillStyle = color;
  context.fillRect(cell.x * cellSize + 2, cell.y * cellSize + 2, cellSize - 4, cellSize - 4);
}

function render() {
  const size = Math.min(canvas.clientWidth || 480, canvas.clientHeight || 480);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#06100b';
  context.fillRect(0, 0, size, size);
  drawGrid(size);

  if (game.food) {
    drawCell(game.food, '#52ff9b', size);
  }

  if (game.enemy) {
    drawCell(game.enemy, '#ff7a59', size);
  }

  game.snake.forEach((segment, index) => {
    drawCell(segment, index === 0 ? '#b9ffd6' : '#1dd18a', size);
  });

  syncScores();

  if (game.gameOver) {
    setStatus(`Game over: ${game.gameOverReason}. Restart to try again.`);
  } else if (!game.started) {
    setStatus('준비 완료. Start를 누르세요.');
  } else if (game.paused) {
    setStatus('일시정지 상태입니다. Pause를 다시 누르거나 방향 입력으로 재개하세요.');
  } else {
    setStatus('진행 중입니다. 음식과 적을 조심하세요.');
  }
}

function stopLoop() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function ensureLoop() {
  if (timerId !== null || !game.started || game.paused || game.gameOver) {
    return;
  }

  timerId = window.setInterval(() => {
    if (!game.started || game.paused || game.gameOver) {
      stopLoop();
      render();
      return;
    }

    game = stepGame(game);
    render();

    if (game.gameOver) {
      stopLoop();
    }
  }, 150);
}

function beginGame() {
  game = startGame(game);
  render();
  ensureLoop();
}

function handleDirection(direction) {
  if (!game.started || game.gameOver) {
    beginGame();
  }

  game = setDirection(game, direction);
  render();
  ensureLoop();
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;

    if (action === 'start') {
      beginGame();
      return;
    }

    if (action === 'pause') {
      game = togglePause(game);
      render();
      if (game.paused || game.gameOver) {
        stopLoop();
      } else {
        ensureLoop();
      }
      return;
    }

    if (action === 'restart') {
      game = restartGame(game);
      stopLoop();
      render();
    }
  });
});

directionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleDirection(button.dataset.direction);
  });
});

document.addEventListener('keydown', (event) => {
  const directionMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
    W: 'up',
    A: 'left',
    S: 'down',
    D: 'right',
  };

  if (event.key === ' ') {
    event.preventDefault();
    game = togglePause(game);
    render();
    if (game.paused || game.gameOver) {
      stopLoop();
    } else {
      ensureLoop();
    }
    return;
  }

  if (event.key === 'Enter' && !game.started) {
    beginGame();
    return;
  }

  const direction = directionMap[event.key];
  if (direction) {
    event.preventDefault();
    handleDirection(direction);
  }
});

window.addEventListener('resize', () => {
  fitCanvas();
  render();
});

fitCanvas();
render();
