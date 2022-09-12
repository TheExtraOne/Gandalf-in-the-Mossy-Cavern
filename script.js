'use strict'

const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const gandalfAccelY = 0.5;
const gandalfStep = 5;
const gandalfJump = 15;

let isRightPressed = false;
let isLeftPressed = false;

//let scrollOffset = 0;

let platform = new Image();
platform.src = "img/platform.png";

let stage = new Image();
stage.src = 'img/MediumStage1.png';

let background = new Image();
background.src = 'img/Background.jpg';

let mossSlopes = new Image();
mossSlopes.src = 'img/mossySlopes.png';

document.addEventListener('keydown', startMove, false);
document.addEventListener('keyup', finishMove, false);

class Wizzard {
    constructor() {
        this.positionX = 100;
        this.positionY = 100;
        this.width = 30;
        this.height = 30;
        this.speedX = 0;
        this.speedY = 0;
        this.accelY = gandalfAccelY;
    }
    drawNewPosition() {
        if (this.positionY + this.height + this.speedY < canvas.height) {
            this.speedY += this.accelY;
        } else {
            this.speedY = 0;
        }

        this.positionX += this.speedX;
        this.positionY += this.speedY;

        ctx.fillStyle = 'blue';
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    }
}

class Stage {
    constructor(x, y, image, imageWigth, imageHeight) {
        this.positionX = x;
        this.positionY = y;
        this.width = imageWigth;
        this.height = imageHeight;
        this.image = image;
    }
    drawStage() {  
        ctx.drawImage(this.image, this.positionX, this.positionY);
    }
}

class Background {
    constructor(x, y, image, imageWigth, imageHeight) {
        this.positionX = x;
        this.positionY = y;
        this.width = imageWigth;
        this.height = imageHeight;
        this.image = image;
    }
    drawBackground() {  
        ctx.drawImage(this.image, this.positionX, this.positionY);
    }
}

/*let stage = new Image();
stage.onload = function() {
	ctx.drawImage(stage, 10, 10);
};
stage.src = "img/MediumPlatform.png";*/

const gandalf = new Wizzard();
const stages = [
    new Stage(200, 100, platform, 273, 120),
    new Stage(500, 200, platform, 273, 120),
    new Stage(0, 540, stage, 231, 120),
    new Stage(230, 540, stage, 231, 120),
];
const backgroundObjects = [
    new Background(0, 0, mossSlopes, 13023, 647),
]
requestAnimationFrame(tick);

function tick() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gandalf.accelY = gandalfAccelY;

    if (isRightPressed && gandalf.positionX < 500) {
        gandalf.speedX = gandalfStep;
    } else if (isLeftPressed && gandalf.positionX > 100) {
        gandalf.speedX = -gandalfStep;
    } else {
        gandalf.speedX = 0;
    }

    //для перемещения фона во время движения игрока
    //трюк подсмотрен в интернете
    if (isRightPressed && gandalf.speedX === 0) {
        //scrollOffset += gandalfStep;
        stages.forEach(stage => {stage.positionX -= gandalfStep});
    }
    if (isLeftPressed && gandalf.speedX === 0) {
        //scrollOffset -= gandalfStep;
        stages.forEach(stage => {stage.positionX += gandalfStep});
    }

    //если игрок находится в пределах платформы
    stages.forEach(stage => {
        if (gandalf.positionY + gandalf.height <= stage.positionY &&
            gandalf.positionY + gandalf.height + gandalf.speedY >= stage.positionY &&
            gandalf.positionX + gandalf.width >= stage.positionX &&
            gandalf.positionX <= stage.positionX + stage.width) {
            gandalf.accelY = 0;
            gandalf.speedY = 0;
        }}
    );

    /*
    if (//условия победы) {
        console.log('you win');
    }*/
    backgroundObjects.forEach(backgroundObject => {backgroundObject.drawBackground()});
    stages.forEach(stage => {stage.drawStage()});
    gandalf.drawNewPosition();
    
    requestAnimationFrame(tick);
}

function startMove(event) {
    event = event || window.event;
    //вперед
    if (event.code === 'KeyD') {
        isRightPressed = true;
    }
    //назад
    if (event.code === 'KeyA') {
        isLeftPressed = true;
    }
    //прыжок
    if (event.code === 'KeyW') {
        gandalf.speedY -= gandalfJump;
    }
}

function finishMove(event) {
    event = event || window.event;
    //вперед
    if (event.code === 'KeyD') {
        isRightPressed = false;
    }
    //назад
    if (event.code === 'KeyA') {
        isLeftPressed = false;
    }
    //прыжок
    if (event.code === 'KeyW') {
        gandalf.speedY -= gandalfJump;
    }
}
