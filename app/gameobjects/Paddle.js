/* Paddle represents the players paddle used to deflect the ball in the game */
class Paddle {
    constructor(context, xPos, yPos, color, width, height) {
        this.context = context;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.fillRect(this.xPos, this.yPos, this.width, this.height);
        this.context.closePath();
    }

    updateXPos(xPos) {
        this.xPos = xPos;
    }    
}