import { CircularLinkedList } from './circularLinkedList.js';

function Snake() {
    const snake = [
        { x: 30, y: 30 },
        { x: 20, y: 30 },
    ];
    let head = snake[0];
    const snakePartSize = 10;
    const moveAmount = snakePartSize;
    const directions = {
        left: 0,
        up: 1,
        right: 2,
        down: 3,
    };
    let snakeFill;
    let snakeStrokeColor;

    const directionsLinkedList = new CircularLinkedList();
    directionsLinkedList.append(directions.left);
    directionsLinkedList.append(directions.up);
    let currentDirection = directionsLinkedList.append(directions.right);
    directionsLinkedList.append(directions.down);

    this.setColors = (fill, strokeColor) => {
        snakeFill = fill;
        snakeStrokeColor = strokeColor;
    };

    this.move = () => {
        // update body to follow head
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
        }
        moveHead();
    };

    this.draw = (ctx) => {
        snake.forEach((part) => drawSnakePart(ctx, part.x, part.y));
    };

    this.canMove = (ctx) => {
        if (currentDirection.value === directions.left) {
            if (head.x - moveAmount < 0) {
                return false;
            }
        }
        else if (currentDirection.value === directions.up) {
            if (head.y - moveAmount < 0) {
                return false;
            }
        }
        else if (currentDirection.value === directions.right) {
            if (head.x + moveAmount > ctx.canvas.width - snakePartSize) {
                return false;
            }
        }
        else if (currentDirection.value === directions.down) {
            if (head.y + moveAmount > ctx.canvas.height - snakePartSize) {
                return false;
            }
        }

        return true;
    };

    this.setNewDirection = (attemptedMove) => {
        let requestedDirection;

        if (attemptedMove === 'ArrowUp') {
            requestedDirection = directions.up;
        }

        if (attemptedMove === 'ArrowRight') {
            requestedDirection = directions.right;
        }

        if (attemptedMove === 'ArrowDown') {
            requestedDirection = directions.down;
        }

        if (attemptedMove === 'ArrowLeft') {
            requestedDirection = directions.left;
        }

        if (currentDirection.prev.value === requestedDirection) {
            currentDirection = currentDirection.prev;
            return;
        }
        else if (currentDirection.next.value === requestedDirection) {
            currentDirection = currentDirection.next;
            return;
        }
    };

    this.canEatApple = (apple) => {
        if (currentDirection.value === directions.left) {
            if (head.y === apple.y && head.x - moveAmount === apple.x) {
                return true;
            }
        }
        else if (currentDirection.value === directions.up) {
            if (head.x === apple.x && head.y - moveAmount === apple.y) {
                return true;
            }
        }
        else if (currentDirection.value === directions.right) {
            if (head.y === apple.y && head.x + moveAmount === apple.x) {
                return true;
            }
        }
        else if (currentDirection.value === directions.down) {
            if (head.x === apple.x && head.y + moveAmount === apple.y) {
                return true;
            }
        }

        return false;
    };

    this.eatApple = (apple) => {
        head = {x: apple.x, y: apple.y};
        snake.unshift(head);
    };

    const moveHead = () => {
        if (currentDirection.value === directions.left) {
            head.x -= moveAmount;
        }
        else if (currentDirection.value === directions.up) {
            head.y -= moveAmount;
        }
        else if (currentDirection.value === directions.right) {
            head.x += moveAmount;
        }
        else if (currentDirection.value === directions.down) {
            head.y += moveAmount;
        }
    }

    function drawSnakePart(ctx, x, y) {
        ctx.fillStyle = snakeFill;
        ctx.fillRect(x, y, snakePartSize, snakePartSize);
        ctx.strokeStyle = snakeStrokeColor;
        ctx.strokeRect(x, y, snakePartSize, snakePartSize);
    }
}

export { Snake };
