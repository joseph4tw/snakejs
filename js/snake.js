import { CircularLinkedList } from './circularLinkedList.js';

function Snake() {
    const snake = [
        { x: 30, y: 30 },
        { x: 20, y: 30 },
        { x: 20, y: 40 },
        { x: 20, y: 50 },
        { x: 20, y: 60 },
        { x: 20, y: 70 },
        { x: 20, y: 80 },
        { x: 20, y: 90 },
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

    const directionsLinkedList = new CircularLinkedList();
    directionsLinkedList.append(directions.left);
    directionsLinkedList.append(directions.up);
    let currentDirection = directionsLinkedList.append(directions.right);
    directionsLinkedList.append(directions.down);

    let nextDirection = currentDirection;

    this.setColor = (fill) => {
        snakeFill = fill;
    };

    this.move = () => {
        currentDirection = nextDirection;
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
        if (canMoveOnCanvas(ctx)) {
            if (willEatItself()) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    };

    const canMoveOnCanvas = (ctx) => {
        if (nextDirection.value === directions.left) {
            if (head.x - moveAmount < 0) {
                return false;
            }
        }
        else if (nextDirection.value === directions.up) {
            if (head.y - moveAmount < 0) {
                return false;
            }
        }
        else if (nextDirection.value === directions.right) {
            if (head.x + moveAmount > ctx.canvas.width - snakePartSize) {
                return false;
            }
        }
        else if (nextDirection.value === directions.down) {
            if (head.y + moveAmount > ctx.canvas.height - snakePartSize) {
                return false;
            }
        }

        return true;
    };

    const willEatItself = () => {
        const nextMoveCoordinates = {
            x: undefined,
            y: undefined,
        };

        if (nextDirection.value === directions.left) {
            nextMoveCoordinates.x = head.x - moveAmount;
            nextMoveCoordinates.y = head.y;
        }
        else if (nextDirection.value === directions.up) {
            nextMoveCoordinates.x = head.x;
            nextMoveCoordinates.y = head.y - moveAmount;
        }
        else if (nextDirection.value === directions.right) {
            nextMoveCoordinates.x = head.x + moveAmount;
            nextMoveCoordinates.y = head.y;
        }
        else if (nextDirection.value === directions.down) {
            nextMoveCoordinates.x = head.x;
            nextMoveCoordinates.y = head.y + moveAmount;
        }

        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === nextMoveCoordinates.x && snake[i].y === nextMoveCoordinates.y) {
                return true;
            }
        }

        return false;
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
            nextDirection = currentDirection.prev;
        }
        else if (currentDirection.next.value === requestedDirection) {
            nextDirection = currentDirection.next;
        }
        else if (currentDirection.value === requestedDirection) {
            nextDirection = currentDirection;
        }
    };

    this.canEatApple = (apple) => {
        if (nextDirection.value === directions.left) {
            if (head.y === apple.y && head.x - moveAmount === apple.x) {
                return true;
            }
        }
        else if (nextDirection.value === directions.up) {
            if (head.x === apple.x && head.y - moveAmount === apple.y) {
                return true;
            }
        }
        else if (nextDirection.value === directions.right) {
            if (head.y === apple.y && head.x + moveAmount === apple.x) {
                return true;
            }
        }
        else if (nextDirection.value === directions.down) {
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
        ctx.fillRect(x + 1, y + 1, snakePartSize - 1, snakePartSize - 1);
    }
}

export { Snake };
