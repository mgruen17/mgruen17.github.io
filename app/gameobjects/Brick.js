class Brick {
    constructor(context, id, xPos, yPos, color, width, height, hitsToDisappear, powerUp) {
        this.context = context;
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.width = width;
        this.height = height;
        this.hitCount = 0;
        this.hitsToDisappear = hitsToDisappear;
        this.powerUp = powerUp;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.hitCount > 0 ? "#FFFFFF" : this.color;
        this.context.fillRect(this.xPos, this.yPos, this.width, this.height);
        this.context.closePath();
        if (this.powerUp == "addBall") {
            this.context.beginPath();
            this.context.arc(this.xPos + (this.width / 2), this.yPos + (this.height / 2), (this.height / 2) - 1, 0, 2 * Math.PI);
            this.context.fillStyle = "#000000";
            this.context.fill();
            this.context.closePath();
            this.context.beginPath();
            this.context.arc(this.xPos + (this.width / 2), this.yPos + (this.height / 2), (this.height / 2) - 2, 0, 2 * Math.PI);
            this.context.fillStyle = "#FFFFFF";
            this.context.fill();
            this.context.closePath();
        }
    }

    count() {
        this.hitCount++;
    }
    
    // Checks, if brick has to disappear
    active() {
        return this.hitCount < this.hitsToDisappear;
    }
}
