const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const snakeBoxSize = 30;
const snake = [
    { x:270, y:240 }
];

let direction, loopId;

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index == snake.length -1){
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, snakeBoxSize, snakeBoxSize);
    });
}

const moveSnake = () => {
    if(!direction) return;

    const snakeHead = snake[snake.length -1];

    switch(direction){
        case "right":
            snake.push({ x: snakeHead.x + snakeBoxSize, y: snakeHead.y });
            break;

        case "left":
            snake.push({ x: snakeHead.x - snakeBoxSize, y: snakeHead.y });
            break;

        case "up":
            snake.push({ x: snakeHead.x, y: snakeHead.y - snakeBoxSize });
            break;

        case "down":
            snake.push({ x: snakeHead.x, y: snakeHead.y + snakeBoxSize });
            break;

        default:
            console.log("Error: Invalid direction");
            break;
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawSnake();
    moveSnake();

    loopId = setTimeout(() => { gameLoop() }, 500);
}

gameLoop();

document.addEventListener("keydown", ({key}) => {
   if (key === "ArrowRight" && direction != "left") {
    direction = "right"
   };

   if (key === "ArrowLeft" && direction != "right") {
    direction = "left"
   };

   if (key === "ArrowDown" && direction != "up") {
    direction = "down"
   };

   if (key === "ArrowUp" && direction != "down") {
    direction = "up"
   }
})