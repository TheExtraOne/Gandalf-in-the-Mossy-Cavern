'use strict'

const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const startButton = document.querySelector('#startButton');

const gandalfAccelY = 0.5;
const gandalfStep = 5;
const gandalfJump = 16;
const howDeepInMoss = 21;
const howCloseToPit = 20;

const manaFlowers = document.querySelector('.mana-flowers');
const totalScore = document.querySelector('.total-score');

let gandalf;
let stages;
let slimes;
let mana;
let fireballs;
let backgroundObjects;
let backgroundImg;
let gandalfDistanceTraveled;
let lastKey;
let spheres;

let isRightPressed = false;
let isLeftPressed = false;
let isJumpPressed = false;
let isSpacePressed = false;

let stayRight = new Image();
stayRight.src = "img/StayRight.png";

let stayLeft = new Image();
stayLeft.src = "img/StayLeft.png";

let runRight = new Image();
runRight.src = "img/RunRight.png";

let runLeft = new Image();
runLeft.src = "img/RunLeft.png";

let manaFlower = new Image();
manaFlower.src = "img/ManaFlower.png";

let greenSlime = new Image();
greenSlime.src = "img/GreenSlimeTight.png";

let orangeSlime = new Image();
orangeSlime.src = "img/OrangeSlimeTight.png";

let platform = new Image();
platform.src = "img/platform.png";

let smallPlatform = new Image();
smallPlatform.src = "img/SmallPlatform.png";

let stage = new Image();
stage.src = 'img/MediumStage1.png';

let block = new Image();
block.src = 'img/SmallBlock.png';

let background = new Image();
background.src = 'img/Background1.jpg';

let sideBackground = new Image();
sideBackground.src = 'img/Background2.jpg';

let mossSlopes = new Image();
mossSlopes.src = 'img/mossySlopes.png';

let ring = new Image();
ring.src = 'img/smallRing1.png';


const moneyAudio = new Audio();
if (moneyAudio.canPlayType("audio/mpeg") == "probably"){
    moneyAudio.src = "sounds/money.mp3";
} else {
    moneyAudio.src=
    "sounds/moneyOgg.ogg";
}
const slimeAudio = new Audio();
if (slimeAudio.canPlayType("audio/mpeg") == "probably"){
    slimeAudio.src = "sounds/sqush.mp3";
} else {
    slimeAudio.src=
    "sounds/squshOgg.ogg";
}
const victoryAudio = new Audio();
if (victoryAudio.canPlayType("audio/mpeg") == "probably"){
    victoryAudio.src = "sounds/victory.mp3";
} else {
    victoryAudio.src=
    "sounds/victoryOgg.ogg";
}
const mainAudio = new Audio();
if (mainAudio.canPlayType("audio/mpeg") == "probably"){
    mainAudio.src = "sounds/general2.mp3";
} else {
    mainAudio.src=
    "sounds/general2Ogg.ogg";
}

document.addEventListener('keydown', startMove, false);
document.addEventListener('keyup', finishMove, false);
startButton.addEventListener('click', lounchMusic, false);

function lounchMusic(){
    clickSoundInit(moneyAudio);
    clickSoundInit(slimeAudio);
    clickSoundInit(victoryAudio);
    clickSoundInit(mainAudio);
}

function clickSoundInit(audio) {
    if (audio === mainAudio) {
        audio.loop = true;
        audio.play();
        return;
    }
    audio.play(); // запускаем звук
    audio.pause(); // и сразу останавливаем
}

function clickSound(audio) {
    audio.currentTime = 0; // в секундах
    audio.play();
}

