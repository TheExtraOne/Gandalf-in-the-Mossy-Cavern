'use strict'
import stage from '../img/MediumPlatform.png';
console.log(stage);

const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const gandalfAccelY = 0.5;
const gandalfStep = 5;
const gandalfJump = 15;

let isRightPressed = false;
let isLeftPressed = false;

let scrollOffset = 0;

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
    constructor(x, y) {
        this.positionX = x;
        this.positionY = y;
        this.width = 200;
        this.height = 20;
    }
    drawStage() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    }
}

const gandalf = new Wizzard();
const stages = [
    new Stage(200, 100),
    new Stage(500, 200),
];
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
    //подсмотрен такой трюк в интернете
    if (isRightPressed && gandalf.speedX === 0) {
        scrollOffset += gandalfStep;
        stages.forEach(stage => {stage.positionX -= gandalfStep});
    }
    if (isLeftPressed && gandalf.speedX === 0) {
        scrollOffset -= gandalfStep;
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

    //условия победы
    if (scrollOffset > 1000) {
        console.log('you win');
    }

    gandalf.drawNewPosition();
    stages.forEach(stage => {stage.drawStage()});
    
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
    /*//клавиша S
    if (event.code === 'KeyS') {
        console.log('KeyS');
    }*/
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
    /*//клавиша S
    if (event.code === 'KeyS') {
        console.log('KeyS');
    }*/
}
