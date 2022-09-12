'use strict'

const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const gandalfAccelY = 0.5;
const gandalfStep = 5;
const gandalfJump = 15;

let gandalf;
let stages;
let backgroundObjects;

let isRightPressed = false;
let isLeftPressed = false;

let platform = new Image();
platform.src = "img/platform.png";

let stage = new Image();
stage.src = 'img/MediumStage1.png';

let background = new Image();
background.src = 'img/Background1.jpg';

let sideBackground = new Image();
sideBackground.src = 'img/Background2.jpg';

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

reset();
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
        backgroundObjects.forEach(backgroundObject => {backgroundObject.positionX -= 0.75 * gandalfStep});
        stages.forEach(stage => {stage.positionX -= gandalfStep});
    }
    if (isLeftPressed && gandalf.speedX === 0) {
        //scrollOffset -= gandalfStep;
        backgroundObjects.forEach(backgroundObject => {backgroundObject.positionX += 0.75 * gandalfStep});
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
    if (//условие победы: дойти до конца) {
        console.log('you win');
    }*/

    //условие проигрыша: если игрок упал - ресет
    if (gandalf.positionY > canvas.height) {
        reset();
    }

    backgroundObjects.forEach(backgroundObject => backgroundObject.drawBackground());
    stages.forEach(stage => stage.drawStage());
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

function reset() {
    gandalf = new Wizzard();
    stages = [
        new Stage(200, 100, platform, 273, 120),
        new Stage(500, 200, platform, 273, 120),
        new Stage(0, 540, stage, 231, 120),
        new Stage(230, 540, stage, 231, 120),
        new Stage(550, 540, stage, 231, 120),
        new Stage(781, 540, stage, 231, 120),
    ];
    backgroundObjects = [
        new Background(0, 0, background, 769, 610),
        new Background(769, 0, sideBackground, 769, 610),
        new Background(-20, 400, mossSlopes, 7163, 371),   
    ];
    //let scrollOffset = 0;
}