//проверяю, находится ли игрок или его противник на платформе
function doesToutchThePlatform({obj, platform}) {
    return (obj.positionY + obj.height - howDeepInMoss <= platform.positionY &&
        obj.positionY + obj.height + obj.speedY - howDeepInMoss >= platform.positionY &&
        obj.positionX + obj.width - howCloseToPit >= platform.positionX &&
        obj.positionX + howCloseToPit <= platform.positionX + platform.width);
}
//проверяю, запрыгнул ли герой на врага
function doesHeroJumpOnTheEnemy({hero, enemy}) {
    return (hero.positionY + hero.height <= enemy.positionY &&
        hero.positionY + hero.height + hero.speedY  >= enemy.positionY &&
        hero.positionX + hero.width - howCloseToPit >= enemy.positionX &&
        hero.positionX + howCloseToPit <= enemy.positionX + enemy.width);
}
//проверка на соприкосновение с дном блока
function doesHeroToutchTheBlock({hero, block}) {
    return (hero.positionY < block.positionY + block.height &&
        hero.positionX + hero.width > block.positionX &&
        hero.positionX < block.positionX + block.width);
}
//проверка на соприкосновение со сторонами блока
function doesHeroToutchTheSideOfBlock({hero, block}) {
    return (hero.positionX + hero.width + hero.speedX - block.speedX > block.positionX &&
        hero.positionX + hero.speedX < block.positionX + block.width &&
        hero.positionY < block.positionY + block.height);
}
//проверка на соприкосновение со маной
function doesHeroToutchMana({hero, mana}) {
    return (hero.positionX + hero.width > mana.positionX &&
        hero.positionX < mana.positionX + mana.width &&
        hero.positionY + hero.height > mana.positionY &&
        hero.positionY < mana.positionY + mana.height);
}

function updateScore(span1, span2, hero) {
    span1.textContent = `mana-flowers: ${hero.count}`;
    span2.textContent = `total score: ${hero.score}`;
}

function winStuff(hero, powerRing) {
    hero.speedX = 0;
    if (lastKey === 'KeyD') {
        hero.currentState = hero.standRight;
    } else {
        hero.currentState = hero.standLeft;
    }
    isLeftPressed = false;
    isRightPressed = false
    hero.blockMovement = true;

    clickSound(victoryAudio);

    //салют, подсмотрено в интернете
    for (let i = 0; i < 400; i++) {
        spheres.push(new Sphere( (powerRing.positionX + powerRing.width / 2),
        canvas.height / 3,
        Math.cos(Math.PI * 2 * i/ 400) * Math.random(), 
        Math.sin(Math.PI * 2 * i/ 400) * Math.random(), 
        Math.random() * 3, 
        `hsl(${randomDiap(1,100)}, 100%, 50%)`,
        true));
    }
}

function randomDiap(n, m) {
    return Math.floor(
        Math.random() * (m - n + 1)
    ) + n;
}

