var collisionChecker = (function () {

    function privateCheckCollision(balls, item, margin) {
        var collision = false;

        // Calculate the items outer borders
        var itemBottom = item.yPos + item.height;
        var itemTop = item.yPos;
        var itemRight = item.xPos + item.width;
        var itemLeft = item.xPos;

        // Iterate through all balls
        balls.forEach(function (ball) {

            // Calculate the balls outer borders
            var ballBottom = ball.yPos + ball.radius;
            var ballTop = ball.yPos - ball.radius;
            var ballRight = ball.xPos + ball.radius;
            var ballLeft = ball.xPos - ball.radius;

            // Only check for collisions if ball touches item
            if (
                ballBottom >= itemTop &&
                ballTop <= itemBottom &&
                ballRight >= itemLeft &&
                ballLeft <= itemRight
            ) {
                // Sides are identified as follows:
                // .\........./.
                // ..\_______/.. 
                // ..|\...../|..
                // ..|.\.../.|..
                // ..|..\./..|..
                // ..|...X...|..
                // ..|../.\..|..
                // ..|./...\.|..
                // ..|/_____\|..
                // ../.......\..
                // ./.........\.
                // The item is splitted by two diagonal lines from corner to corner. These can be seen as graphs of linear functions.
                // So these functions are calculated by the two known points: the opposing corners.
                // Now that we got the item splitted, we can check, in which part the ball touches it.

                var ascendingCollisionLine = calculateLine(item.xPos, item.yPos + item.height, item.xPos + item.width, item.yPos);
                var descendingCollisionLine = calculateLine(item.xPos, item.yPos, item.xPos + item.width, item.yPos + item.height);

                // Check if item is a Brick object
                var isBrick = item instanceof Brick;

                if (
                    ( // TOP: above or on both functions
                        ball.xPos * ascendingCollisionLine["m"] + ascendingCollisionLine["b"] >= ball.yPos &&
                        ball.xPos * descendingCollisionLine["m"] + descendingCollisionLine["b"] >= ball.yPos &&
                        ball.accelerationY > 0
                    ) ||
                    ( // BOTTOM: below or on both functions
                        ball.xPos * ascendingCollisionLine["m"] + ascendingCollisionLine["b"] <= ball.yPos &&
                        ball.xPos * descendingCollisionLine["m"] + descendingCollisionLine["b"] <= ball.yPos &&
                        ball.accelerationY < 0
                    )
                ) {
                    // If the item is not a brick, it is the paddle.
                    // No further checks: bounce.
                    if (!isBrick) {
                        ball.bounceHorizontally();
                        collision = true;
                    }

                    // Bricks can be very close together so it needs to be checked that only the closer one is hit.
                    // This is done by checking if the balls center is inside this bricks span of the x axis or it's half of the margin.
                    if (isBrick && ((ball.xPos >= itemLeft - Math.ceil(margin / 2) && ball.xPos <= itemRight + Math.ceil(margin / 2)))) {
                        // Raise the brick's hitCount by 1
                        item.count();
                        
                        ball.bounceHorizontally();
                        collision = true;
                    }
                }

                if (
                    ( // LEFT: above the ascending function and below the descending function
                        ball.xPos * ascendingCollisionLine["m"] + ascendingCollisionLine["b"] > ball.yPos &&
                        ball.xPos * descendingCollisionLine["m"] + descendingCollisionLine["b"] < ball.yPos &&
                        ball.accelerationX > 0
                    ) ||
                    ( // RIGHT: below the ascending function and above the descending function
                        ball.xPos * ascendingCollisionLine["m"] + ascendingCollisionLine["b"] < ball.yPos &&
                        ball.xPos * descendingCollisionLine["m"] + descendingCollisionLine["b"] > ball.yPos &&
                        ball.accelerationX < 0
                    )
                ) {
                    // If the item is not a brick, it is the paddle.
                    // No further checks: bounce.
                    if (!isBrick) {
                        ball.bounceVertically();
                        collision = true;
                    }

                    // Bricks can be very close together so it needs to be checked that only the closer one is hit.
                    // This is done by checking if the balls center is inside this bricks span of the y axis or it's half of the margin.
                    if (isBrick && ((ball.yPos >= itemTop - Math.ceil(margin / 2) && ball.yPos <= itemBottom + Math.ceil(margin / 2)))) {
                        // Raise the brick's hitCount by 1
                        item.count();
                        
                        ball.bounceVertically();
                        collision = true;
                    }
                }
            }
        });
        return collision;
    }

    function calculateLine(x1, y1, x2, y2) {
        // A linear function is defined by f(x)=mx+b.
        // So if we know two points of the function we can use a linear equation system to find out m and b:
        // I:  y1 = m*x1+b
        // II: y2 = m*x2+b
        // If this is solved for m and b you get the following:
        var m = (y1 - y2) / (x1 - x2)
        var b = y1 - (x1 * m)

        // These two numbers are all we need to define the function, so only they are returned.
        var obj = {};
        obj["m"] = m;
        obj["b"] = b;
        return obj;
    }

    return {
        checkCollision: privateCheckCollision
    };
})();
