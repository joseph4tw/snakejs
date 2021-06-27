function start() {
    const canvas = document.getElementById('canvas');

    if (!canvas.getContext) {
        console.warn('canvas element not supported - cannot run game');
        return;
    }

    document.addEventListener('keydown', (e) => {
        const code = e.code;
        if (code !== 'ArrowUp' && code !== 'ArrowRight' && code !== 'ArrowDown' && code !== 'ArrowLeft') {
            return;
        }

        setNewDirection(code);
        // restart frame to make it snappy
        // frameCount = frameThreshold;

        // allow player to move ahead of the animation frame request
        clearTimeout(timeoutId);
        window.cancelAnimationFrame(animationFrameRequestId);
        animationFrameRequestId = window.requestAnimationFrame(draw);

        e.preventDefault();
    });

    const ctx = canvas.getContext('2d');
    clearCanvas(ctx);

    const game = {
        gameOver: false,
        points: 0,
        apple: undefined,
    };

    const snake = [
        { x: 30, y: 30 },
        { x: 20, y: 30 },
    ];

    const snakePartSize = 10;
    const moveAmount = snakePartSize;
    const directions = {
        left: 0,
        up: 1,
        right: 2,
        down: 3,
    };

    const directionsLinkedList = new circularLinkedList();
    directionsLinkedList.append(directions.left);
    directionsLinkedList.append(directions.up);
    let currentDirection = directionsLinkedList.append(directions.right);
    directionsLinkedList.append(directions.down);

    const frameThreshold = 20;
    // let frameCount = 1;
    let timeoutId;
    let animationFrameRequestId = window.requestAnimationFrame(draw);

    function draw() {
        // if (frameCount <= frameThreshold) {
        //     frameCount++;
        //     window.requestAnimationFrame(draw);
        //     return;
        // }

        if (!game.apple) {
            game.apple = createNewApple(ctx, snake);
        }

        clearCanvas(ctx);
        drawApple(ctx, game.apple.x, game.apple.y);
        snake.forEach((part) => drawSnakePart(ctx, part.x, part.y));

        if (!canSnakeMove(snake[0], currentDirection.value)) {
            game.gameOver = true;
            return;
        }

        if (canSnakeEatApple(snake[0], currentDirection.value, game.apple)) {
            snake.unshift({x: game.apple.x, y: game.apple.y});
            game.apple = undefined;
        }

        // update body to follow head
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
        }
        // then move the head
        moveHead(snake[0], currentDirection.value);

        // reset the frame count
        // frameCount = 1;
        timeoutId = setTimeout(() => {
            animationFrameRequestId = window.requestAnimationFrame(draw);
        }, 300);
        // window.requestAnimationFrame(draw);
    }

    function clearCanvas(ctx) {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, 300, 300);
    }

    // snake-related functions -------------------------------------------------------
    function drawSnakePart(ctx, x, y) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, snakePartSize, snakePartSize);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, snakePartSize, snakePartSize);
    }

    function canSnakeMove(head, direction) {
        if (direction === directions.left) {
            if (head.x - moveAmount < 0) {
                return false;
            }
        }
        else if (direction === directions.up) {
            if (head.y - moveAmount < 0) {
                return false;
            }
        }
        else if (direction === directions.right) {
            if (head.x + moveAmount > ctx.canvas.width - snakePartSize) {
                return false;
            }
        }
        else if (direction === directions.down) {
            if (head.y + moveAmount > ctx.canvas.height - snakePartSize) {
                return false;
            }
        }

        return true;
    }

    function canSnakeEatApple(head, direction, apple) {
        if (direction === directions.left) {
            if (head.y === apple.y && head.x - moveAmount === apple.x) {
                return true;
            }
        }
        else if (direction === directions.up) {
            if (head.x === apple.x && head.y - moveAmount === apple.y) {
                return true;
            }
        }
        else if (direction === directions.right) {
            if (head.y === apple.y && head.x + moveAmount === apple.x) {
                return true;
            }
        }
        else if (direction === directions.down) {
            if (head.x === apple.x && head.y + moveAmount === apple.y) {
                return true;
            }
        }

        return false;
    }

    function moveHead(head, direction) {
        if (direction === directions.left) {
            head.x -= moveAmount;
        }
        else if (direction === directions.up) {
            head.y -= moveAmount;
        }
        else if (direction === directions.right) {
            head.x += moveAmount;
        }
        else if (direction === directions.down) {
            head.y += moveAmount;
        }
    }

    function setNewDirection(attemptedMove) {
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
    }
    // END snake-related functions ---------------------------------------------------

    // game-related functions --------------------------------------------------------
    function createNewApple(ctx, snake) {
        const xSpots = ctx.canvas.width / snakePartSize;
        const ySpots = ctx.canvas.height / snakePartSize;
        // for now, keep it simple
        const x = Math.floor(Math.random() * xSpots) * snakePartSize;
        const y = Math.floor(Math.random() * ySpots) * snakePartSize;
        return {
            x,
            y,
        };

        // const totalSpots = (ctx.canvas.width * ctx.canvas.height) / snakePartSize;
        // const memoized = {};

        // while (true) {
        //     const randomX = Math.floor(Math.random() * ctx.canvas.width);
        //     const randomY = Math.floor(Math.random() * ctx.canvas.height);
            
        // }
    }

    function isSpotOccupied(snake, x, y) {
        for (let i = 0; i < snake.length; i++) {
            if (snake.x === x && snake.y === y) {
                return true;
            }
        }

        return false;
    }

    function drawApple(ctx, x, y) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, snakePartSize, snakePartSize);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, snakePartSize, snakePartSize);
    }
    // END game-related functions ----------------------------------------------------
}