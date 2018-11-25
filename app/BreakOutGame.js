/*
 * This is the main script for the breakout application.
 *
 * Mouse interaction is captured here and the animation loop runs here, so that
 * the game can be drawn. This is also a good place to calculate random speeds for the
 * ball.
 *
 */
var breakOutGame = (function () {

    // private vars and constants
    var privateContext;
    var privateCanvas;

    var GAME_WIDTH = 600;
    var GAME_HEIGHT = 500;
    var DIFFICULTY = 0;
    var BRICK_ROWS = 5;
    var BRICK_COLUMNS = 13;
    var BALLSIZE = 10;
    var BALLCOLOR = "#FFFFFF";
    var BALL_POSITION_X = GAME_WIDTH / 2;
    var BALL_POSITION_Y = GAME_HEIGHT / 2;
    var BRICK_WIDTH = 40;
    var BRICK_HEIGHT = 10;

    // Which colors should be used for the bricks?
    // Index = row
    var BRICK_COLORS = [
        "#FF0000",
        "#FF0000",
        "#FFFF00",
        "#FFA500",
        "#008000"
    ]

    // Move the bricks down from the top
    var CANVAS_MARGIN_TOP = 50;

    // Calculate spaces between bricks
    var BRICK_MARGIN = (GAME_WIDTH - (BRICK_WIDTH * BRICK_COLUMNS)) / (BRICK_COLUMNS + 1);

    // Calculate max and min ball speed for randomizer and make sure it fits the brick dimensions.
    // Because the ball jumps between the frames and the jump width is defined by the speed,
    // it needs to be made sure, that the ball can not jump over a brick.
    var MAX_SPEED = (BRICK_HEIGHT <= BRICK_WIDTH ? BRICK_HEIGHT : BRICK_WIDTH) * 0.75;
    var MIN_SPEED = MAX_SPEED * 0.5;

    // How often should a brick be hit until it disappears?
    var BRICK_HITS_TO_DISAPPEAR = 1;

    var paddle;
    var bricks = [];
    var balls = [];

    function privateDraw() {
        privateContext.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        //--------------------BRICKS--------------------
        bricks.forEach(function (brick) {

            // Only draw active bricks (hitCount < hitsToDisappear)
            if (brick.active()) {
                
                // Draw bricks
                brick.draw();

                // Check if collision occured
                var collided = collisionChecker.checkCollision(balls, brick, BRICK_MARGIN);

                // Check if power up has been triggered
                if (collided && !brick.active() && brick.powerUp == "addBall") {

                    // Add ball
                    balls[balls.length] = new Ball(privateContext, brick.xPos + (brick.width / 2), brick.yPos + brick.height, BALLCOLOR, BALLSIZE, MIN_SPEED / DIFFICULTY, MAX_SPEED / DIFFICULTY);
                }
            }
        });

        //--------------------PADDLE--------------------
        // Draw paddle
        paddle.draw();
        
        // Process collisions
        collisionChecker.checkCollision(balls, paddle);

        //--------------------BALL--------------------
        // Draw balls
        balls.forEach(function (ball) {
            ball.draw();
        });

        //--------------------GAME ENDS--------------------
        // All bricks cleared
        if (bricks.filter(b => b.active()).length == 0) {
            privateSuccess();
            return;
        }

        // All balls dropped
        if (balls.filter(b => b.active).length == 0) {
            privateGameOver();
            return;
        }

        window.requestAnimationFrame(privateDraw);
    }

    // Player won the game
    function privateSuccess() {
        privateContext.font = "30px Arial";
        privateContext.textAlign = "center";
        privateContext.fillText("CONGRATULATIONS", privateCanvas.clientWidth / 2, privateCanvas.clientHeight / 2);
        privateContext.font = "20px Arial";
        privateContext.fillText("You won! Please refresh for restart!", privateCanvas.clientWidth / 2, privateCanvas.clientHeight / 2 + 30);
        balls.forEach(function (ball) {
            ball.accelerationX = 0;
            ball.accelerationY = 0;
        });
    }

    // Player lost the game
    function privateGameOver() {
        privateContext.font = "30px Arial";
        privateContext.textAlign = "center";
        privateContext.fillText("GAME OVER", privateContext.canvas.clientWidth / 2, privateContext.canvas.clientHeight / 2);
        privateContext.font = "20px Arial";
        privateContext.fillText("Please refresh for restart", privateContext.canvas.clientWidth / 2, privateContext.canvas.clientHeight / 2 + 30);
    }

    function privateSetContext(canvas) {
        privateCanvas = canvas;
        privateContext = canvas.getContext("2d");
    }

    function publicInit(canvas, difficulty) {
        privateSetContext(canvas);
        window.requestAnimationFrame(privateDraw);
        
        // Set global variable for difficulty:
        // 1 = Hard
        // 2 = Medium
        // 3 = Easy
        // 4 = Super Easy
        DIFFICULTY = difficulty;

        //--------------------BRICKS--------------------
        // Set position for first brick
        var brickPositionX = BRICK_MARGIN;
        var brickPositionY = BRICK_MARGIN + CANVAS_MARGIN_TOP;

        // Set random positions for power up bricks
        var powerUpIndexes = [];
        for (var i = 0; i < (DIFFICULTY == 4 ? 50 : 5); i++) {
            var index = getRandom(0, (BRICK_ROWS * BRICK_COLUMNS) - 1);
            if (powerUpIndexes.includes(index))
                i--;
            else
                powerUpIndexes[i] = index;
        }

        // Create bricks
        var brickIndex = 0;
        for (r = 0; r < BRICK_ROWS; r++) {
            for (i = 0; i < BRICK_COLUMNS; i++) {

                // Create single brick and draw
                bricks[brickIndex] = new Brick(privateContext,
                    brickIndex,
                    brickPositionX,
                    brickPositionY,
                    BRICK_COLORS[r],
                    BRICK_WIDTH,
                    BRICK_HEIGHT,
                    BRICK_HITS_TO_DISAPPEAR + (DIFFICULTY == 1 ? 1 : 0),
                    powerUpIndexes.includes(brickIndex) ? "addBall" : ""
                );
                brickIndex++;

                // Set position for next brick
                brickPositionX += BRICK_MARGIN + BRICK_WIDTH;
            }

            // Set positions for next row
            brickPositionY += BRICK_MARGIN + BRICK_HEIGHT;
            brickPositionX = BRICK_MARGIN;

        }

        //--------------------PADDLE--------------------
        // Set listener for paddle movement
        canvas.addEventListener('mousemove', updatePaddlePosition);
        canvas.addEventListener('mouseleave', updatePaddlePosition);

        // Set paddle color
        var paddleColor = "#FFFFFF";

        // Set paddle dimensions
        var paddleWidth = 100;
        var paddleHeight = 20;

        // Set paddle positions
        // Start x position is center
        var paddlePositionX = (GAME_WIDTH / 2) - (paddleWidth / 2);
        var paddlePositionY = 400;

        // Create paddle
        paddle = new Paddle(privateContext, paddlePositionX, paddlePositionY, paddleColor, paddleWidth, paddleHeight);

        //--------------------BALL--------------------
        // Create ball
        var ball = new Ball(privateContext, BALL_POSITION_X, BALL_POSITION_Y, BALLCOLOR, BALLSIZE, MIN_SPEED / DIFFICULTY, MAX_SPEED / DIFFICULTY);
        balls[0] = ball;
    }

    function updatePaddlePosition(event) {

        // Read mouse position from event
        var newX = event.layerX;

        // Calculate minimum and maximum allowed mouse positions
        var minX = 0 + (paddle.width / 2);
        var maxX = GAME_WIDTH - (paddle.width / 2);

        // Handle mouse position inside allowed x values
        if (newX >= minX && newX <= maxX)
            paddle.updateXPos(newX - (paddle.width / 2));

        // Handle mouse position below allowed x values
        else if (newX < minX)
            paddle.updateXPos(0)

        // Handle mouse position above allowed x values
        else if (newX > maxX)
            paddle.updateXPos(GAME_WIDTH - paddle.width)
    }

    return {
        init: publicInit
    };
})();

var canvas = document.getElementById("breakoutcanvas");
var startButton = document.getElementById("start");
startButton.addEventListener("click", startGame)

function startGame() {
    var difficulty = document.getElementById("difficulty");
    var difficultyText = document.getElementById("difficultyText");
    difficulty.style.display = "none";
    difficultyText.style.display = "none";
    startButton.style.display = "none";
    canvas.style.display = "block";
    breakOutGame.init(canvas, difficulty.value);
}

function getRandom(minValue, maxValue) {
    return Math.floor((Math.random() * (maxValue - minValue + 1)) + minValue);
}
