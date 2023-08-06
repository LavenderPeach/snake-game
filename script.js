const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restart = document.getElementById('restart-btn');
let gameStarted = false
let gameOverAlertShown = false

// sound
const eatSound = new Audio('eat.wav');
const hitWallSound = new Audio('hit_wall.mp3');

// play eat sound
function playEatSound() {
    eatSound.currentTime = 0;
    eatSound.play();
}

// play hit wall sound
function playHitWallSound() {
    hitWallSound.currentTime = 0;
    hitWallSound.play();
}
// Size of each grid cell 
const gridCellSize = 20;

// Calc # of cells
const gridSizeX = Math.floor(canvas.width / gridCellSize);
const gridSizeY = Math.floor(canvas.height / gridCellSize);

// the snake
const snake = {
    body: [{x: 5, y: 5}],
    direction: {x: 0, y: 0},
};

// Food position
let food = generateRandomFoodPosition();

// game variables
let hasEatenFood = false;
let score = 0;
function updateScoreboard() {
    let score = 0;
}

// function to reset game upon defeat
function resetGame() {
    snake.body = [{x: 5, y: 5}];
    snake.direction = {x: 0, y:0};
    hasEatenFood = false;
    score = 0;
    food = generateRandomFoodPosition();
    clearInterval(gameLoopId);
    document.removeEventListener('keydown', handleKeyPress);
    gameLoopId = setInterval(gameLoop, fixedSpeed);
    document.addEventListener('keydown', handleKeyPress);
    updateScoreboard();
}

// Generate random food position
function generateRandomFoodPosition() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSizeX);
        y = Math.floor(Math.random() * gridSizeY);
}   while (snake.body.some(segment => segment.x === x && segment.y === y));
    return {x, y};
}

// scoreboard update
function updateScoreboard() {
    const scoreboardElement = document.getElementById('scoreboard');
    scoreboardElement.textContent = 'Score: ' + score;
}

// Draw food on Canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridCellSize, food.y * gridCellSize, gridCellSize, gridCellSize);
}

// draw snake on canvas
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.body.forEach((segment) => {
        ctx.fillRect(segment.x * gridCellSize, segment.y * gridCellSize, gridCellSize, gridCellSize);
    });
}

function drawGridLines() {
    ctx.strokeStyle = "#000";
    for (let x = 0; x < canvas.width; x += gridCellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridCellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Loop interval (ms)
const snakeSpeed = 6;
const fixedSpeed = 1 / snakeSpeed * 1000;
let lastMoveTime = Date.now();
let gameLoopId;
restart.addEventListener ('click', () => {
    resetGame();
    gameLoopId = setInterval(gameLoop, fixedSpeed);
});

 // respond to user input
function handleKeyPress(event){
    if (snake.direction === null) {
        gameLoopId = setInterval(gameLoop, fixedSpeed);
    }

    if (!gameStarted) {
        gameLoopId = setInterval(gameLoop, fixedSpeed);
        gameStarted = true
    }

    if (event.key === 'ArrowUp' && snake.direction.y !== 1) {
        snake.direction = {x: 0, y: -1};
    } else if (event.key === 'ArrowDown' && snake.direction.y !== -1) {
         snake.direction = {x: 0, y: 1};
    } else if (event.key === 'ArrowRight' && snake.direction.x !== -1) {
         snake.direction = {x: 1, y: 0};
    } else if (event.key === 'ArrowLeft' && snake.direction.x !== 1) {
       snake.direction = {x: -1, y: 0};
    }
 }
document.addEventListener('keydown', handleKeyPress);

// Game over function
function handleGameOver() {
    if (!gameOverAlertShown) {
        alert('You are bad. Like... so bad. You scored ' + (snake.body.length - 1) + ' points. Think you can do any better?');
    }
    document.removeEventListener('keydown', handleKeyPress);
    resetGame();
}

function showGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score;
    modal.style.display = 'block';
}

function hideGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display ='none';
    const restartGameBtn = document.getElementById('restartGameBtn');
    restartGameBtn.addEventListener('click', () => {
        hideGameOverModal();
        resetGame();
        gameLoopId = setInterval(gameLoop, fixedSpeed);
    });
}
gameLoopId = setInterval(gameLoop, fixedSpeed);

// INSIDE GAME LOOP
function gameLoop() {

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastMoveTime;
    if (timeElapsed >= fixedSpeed) {
        lastMoveTime = currentTime;
      
        // define head of snake and death when snake hits a boundary
       const headX = snake.body[0].x;
       const headY = snake.body[0].y;
       const hitBoundaryX = headX < 0 || headX >= gridSizeX;
       const hitBoundaryY = headY < 0 || headY >= gridSizeY; 
       const suicide = snake.body.some((segment, index) => index !== 0 && segment.x === headX && segment.y === headY);
    
       if (snake.direction !== null) {
       const head = { ...snake.body[0]};
       head.x += snake.direction.x;
       head.y += snake.direction.y;
       snake.body.unshift(head);
   
       if(!hasEatenFood) {
           snake.body.pop();
       } else {
           hasEatenFood = false;
       }
   
       // update game if snake eats food
       if (head.x === food.x && head.y === food.y) {
           hasEatenFood = true;
           playEatSound();
           score++; // Increase score after snake eats
           updateScoreboard(); // update scoreboard
           food = generateRandomFoodPosition();
       }
   
       // check if game over condition is met
       if (hitBoundaryX || hitBoundaryY || suicide) {
           clearInterval(gameLoopId);
           playHitWallSound();
           handleGameOver();
           return;
       }
    }}
 
 
    // clear canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // draw snake + food + grid lines on canvas
    drawFood();
    drawSnake();
    drawGridLines();

    // repeat loop
    requestAnimationFrame(gameLoop);
}