class Wizzard {
    constructor(stayRight, stayLeft, runRight, runLeft) {
        this.positionX = 100;
        this.positionY = 100;
        this.width = 65;
        this.height = 135;
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
        this.score = 0;
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
        if (this.cadre > 79) {
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
    constructor(x, y, image, imageWigth, imageHeight, block = false) {
        this.positionX = x;
        this.positionY = y;
        this.speedX = 0;
        this.width = imageWigth;
        this.height = imageHeight;
        this.image = image;
        this.block = block;
    }
    drawBackground() {  
        this.positionX += this.speedX;
        ctx.drawImage(this.image, this.positionX, this.positionY);
    }
}

class FireBall {
    constructor(x, y, spedX) {
        this.positionX = x;
        this.positionY = y;
        this.spedX = spedX;
        this.radius = 8;
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

reset();
requestAnimationFrame(tick);

function tick() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gandalf.accelY = gandalfAccelY;

    if (isRightPressed && gandalf.positionX < 500) {
        gandalf.speedX = gandalfStep;
    } else if ((isLeftPressed && gandalf.positionX > 300) ||
        (isLeftPressed && gandalfDistanceTraveled === 0 && gandalf.positionX > 0)) {
        gandalf.speedX = -gandalfStep;
    } else {
        gandalf.speedX = 0;
    }

    //для перемещения фона во время движения игрока
    //трюк взят из интернета, МАГИЯ, не трогать!
    let hitSide = false;
    if (isRightPressed && gandalf.speedX === 0) {
        for (let i = 0; i < stages.length; i++){
            let stage = stages[i];
            stage.speedX = -gandalfStep;
            if (stage.block && doesHeroToutchTheSideOfBlock({hero:gandalf, block:stage})) {
                stages.forEach(stage => {stage.speedX = 0});
                hitSide = true;
                break;
            }
        }
        if (!hitSide) {
            gandalfDistanceTraveled += gandalfStep;
            backgroundObjects.forEach(backgroundObject => {backgroundObject.speedX = -0.6 * gandalfStep});
            slimes.forEach(slime => {slime.positionX -= gandalfStep});
            mana.forEach(flower => {flower.positionX -= gandalfStep});
            spheres.forEach(eachSphere => {eachSphere.positionX -= gandalfStep});
        }
    }
    if (isLeftPressed && gandalf.speedX === 0 && gandalfDistanceTraveled > 0) {
        for (let i = 0; i < stages.length; i++){
            let stage = stages[i];
            stage.speedX = gandalfStep;
            if (stage.block && doesHeroToutchTheSideOfBlock({hero:gandalf, block:stage})) {
                stages.forEach(stage => {stage.speedX = 0});
                hitSide = true;
                break;
            }
        }
        if (!hitSide) {
            gandalfDistanceTraveled -= gandalfStep;
            backgroundObjects.forEach(backgroundObject => {backgroundObject.speedX = 0.6 * gandalfStep});
            slimes.forEach(slime => {slime.positionX += gandalfStep});
            mana.forEach(flower => {flower.positionX += gandalfStep});
            spheres.forEach(eachSphere => {eachSphere.positionX += gandalfStep});
        }
    }

    //объект останавливается при падении, если соприкасается с платформой
    stages.forEach(stage => {
        if (doesToutchThePlatform({obj:gandalf, platform: stage})) {
            gandalf.accelY = 0;
            gandalf.speedY = 0;
        }
        if (stage.block && doesHeroToutchTheBlock({hero:gandalf, block:stage})) {
            gandalf.speedY = 0;
        }
        if (stage.block && doesHeroToutchTheSideOfBlock({hero:gandalf, block:stage})) {
            gandalf.speedX = 0;
        }
        slimes.forEach(slime => {
            if (doesToutchThePlatform({obj: slime, platform: stage})) {
                slime.accelY = 0;
                slime.speedY = 0;
            }
        })
        mana.forEach(flower => {
            if (doesToutchThePlatform({obj: flower, platform: stage})) {
                flower.accelY = 0;
                flower.speedY = 0;
            }
        })
    });

    //условие проигрыша: 1)если игрок упал 2)прикоснулся к слизи
    if (gandalf.positionY > canvas.height) {
        reset();
    }

    //отрисовка
    backgroundImg.forEach(backgroundstep => {
        backgroundstep.drawBackground();
        backgroundstep.speedX = 0;
    });
    backgroundObjects.forEach(backgroundObject => {
        backgroundObject.drawBackground();
        backgroundObject.speedX = 0;
    });
    mana.forEach((flower, i) => {
        if (doesHeroToutchMana({hero:gandalf, mana:flower})) {
            setTimeout(() => {
                mana.splice(i, 1);
            })
            clickSound(moneyAudio);
            gandalf.count++;
            if (flower.ring) {
                gandalf.score += 100;
                winStuff(gandalf, flower);
            } else {
                gandalf.score += 20;
            }
            if (gandalf.count > 5) {
                gandalf.hasPower = true;
            }
        }
        flower.drawFlower();
    });
    gandalf.drawNewPosition();
    slimes.forEach((slime, i) => {
        fireballs.forEach((fireball, index) => {
            if (fireball.positionX + fireball.radius > slime.positionX + gandalfJump &&
                fireball.positionX - fireball.radius < slime.positionX + slime.width - gandalfJump &&
                fireball.positionY - fireball.radius < slime.positionY + slime.height &&
                fireball.positionY + fireball.radius > slime.positionY) {
                for (let i = 0 ; i < 100; i++) {
                    let color = '#89cf7e'; //оттенок зеленого
                    if (!slime.isGreen) {
                        color = '#d1b75a'   //оттенок оранжевого
                    }
                    spheres.push(new Sphere(slime.positionX + slime.width / 2, 
                        slime.positionY + slime.height / 2, 
                        randomDiap(-10, 10) / 10, 
                        randomDiap(-10, 10) / 10, 
                        Math.random() * gandalfStep, 
                        color));
                }
                setTimeout(() => {
                    slimes.splice(i, 1);
                    fireballs.splice(index, 1);
                }, 0);
                clickSound(slimeAudio);
                gandalf.score += 10;
            }
        });
        slime.drawEnemy();
        //при прыжке на врага, игрока подбрасывает вверх, а враг исчезает. Можно использовать как трамплин
        if (doesHeroJumpOnTheEnemy({hero: gandalf, enemy: slime})) {
            for (let i = 0 ; i < 100; i++) {
                let color = '#89cf7e';  //оттенок зеленого
                    if (!slime.isGreen) {
                        color = '#d1b75a' //оттенок оранжевого
                    }
                spheres.push(new Sphere(slime.positionX + slime.width / 2, 
                    slime.positionY + slime.height / 2, 
                    randomDiap(-10, 10) / 10, 
                    randomDiap(-10, 10) / 10, 
                    Math.random() * gandalfStep, 
                    color));
            }
            setTimeout(() => {
                slimes.splice(i, 1);
            }, 0);
            gandalf.speedY -= 30;
            gandalf.score += 10;
            clickSound(slimeAudio);
            
        //если игрок соприкоснулся с врагом - ресет
        } else if (gandalf.positionX + gandalf.width >= slime.positionX &&
                gandalf.positionY + gandalf.height / 2 > slime.positionY &&
                gandalf.positionY + gandalf.height / 2 < slime.positionY + slime.height &&
                gandalf.positionX <= slime.positionX + slime.width) {
            reset();
        }
    });
    fireballs.forEach((fireball, i) => {
        if (fireball.positionX - fireball.radius > canvas.width ||
            fireball.positionX + fireball.radius < 0) {
            setTimeout(() => {
                fireballs.splice(i, 1);
            })
        }
        fireball.draw();
    });
    spheres.forEach((sphere, i) => {
        if (sphere.positionY > canvas.height) {
            setTimeout(() => {
                spheres.splice(i, 1);
            }, 0);
        } else {
            sphere.draw();
        }
    });
    stages.forEach(stage => {
        stage.drawBackground();
        stage.speedX = 0;
    });

    //Счет
    updateScore(manaFlowers, totalScore, gandalf);
    
    requestAnimationFrame(tick);
}

function startMove(event) {
    event = event || window.event;
    if (gandalf.blockMovement) {
        return;
    } else {
        //вперед
        if (event.code === 'KeyD') {
            gandalf.currentState = gandalf.runRight;
            isRightPressed = true;
            lastKey = 'KeyD';
        }
        //назад
        if (event.code === 'KeyA') {
            gandalf.currentState = gandalf.runLeft;
            isLeftPressed = true;
            lastKey = 'KeyA';
        }
        //прыжок
        if (event.code === 'KeyW') {
            if (isJumpPressed) {
                return;
            }
            else if (gandalf.speedY === 0 && !isJumpPressed) {
                gandalf.speedY = -gandalfJump;
                isJumpPressed = true;
            } 
        }
        //каст фаербола
        if (event.code === 'Space' && gandalf.hasPower) {
            if(isSpacePressed) {
                return;
            }
            if (lastKey === 'KeyD') {
                isSpacePressed = true;
                fireballs.push(new FireBall(gandalf.positionX + (gandalf.width / 2), gandalf.positionY + (gandalf.height / 2), 10));
            }
            if (lastKey === 'KeyA') {
                isSpacePressed = true;
                fireballs.push(new FireBall(gandalf.positionX + (gandalf.width / 2), gandalf.positionY + (gandalf.height / 2), -10));
            }
        }
    }
}

function finishMove(event) {
    event = event || window.event;
    if (gandalf.blockMovement) {
        return;
    } else {
        //вперед
        if (event.code === 'KeyD') {
            gandalf.currentState = gandalf.standRight;
            isRightPressed = false;
        }
        //назад
        if (event.code === 'KeyA') {
            gandalf.currentState = gandalf.standLeft;
            isLeftPressed = false;
        }
        if (event.code === 'KeyW') {
            isJumpPressed = false;
        }
        if (event.code === 'Space' && gandalf.hasPower) {
            isSpacePressed = false;
        }
    }
}

function reset() {
    gandalf = new Wizzard(stayRight, stayLeft, runRight, runLeft);
    gandalfDistanceTraveled = 0;
    mana = [
        new Flower(manaFlower, 100, 70, 338.8, 339, 200, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 600, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 1690, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 2090, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 2900, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 3800, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 4650, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 5650, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 6300, 400),
        new Flower(manaFlower, 100, 70, 338.8, 339, 7400, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 8040, 100),
        new Flower(manaFlower, 100, 70, 338.8, 339, 8960, 10),
        new Flower(ring, 80, 70, 98, 86, 9500, 400, true),
        
    ];
    spheres = [];
    fireballs = [];
    slimes = [
        new Enemy(greenSlime, 100, 90, 302, 207, 800, 100, -0.3, 150),
        new Enemy(greenSlime, 100, 90, 302, 207, 2500, 400, -0.3, 150),
        new Enemy(greenSlime, 100, 90, 302, 207, 3580, 100, -0.3, 170),
        new Enemy(greenSlime, 100, 90, 302, 207, 3850, 100, -0.3, 170),
        new Enemy(greenSlime, 100, 90, 302, 207, 4160, 100, -0.3, 0),
        new Enemy(greenSlime, 100, 90, 302, 207, 5200, 400, -0.3, 0),
        new Enemy(greenSlime, 100, 90, 302, 207, 5600, 400, -0.3, 150),
        new Enemy(orangeSlime, 120, 120, 512, 340, 5800, 100, -0.3, 150, false),
        new Enemy(orangeSlime, 120, 120, 512, 340, 6600, 100, -0.3, 150, false),
        new Enemy(greenSlime, 100, 90, 302, 207, 6970, 300, -0.3, 100),
        new Enemy(orangeSlime, 120, 120, 512, 340, 7200, 100, -0.3, 150, false),
        new Enemy(orangeSlime, 120, 120, 512, 340, 7700, 10, -0.3, 100, false),
        new Enemy(orangeSlime, 120, 120, 512, 340, 7850, 300, -0.3, 0, false),
        new Enemy(greenSlime, 100, 90, 302, 207, 8300, 300, -0.3, 0),
        new Enemy(orangeSlime, 120, 120, 512, 340, 8780, 300, -0.3, 150, false),
    ];
    stages = [
        new Background(200, 230, platform, 273, 120),
        new Background(500, 300, platform, 273, 120),
        new Background(0, 540, stage, 231, 120),
        new Background(230, 540, stage, 231, 120),
        new Background(550, 540, stage, 231, 120),
        new Background(781, 540, stage, 231, 120),
        new Background(1143, 300, smallPlatform, 123, 122),
        new Background(1512, 540, stage, 231, 120),
        new Background(1743, 540, stage, 231, 120),
        new Background(1700, 150, smallPlatform, 123, 122),
        new Background(2100, 150, smallPlatform, 123, 122),
        new Background(2174, 540, stage, 231, 120),
        new Background(2400, 230, smallPlatform, 123, 122),
        new Background(2405, 540, stage, 231, 120),
        new Background(2700, 450, smallPlatform, 123, 122),
        new Background(2900, 540, stage, 231, 120),
        new Background(2950, 200, smallPlatform, 123, 122),
        new Background(3150, 400, platform, 273, 120),
        new Background(3400, 300, platform, 273, 120),
        new Background(3700, 250, platform, 273, 120),
        new Background(3900, 10, block, 119, 119, true),
        new Background(4000, 490, smallPlatform, 123, 122),
        new Background(4150, 450, smallPlatform, 123, 122),
        new Background(4600, 300, platform, 273, 120),
        new Background(4873, 540, stage, 231, 120),
        new Background(5104, 540, stage, 231, 120),
        new Background(5200, 300, block, 119, 119, true),
        new Background(5335, 540, stage, 231, 120),
        new Background(5566, 540, stage, 231, 120),
        new Background(5650, 400, platform, 273, 120),
        new Background(5797, 540, stage, 231, 120),
        new Background(5650, 150, smallPlatform, 123, 122),
        new Background(6100, 250, platform, 273, 120),
        new Background(6300, 500, smallPlatform, 123, 122),
        new Background(6450, 450, platform, 273, 120),
        new Background(6800, 390, platform, 273, 120),
        new Background(6450, 200, platform, 273, 120),
        new Background(6800, 110, smallPlatform, 123, 122),
        new Background(7100, 150, platform, 273, 120),
        new Background(7500, 150, platform, 273, 120),
        new Background(7730, 150, platform, 273, 120),
        new Background(7930, 150, platform, 273, 120),
        new Background(7920, 30, block, 119, 119, true),
        new Background(7400, 540, smallPlatform, 123, 122),
        new Background(7650, 540, smallPlatform, 123, 122),
        new Background(7850, 540, smallPlatform, 123, 122),
        new Background(8050, 540, smallPlatform, 123, 122),
        new Background(8300, 540, smallPlatform, 123, 122),
        new Background(8600, 490, platform, 273, 120),
        new Background(8950, 100, smallPlatform, 123, 122),
        new Background(9250, 540, stage, 231, 120),
        new Background(9481, 540, stage, 231, 120),
    ];
    backgroundObjects = [
        new Background(-20, 400, mossSlopes, 7163, 371),
        new Background(7143, 400, mossSlopes, 7163, 371),   
    ];
    backgroundImg = [
        new Background(0, 0, background, 769, 610),
        new Background(769, 0, sideBackground, 769, 610),
    ];
}
