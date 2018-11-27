class Ball {
    constructor(context, xPos, yPos, color, radius, minSpeed, maxSpeed) {
        this.context = context;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.radius = radius;
        this.accelerationX = Math.pow((-1), getRandom(1, 2)) * getRandom(minSpeed, maxSpeed);
        this.accelerationY = (-1) * getRandom(minSpeed, maxSpeed);
        this.active = true;
    }

    draw() {

        // Draw ball
        this.context.beginPath();
        this.context.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.closePath();

        // Calculate next position
        this.xPos += this.accelerationX;
        this.yPos += this.accelerationY;

        // Check if ball collided with wall
        this.checkWallCollision();
    }

    checkWallCollision() {
        // Ball hits right or left wall
        if (this.xPos <= 0 + this.radius || this.xPos >= this.context.canvas.clientWidth - this.radius) {
            this.bounceVertically();
        }
        
        // Ball hits top wall
        if (this.yPos <= 0 + this.radius) {
            this.bounceHorizontally();
        }
        
        // Bottom wall => ball is falling out of the game, stop the ball
        if (this.yPos - this.radius >= this.context.canvas.clientHeight) {
            this.accelerationX = 0;
            this.accelerationY = 0;
            this.active = false;
        }
    }

    // Horizontal bounce:
    // O......../
    // .\....../.
    // ..\..../..
    // ...\../...
    // ____\/____
    // ..........
    bounceHorizontally() {
        this.accelerationY *= -1;
    }

    // Vertical bounce:
    // O..|.
    // .\.|.
    // ..\|.
    // ../|.
    // ./.|.
    // /..|.
    bounceVertically() {
        this.accelerationX *= -1;
    }
}
