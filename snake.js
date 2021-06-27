function snake() {
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
        frameCount = frameThreshold;

        e.preventDefault();
    });

    const ctx = canvas.getContext('2d');
    clearCanvas(ctx);

    const snakeParts = [
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

    const frameThreshold = 10;
    let frameCount = 1;

    window.requestAnimationFrame(draw);

    function draw() {
        if (frameCount <= frameThreshold) {
            frameCount++;
            window.requestAnimationFrame(draw);
            return;
        }

        clearCanvas(ctx);
        snakeParts.forEach((part) => drawSnakePart(ctx, part.x, part.y));

        // update snake's position
        for (let i = 0; i < snakeParts.length - 1; i += 2) {
            const temp = { x: snakeParts[i].x, y: snakeParts[i].y };
            moveSnake(snakeParts[i], currentDirection.value);

            snakeParts[i+1] = temp;
        }

        // reset the frame count
        frameCount = 1;
        window.requestAnimationFrame(draw);
    }

    function clearCanvas(ctx) {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, 300, 300);
    }

    function drawSnakePart(ctx, x, y) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, snakePartSize, snakePartSize);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, snakePartSize, snakePartSize);
    }

    function moveSnake(snakePart, direction) {
        if (direction === directions.left) {
            snakePart.x -= moveAmount;
        }
        else if (direction === directions.up) {
            snakePart.y -= moveAmount;
        }
        else if (direction === directions.right) {
            snakePart.x += moveAmount;
        }
        else if (direction === directions.down) {
            snakePart.y += moveAmount;
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
}