"use strict";

/*DOM*/
let manaFlowers;
let totalScore;
let levelNumber;
let crossContainer;
let openContainer;
let sideBar;
let resetButton;
let showButtonsButton;
let leftButton;
let rightButton;
let jumpButton;
let castButton;
let canvas;
/*зависящие от canvas*/
let userWidth;
let userHeight;
let optimumWidth;
let scale;
let ctx;
/*Физика, движение, соприкосновение */
let gandalfAccelY;
let gandalfStep;
let gandalfJump;
let howDeepInMoss;
let howCloseToPit;
/*объекты (от классов)*/
let gandalf;
let stages;
let slimes;
let mana;
let fireballs;
let backgroundObjects;
let backgroundImg;
let gandalfDistanceTraveled;
let spheres;
/*уровни, управление */
let level;
let isRightPressed;
let isLeftPressed;
let isJumpPressed;
let isSpacePressed;
let lastKey;
let animationID;
/*контроль fps */
let fps;
let fpsInterval;
let startTime;
let now;
let elapsed;
/*картинки для canvas */
//для проверки поддержки webp
async function supportWEBP() {
  const WEBP = new Image();
  await (WEBP.onload = WEBP.onerror =
    function () {
      if (WEBP.height == 2) {
        window.detectWebp = true;
        document.body.classList.add("webp");
        return true;
      } else {
        document.body.classList.add("nowebp");
        return false;
      }
    });
  await (WEBP.src =
    "data:image/webp;base64,UklGRi4AAABXRUJQVlA4ICIAAABQAQCdASoDAAIAAgA2JQBOgC6gAP73M8eLuxHGTv3eIAAA");
}
let isWebP = false;
if (supportWEBP()) {
  isWebP = true;
}

let stayRight = new Image();
if (isWebP) {
  stayRight.src = "img/StayRightWeb.webp";
} else {
  stayRight.src = "img/StayRight.png";
}

let stayLeft = new Image();
if (isWebP) {
  stayLeft.src = "img/StayLeftWeb.webp";
} else {
  stayLeft.src = "img/StayLeft.png";
}

let runRight = new Image();
if (isWebP) {
  runRight.src = "img/RunRightWeb.webp";
} else {
  runRight.src = "img/RunRight.png";
}

let runLeft = new Image();
if (isWebP) {
  runLeft.src = "img/RunLeftWeb.webp";
} else {
  runLeft.src = "img/RunLeft.png";
}

let manaFlower = new Image();
manaFlower.src = "img/ManaFlower.png";

let greenSlime = new Image();
greenSlime.src = "img/greenSlime.png";

let orangeSlime = new Image();
orangeSlime.src = "img/orangeSlime.png";

let platform = new Image();
if (isWebP) {
  platform.src = "img/platformWeb.webp";
} else {
  platform.src = "img/platform.png";
}

let smallPlatform = new Image();
smallPlatform.src = "img/SmallPlatform.png";

let stage = new Image();
if (isWebP) {
  stage.src = "img/MediumStage1Web.webp";
} else {
  stage.src = "img/MediumStage1.png";
}

let block = new Image();
block.src = "img/SmallBlock.png";

let background = new Image();
if (isWebP) {
  background.src = "img/Background1Web.webp";
} else {
  background.src = "img/Background1.jpg";
}

let sideBackground = new Image();
if (isWebP) {
  sideBackground.src = "img/Background2Web.webp";
} else {
  sideBackground.src = "img/Background2.jpg";
}

let mossSlopes = new Image();
if (isWebP) {
  mossSlopes.src = "img/mossySlopesWeb.webp";
} else {
  mossSlopes.src = "img/mossySlopes.png";
}

let ring1 = new Image();
ring1.src = "img/smallRing1.png";

let ring2 = new Image();
ring2.src = "img/smallRing2.png";

