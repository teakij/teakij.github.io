const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function cloneCells(cells) {
  return cells.map((cell) => ({ x: cell.x, y: cell.y }));
}

function cellsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function nextCell(cell, direction) {
  const vector = DIRECTIONS[direction];
  return { x: cell.x + vector.x, y: cell.y + vector.y };
}

function inBounds(cell, gridWidth, gridHeight) {
  return cell.x >= 0 && cell.y >= 0 && cell.x < gridWidth && cell.y < gridHeight;
}

function isOccupied(cell, snake, enemy) {
  return snake.some((segment) => cellsEqual(segment, cell)) || (enemy && cellsEqual(enemy, cell));
}

function pickCell(random, gridWidth, gridHeight, snake, enemy) {
  const limit = gridWidth * gridHeight * 3;
  for (let i = 0; i < limit; i += 1) {
    const candidate = {
      x: Math.floor(random() * gridWidth),
      y: Math.floor(random() * gridHeight),
    };
    if (!isOccupied(candidate, snake, enemy)) {
      return candidate;
    }
  }
  return { x: 0, y: 0 };
}

function getRandom(random) {
  return typeof random === 'function' ? random : Math.random;
}

function buildSnake(gridWidth, gridHeight) {
  const headX = Math.floor(gridWidth / 2);
  const headY = Math.floor(gridHeight / 2);
  return [
    { x: headX, y: headY },
    { x: headX - 1, y: headY },
    { x: headX - 2, y: headY },
  ];
}

export function createGame(options = {}) {
  const gridWidth = options.gridWidth ?? 20;
  const gridHeight = options.gridHeight ?? 20;
  const random = getRandom(options.random);
  const snake = cloneCells(options.snake ?? buildSnake(gridWidth, gridHeight));
  const enemy = options.enemy === undefined
    ? pickCell(random, gridWidth, gridHeight, snake, null)
    : options.enemy
      ? { x: options.enemy.x, y: options.enemy.y }
      : null;
  const food = options.food === undefined
    ? pickCell(random, gridWidth, gridHeight, snake, enemy)
    : { x: options.food.x, y: options.food.y };

  return {
    gridWidth,
    gridHeight,
    snake,
    food,
    enemy,
    direction: options.direction ?? 'right',
    nextDirection: options.nextDirection ?? options.direction ?? 'right',
    score: options.score ?? 0,
    highScore: options.highScore ?? 0,
    started: options.started ?? false,
    paused: options.paused ?? true,
    gameOver: options.gameOver ?? false,
    gameOverReason: options.gameOverReason ?? '',
  };
}

export function startGame(state) {
  if (state.gameOver) {
    return {
      ...restartGame(state),
      started: true,
      paused: false,
    };
  }

  return {
    ...state,
    started: true,
    paused: false,
    gameOver: false,
    gameOverReason: '',
  };
}

export function togglePause(state) {
  if (!state.started || state.gameOver) {
    return state;
  }

  return {
    ...state,
    paused: !state.paused,
  };
}

export function restartGame(state, random) {
  const nextRandom = getRandom(random);
  const fresh = createGame({
    gridWidth: state.gridWidth,
    gridHeight: state.gridHeight,
    random: nextRandom,
    highScore: Math.max(state.highScore, state.score),
  });

  return {
    ...fresh,
    highScore: Math.max(state.highScore, state.score),
    started: false,
    paused: true,
  };
}

export function setDirection(state, direction) {
  if (!DIRECTIONS[direction]) {
    return state;
  }

  const currentDirection = state.nextDirection ?? state.direction;
  if (state.snake.length > 1 && OPPOSITES[currentDirection] === direction) {
    return state;
  }

  return {
    ...state,
    direction,
    nextDirection: direction,
  };
}

function moveEnemy(state, random) {
  if (!state.enemy) {
    return null;
  }

  const directions = Object.keys(DIRECTIONS);
  const startIndex = Math.floor(random() * directions.length);
  const order = directions.slice(startIndex).concat(directions.slice(0, startIndex));

  for (const direction of order) {
    const candidate = nextCell(state.enemy, direction);
    if (!inBounds(candidate, state.gridWidth, state.gridHeight)) {
      continue;
    }
    if (state.snake.some((segment) => cellsEqual(segment, candidate))) {
      continue;
    }
    if (!cellsEqual(candidate, state.snake[0])) {
      return candidate;
    }
  }

  return state.enemy;
}

export function stepGame(state, random) {
  if (!state.started || state.paused || state.gameOver) {
    return state;
  }

  const nextRandom = getRandom(random);
  const direction = state.nextDirection ?? state.direction;
  const head = state.snake[0];
  const newHead = nextCell(head, direction);

  if (!inBounds(newHead, state.gridWidth, state.gridHeight)) {
    return {
      ...state,
      direction,
      gameOver: true,
      gameOverReason: 'wall collision',
    };
  }

  const currentBody = state.snake.slice(0, -1);
  if (currentBody.some((segment) => cellsEqual(segment, newHead))) {
    return {
      ...state,
      direction,
      gameOver: true,
      gameOverReason: 'self collision',
    };
  }

  if (state.enemy && cellsEqual(newHead, state.enemy)) {
    const score = state.score + 1;
    return {
      ...state,
      snake: [newHead, ...state.snake],
      direction,
      nextDirection: direction,
      score,
      highScore: Math.max(state.highScore, score),
      gameOver: true,
      gameOverReason: 'enemy collision',
    };
  }

  const ateFood = cellsEqual(newHead, state.food);
  const snake = ateFood
    ? [newHead, ...state.snake]
    : [newHead, ...state.snake.slice(0, -1)];

  const score = ateFood ? state.score + 1 : state.score;
  const enemy = moveEnemy({ ...state, snake }, nextRandom);

  if (enemy && snake.some((segment) => cellsEqual(segment, enemy))) {
    return {
      ...state,
      snake,
      enemy,
      direction,
      nextDirection: direction,
      score,
      highScore: Math.max(state.highScore, score),
      gameOver: true,
      gameOverReason: 'enemy collision',
    };
  }

  const nextFood = ateFood
    ? pickCell(nextRandom, state.gridWidth, state.gridHeight, snake, enemy)
    : state.food;

  return {
    ...state,
    snake,
    food: nextFood,
    enemy,
    direction,
    nextDirection: direction,
    score,
    highScore: Math.max(state.highScore, score),
  };
}
