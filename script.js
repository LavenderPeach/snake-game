const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restart = document.getElementById('.restart-btn');
// Size of each grid cell

const gridCellSize = 20;

// Calc # of cells

const gridSizeX = math.floor(canvas.width / gridCellSize);
const gridSizeY = math.floor(canvas.height / gridCellSize);

const snake = {
    body: [{x: 5, y: 5}],
    direction: {x: 1, y: 0},
};

// Loop interval (ms)
const gameLoopInterval = 100;
let gameLoopId;
restart-btn.addEventListener ('click', () => {

 // respond to user input
    function handleKeyPress(event){
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
})
function handleGameOver() {
    alert('You are so bad. Like... bad. You score ' + (snake.body.length - 1) + ' points. Think you can do any better?');
    document.removeEventListener('keydown', handleKeyPress);
}

gameLoopId = setInterval(gameLoop, gameLoopInterval);

function gameLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const head = { ...snake.body[0]};
    head.x += snake.direction.x;
    head.y += snake.direction.y;
    snake.body.unshift(head);

    if(!hasEatenFood) {
        snake.body.pop();
    } else {
        hasEatenFood = false;
    }

    if (head.x === food.x && head.y === food.y) {
        hasEatenFood = true;
        food = generateRandomFoodPosition();
    }

    const headX = snake.body[0].x;
    const headY = snake.body[0].y;
    const hitBoundaryX = headX < 0 || headX >= gridSizeX;
    const hitBoundaryY = headY < 0 || headY >= gridSizeY;
    const suicide = snake.body.some((segment, index) => index !== 0 && segment.x === headX && segment.y === headY);

    if (hitBoundaryX || hitBoundaryY || suicide) {
        clearInterval(gameLoopId);
        handleGameOver();
        return;
    }
}