function determineVar() {
  manaFlowers = document.querySelector(".mana-flowers");
  totalScore = document.querySelector(".total-score");
  levelNumber = document.querySelector(".level-number");
  crossContainer = document.querySelector(".cross-container");
  openContainer = document.querySelector(".open-container");
  sideBar = document.querySelector(".side-bar");
  resetButton = document.querySelector("#resetButton");
  showButtonsButton = document.querySelector("#showButtonsButton");
  leftButton = document.querySelector(".button-left");
  rightButton = document.querySelector(".button-right");
  jumpButton = document.querySelector(".button-jump");
  castButton = document.querySelector(".button-cast");

  canvas = document.querySelector("canvas");
  userWidth = document.documentElement.clientWidth;
  userHeight = document.documentElement.clientHeight;
  optimumWidth = userWidth;

  if (userWidth / userHeight > 1.75 && userWidth / userHeight < 2) {
    optimumWidth -= 150;
  } else if (userWidth / userHeight >= 2) {
    optimumWidth -= 200;
  }

  scale = optimumWidth < 1058 ? optimumWidth / 1024 : 1;
  if (userWidth <= 1216) {
    hideSideMenu();
    hideButtons();
  }
  canvas.width = 1024 * scale;
  canvas.height = 600 * scale;
  ctx = canvas.getContext("2d");

  sideBar.style.height = canvas.height + "px";

  gandalfAccelY = 0.5 * scale;
  gandalfStep = 5 * scale;
  gandalfJump = 16 * scale;
  howDeepInMoss = 21 * scale;
  howCloseToPit = 20 * scale;

  level = 1;
  isRightPressed = false;
  isLeftPressed = false;
  isJumpPressed = false;
  isSpacePressed = false;

  resetButton.addEventListener("click", reset, false);
  crossContainer.addEventListener("click", hideSideMenu, false);
  openContainer.addEventListener("click", hideSideMenu, false);
  showButtonsButton.addEventListener("click", hideButtons, false);
  document.addEventListener("keydown", startMove, false);
  document.addEventListener("touchstart", startMove, false);
  document.addEventListener("keyup", finishMove, false);
  document.addEventListener("touchend", finishMove, false);
}

function hideSideMenu() {
  openContainer.classList.toggle("invis");
  sideBar.classList.toggle("invis");
}

function hideButtons() {
  leftButton.classList.toggle("invis-button");
  rightButton.classList.toggle("invis-button");
  jumpButton.classList.toggle("invis-button");
}

//функция для контроля частоты отрисовки, передавать делаемое fps.
function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  startTime = Date.now();
  //tick();
  requestAnimationFrame(tick);
}

