'use strict'

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
    span1.textContent = `${hero.count}`;
    span2.textContent = `${hero.score}`;
}

function updateLevel(span, newLevel) {
    span.textContent = `${newLevel}`;
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
    
    if (level === 2) {
        return;
    }

    level++;
    setTimeout(updateLevel, 3000, levelNumber, level);
    setTimeout(reset, 3000);
}

function randomDiap(n, m) {
    return Math.floor(
        Math.random() * (m - n + 1)
    ) + n;
}