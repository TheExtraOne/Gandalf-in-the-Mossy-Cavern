'use strict'

class Wizzard {
    constructor(stayRight, stayLeft, runRight, runLeft, score = 0) {
        this.positionX = 100 * scale;
        this.positionY = 100 * scale;
        this.width = 65 * scale;
        this.height = 135 * scale;
        this.speedX = 0;
        this.speedY = 0;
        this.accelY = gandalfAccelY;
        this.cadre = 0;
        this.standRight = stayRight;
        this.standLeft = stayLeft,
        this.runRight = runRight,
        this.runLeft = runLeft,
        this.currentState = this.standRight;
        this.hasPower = false;
        this.blockMovement = false;
        this.count = 0;
        this.score = score;
    }
    drawNewPosition() {
        if (this.positionY + this.height + this.speedY < canvas.height) {
            this.speedY += this.accelY;
        }

        this.positionX += this.speedX;
        this.positionY += this.speedY;

        ctx.drawImage(this.currentState, 165 * this.cadre, 0, 165, 277, this.positionX, this.positionY, this.width, this.height);
        this.cadre++;
        if (this.cadre > 79) {
            this.cadre = 0;
        }
    }
}

class Enemy {
    constructor(imageSlime, width, height, cropwidth, cropHeight, x, y, speedX, limit, isGreen = true) {
        this.positionX = x;
        this.positionY = y;
        this.speedX = speedX;
        this.speedY = 0;
        this.accelY = gandalfAccelY;
        this.image = imageSlime;
        this.width = width;
        this.height = height;
        this.cadre = 0;
        this.limit = limit;
        this.distance = 0;
        this.cropwidth = cropwidth;
        this.cropHeight = cropHeight;
        this.isGreen = isGreen;
    }
    drawEnemy() {
        if (this.positionY + this.height + this.speedY < canvas.height) {
            this.speedY += this.accelY;
        }

        this.distance += this.speedX;
        if(Math.abs(this.distance) > this.limit) {
            this.distance = 0;
            this.speedX = -this.speedX;
        }

        this.positionX += this.speedX;
        this.positionY += this.speedY;

        ctx.drawImage(this.image, this.cropwidth * this.cadre, 0, this.cropwidth, this.cropHeight, this.positionX, this.positionY, this.width, this.height);
        this.cadre++;
        if (this.cadre > 70) {
            this.cadre = 0;
        }
    }
}

class Flower {
    constructor(imageFlower, width, height, cropwidth, cropHeight, x, y, ring = false) {
        this.positionX = x;
        this.positionY = y;
        this.speedY = 0;
        this.accelY = gandalfAccelY;
        this.image = imageFlower;
        this.width = width;
        this.height = height;
        this.cadre = 0;
        this.cropwidth = cropwidth;
        this.cropHeight = cropHeight;
        this.ring = ring;
    }
    drawFlower() {
        if (this.positionY + this.height + this.speedY < canvas.height) {
            this.speedY += this.accelY;
        }

        this.positionY += this.speedY;
        if (!this.ring) {
            ctx.drawImage(this.image, this.cropwidth * this.cadre, 0, this.cropwidth, this.cropHeight, this.positionX, this.positionY, this.width, this.height);
            this.cadre++;
            if (this.cadre > 79) {
                this.cadre = 0;
            }
        } else {
            ctx.drawImage(this.image, 0, 0, this.cropwidth, this.cropHeight, this.positionX, this.positionY, this.width, this.height);
        }
    }
}

class Background {
    constructor(x, y, image, imageWigth, imageHeight, cropwidth, cropHeight, block = false) {
        this.positionX = x;
        this.positionY = y;
        this.speedX = 0;
        this.width = imageWigth;
        this.height = imageHeight;
        this.cropwidth = cropwidth;
        this.cropHeight = cropHeight;
        this.image = image;
        this.block = block;
    }
    drawBackground() {  
        this.positionX += this.speedX;
        ctx.drawImage(this.image, 0, 0, this.cropwidth, this.cropHeight, this.positionX, this.positionY, this.width, this.height);
    }
}

class FireBall {
    constructor(x, y, spedX) {
        this.positionX = x;
        this.positionY = y;
        this.spedX = spedX;
        this.radius = 8 * scale;
        this.color = '#79d9c7';
    }
    draw() {
        this.positionX += this.spedX;

        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Sphere {
    constructor(x, y, speedX, speedY, radius, color, fireworks = false) {
        this.positionX = x;
        this.positionY = y;
        this.spedX = speedX;
        this.speedY = speedY;
        this.radius = radius;
        this.color = color;
        this.accelY = gandalfAccelY;
        this.isFireworks = fireworks;
    }
    draw() {
        if (!this.isFireworks) {
            if (this.positionY + this.radius + this.speedY < canvas.height) {
                this.speedY += this.accelY * 0.1;
            }
        } else {
            if (this.positionY + this.radius + this.speedY < canvas.height) {
                this.speedY += this.accelY * 0.005;
            }
        }

        this.positionX += this.spedX;
        this.positionY += this.speedY;

        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}