function tick() {
  animationID = requestAnimationFrame(tick);

  now = Date.now();
  elapsed = now - startTime;

  if (elapsed < fpsInterval) {
    return;
  }

  startTime = now - (elapsed % fpsInterval);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gandalf.accelY = gandalfAccelY;

  if (isRightPressed && gandalf.positionX < 500 * scale) {
    gandalf.speedX = gandalfStep;
  } else if (
    (isLeftPressed && gandalf.positionX > 300 * scale) ||
    (isLeftPressed && gandalfDistanceTraveled === 0 && gandalf.positionX > 0)
  ) {
    gandalf.speedX = -gandalfStep;
  } else {
    gandalf.speedX = 0;
  }

  //для перемещения фона во время движения игрока
  //трюк взят из интернета, МАГИЯ, не трогать!
  let hitSide = false;
  if (isRightPressed && gandalf.speedX === 0) {
    for (let i = 0; i < stages.length; i++) {
      let stage = stages[i];
      stage.speedX = -gandalfStep;
      if (
        stage.block &&
        doesHeroToutchTheSideOfBlock({ hero: gandalf, block: stage })
      ) {
        stages.forEach((stage) => {
          stage.speedX = 0;
        });
        hitSide = true;
        break;
      }
    }
    if (!hitSide) {
      gandalfDistanceTraveled += gandalfStep;
      backgroundObjects.forEach((backgroundObject) => {
        backgroundObject.speedX = -0.6 * gandalfStep;
      });
      slimes.forEach((slime) => {
        slime.positionX -= gandalfStep;
      });
      mana.forEach((flower) => {
        flower.positionX -= gandalfStep;
      });
      spheres.forEach((eachSphere) => {
        eachSphere.positionX -= gandalfStep;
      });
    }
  }
  if (isLeftPressed && gandalf.speedX === 0 && gandalfDistanceTraveled > 0) {
    for (let i = 0; i < stages.length; i++) {
      let stage = stages[i];
      stage.speedX = gandalfStep;
      if (
        stage.block &&
        doesHeroToutchTheSideOfBlock({ hero: gandalf, block: stage })
      ) {
        stages.forEach((stage) => {
          stage.speedX = 0;
        });
        hitSide = true;
        break;
      }
    }
    if (!hitSide) {
      gandalfDistanceTraveled -= gandalfStep;
      backgroundObjects.forEach((backgroundObject) => {
        backgroundObject.speedX = 0.6 * gandalfStep;
      });
      slimes.forEach((slime) => {
        slime.positionX += gandalfStep;
      });
      mana.forEach((flower) => {
        flower.positionX += gandalfStep;
      });
      spheres.forEach((eachSphere) => {
        eachSphere.positionX += gandalfStep;
      });
    }
  }

  //объект останавливается при падении, если соприкасается с платформой
  stages.forEach((stage) => {
    if (doesToutchThePlatform({ obj: gandalf, platform: stage })) {
      gandalf.accelY = 0;
      gandalf.speedY = 0;
    }
    if (
      stage.block &&
      doesHeroToutchTheBlock({ hero: gandalf, block: stage })
    ) {
      gandalf.speedY = 0;
    }
    if (
      stage.block &&
      doesHeroToutchTheSideOfBlock({ hero: gandalf, block: stage })
    ) {
      gandalf.speedX = 0;
    }
    slimes.forEach((slime) => {
      if (doesToutchThePlatform({ obj: slime, platform: stage })) {
        slime.accelY = 0;
        slime.speedY = 0;
      }
    });
    mana.forEach((flower) => {
      if (doesToutchThePlatform({ obj: flower, platform: stage })) {
        flower.accelY = 0;
        flower.speedY = 0;
      }
    });
  });

  //условие проигрыша: 1)если игрок упал 2)прикоснулся к слизи
  if (gandalf.positionY > canvas.height) {
    reset();
  }

  //отрисовка
  backgroundImg.forEach((backgroundstep) => {
    backgroundstep.drawBackground();
    backgroundstep.speedX = 0;
  });
  backgroundObjects.forEach((backgroundObject) => {
    backgroundObject.drawBackground();
    backgroundObject.speedX = 0;
  });
  mana.forEach((flower, i) => {
    if (doesHeroToutchMana({ hero: gandalf, mana: flower })) {
      setTimeout(() => {
        mana.splice(i, 1);
      });
      clickSound(moneyAudio);
      gandalf.count++;
      if (flower.ring) {
        gandalf.score += 100;
        winStuff(gandalf, flower);
      } else {
        gandalf.score += 20;
      }
      if (gandalf.count >= 5) {
        gandalf.hasPower = true;
        if (castButton.classList.contains("invis-button")) {
          castButton.classList.toggle("invis-button");
        }
      }
    }
    flower.drawFlower();
  });
  gandalf.drawNewPosition();
  slimes.forEach((slime, i) => {
    fireballs.forEach((fireball, index) => {
      if (
        fireball.positionX + fireball.radius > slime.positionX + gandalfJump &&
        fireball.positionX - fireball.radius <
          slime.positionX + slime.width - gandalfJump &&
        fireball.positionY - fireball.radius < slime.positionY + slime.height &&
        fireball.positionY + fireball.radius > slime.positionY
      ) {
        for (let i = 0; i < 100; i++) {
          let color = "#89cf7e"; //оттенок зеленого
          if (!slime.isGreen) {
            color = "#d1b75a"; //оттенок оранжевого
          }
          spheres.push(
            new Sphere(
              slime.positionX + slime.width / 2,
              slime.positionY + slime.height / 2,
              randomDiap(-10, 10) / 10,
              randomDiap(-10, 10) / 10,
              Math.random() * gandalfStep,
              color
            )
          );
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
    if (doesHeroJumpOnTheEnemy({ hero: gandalf, enemy: slime })) {
      for (let i = 0; i < 100; i++) {
        let color = "#89cf7e"; //оттенок зеленого
        if (!slime.isGreen) {
          color = "#d1b75a"; //оттенок оранжевого
        }
        spheres.push(
          new Sphere(
            slime.positionX + slime.width / 2,
            slime.positionY + slime.height / 2,
            randomDiap(-10, 10) / 10,
            randomDiap(-10, 10) / 10,
            Math.random() * gandalfStep,
            color
          )
        );
      }
      setTimeout(() => {
        slimes.splice(i, 1);
      }, 0);
      gandalf.speedY -= 30 * scale;
      gandalf.score += 10;
      clickSound(slimeAudio);

      //если игрок соприкоснулся с врагом - ресет
    } else if (
      gandalf.positionX + gandalf.width >= slime.positionX &&
      gandalf.positionY + gandalf.height / 2 > slime.positionY &&
      gandalf.positionY + gandalf.height / 2 < slime.positionY + slime.height &&
      gandalf.positionX <= slime.positionX + slime.width
    ) {
      reset();
    }
  });
  fireballs.forEach((fireball, i) => {
    if (
      fireball.positionX - fireball.radius > canvas.width ||
      fireball.positionX + fireball.radius < 0
    ) {
      setTimeout(() => {
        fireballs.splice(i, 1);
      });
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
  stages.forEach((stage) => {
    stage.drawBackground();
    stage.speedX = 0;
  });

  //Счет
  updateScore(manaFlowers, totalScore, gandalf);

  //animationID = requestAnimationFrame(tick);
}

function startMove(event) {
  event = event || window.event;

  if (gandalf.blockMovement) {
    return;
  } else {
    //вперед
    if (event.code === "KeyD" || event.target.className === "button-right") {
      gandalf.currentState = gandalf.runRight;
      isRightPressed = true;
      lastKey = "KeyD";
    }
    //назад
    if (event.code === "KeyA" || event.target.className === "button-left") {
      gandalf.currentState = gandalf.runLeft;
      isLeftPressed = true;
      lastKey = "KeyA";
    }
    //прыжок
    if (event.code === "KeyW" || event.target.className === "button-jump") {
      if (isJumpPressed) {
        return;
      } else if (gandalf.speedY === 0 && !isJumpPressed) {
        gandalf.speedY = -gandalfJump;
        isJumpPressed = true;
      }
    }
    //каст фаербола
    if (
      (event.code === "Space" && gandalf.hasPower) ||
      (event.target.className === "button-cast" && gandalf.hasPower)
    ) {
      if (isSpacePressed) {
        return;
      }
      if (lastKey === "KeyD") {
        isSpacePressed = true;
        fireballs.push(
          new FireBall(
            gandalf.positionX + gandalf.width / 2,
            gandalf.positionY + gandalf.height / 2,
            10
          )
        );
      }
      if (lastKey === "KeyA") {
        isSpacePressed = true;
        fireballs.push(
          new FireBall(
            gandalf.positionX + gandalf.width / 2,
            gandalf.positionY + gandalf.height / 2,
            -10
          )
        );
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
    if (event.code === "KeyD" || event.target.className === "button-right") {
      gandalf.currentState = gandalf.standRight;
      isRightPressed = false;
    }
    //назад
    if (event.code === "KeyA" || event.target.className === "button-left") {
      gandalf.currentState = gandalf.standLeft;
      isLeftPressed = false;
    }
    if (event.code === "KeyW" || event.target.className === "button-jump") {
      isJumpPressed = false;
    }
    if (
      (event.code === "Space" && gandalf.hasPower) ||
      (event.target.className === "button-cast" && gandalf.hasPower)
    ) {
      isSpacePressed = false;
    }
  }
}
