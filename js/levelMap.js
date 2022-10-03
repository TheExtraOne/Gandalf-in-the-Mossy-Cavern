'use strict'

let canSum = true;
let prevScore = 0;

function reset() {
    if (!castButton.classList.contains('invis-button')) {
        castButton.classList.toggle('invis-button');
    }
    spheres = [];
    fireballs = [];
    gandalfDistanceTraveled = 0;
    backgroundObjects = [
        new Background(-20 * scale, 400 * scale, mossSlopes, 7163 * scale, 371 * scale, 7163, 371),
        new Background(7143 * scale, 400 * scale, mossSlopes, 7163 * scale, 371 * scale, 7163, 371),   
    ];
    backgroundImg = [
        new Background(0, 0, background, 769 * scale, 610 * scale, 769, 610),
        new Background(767 * scale, 0, sideBackground, 769 * scale, 610 * scale, 769, 610),
    ];
    if (level === 1) {
        gandalf = new Wizzard(stayRight, stayLeft, runRight, runLeft);
        mana = [
            new Flower(manaFlower, 100 * scale, 70 * scale, 338.8, 339, 200 * scale, 100 * scale),
            new Flower(manaFlower, 100 * scale, 70 * scale, 338.8, 339, 600 * scale, 100 * scale),
            new Flower(manaFlower, 100 * scale, 70 * scale, 338.8, 339, 1690 * scale, 100 * scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 2090* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 2900* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 3800* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 4650* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 5650* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 6300* scale, 400* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 7400* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 8040* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 8960* scale, 10* scale),
            new Flower(ring1, 80* scale, 70* scale, 98, 86, 9500* scale, 400* scale, true),
            
        ];
        slimes = [
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 350* scale, 100* scale, -0.3, 150* scale, false),
            new Enemy(greenSlime, 100 * scale, 90 * scale, 302, 207, 800 * scale, 100 * scale, -0.3, 150 * scale),
            new Enemy(greenSlime, 100 * scale, 90 * scale, 302, 207, 2500 * scale, 400 * scale, -0.3, 150 * scale),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 3580* scale, 100* scale, -0.3, 170* scale),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 3850* scale, 100* scale, -0.3, 170* scale),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 4160* scale, 100* scale, -0.3, 0),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 5200* scale, 400* scale, -0.3, 0),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 5600* scale, 400* scale, -0.3, 150* scale),
            //new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 5800* scale, 100* scale, -0.3, 150* scale, false),
            //new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 6600* scale, 100* scale, -0.3, 150* scale, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 6970* scale, 300* scale, -0.3, 100* scale),
            //new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 7200* scale, 100* scale, -0.3, 150* scale, false),
            //new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 7700* scale, 10* scale, -0.3, 100* scale, false),
            //new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 7850* scale, 300* scale, -0.3, 0, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 8300* scale, 300* scale, -0.3, 0),
            //new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 8780* scale, 300* scale, -0.3, 150* scale, false),
        ];
        stages = [
            new Background(200 * scale, 230 * scale, platform, 273 * scale, 120 * scale, 273, 120),
            new Background(500 * scale, 300 * scale, platform, 273 * scale, 120 * scale, 273, 120),
            new Background(0, 540 * scale, stage, 231 * scale, 120 * scale, 231, 120),
            new Background(230 * scale, 540 * scale, stage, 231 * scale, 120 * scale, 231, 120),
            new Background(550 * scale, 540 * scale, stage, 231 * scale, 120 * scale, 231, 120),
            new Background(781 * scale, 540 * scale, stage, 231 * scale, 120 * scale, 231, 120),
            new Background(1143 * scale, 300 * scale, smallPlatform, 123 * scale, 122 * scale, 123, 122),
            new Background(1512* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(1743* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(1700* scale, 150* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(2100* scale, 150* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(2174* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(2400* scale, 230* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(2405* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(2700* scale, 450* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(2900* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(2950* scale, 200* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(3150* scale, 400* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(3400* scale, 300* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(3700* scale, 250* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(3900* scale, 10* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(4000* scale, 490* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(4150* scale, 450* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(4600* scale, 300* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(4873* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(5104* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(5200* scale, 300* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(5335* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(5566* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(5650* scale, 400* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(5797* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(5650* scale, 150* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(6100* scale, 250* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(6300* scale, 500* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(6450* scale, 450* scale, platform, 273* scale, 120* scale, 273, 120),
            new Background(6800* scale, 390* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(6450* scale, 200* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(6800* scale, 110* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(7100* scale, 150* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(7500* scale, 150* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(7730* scale, 150* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(7930* scale, 150* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(7920* scale, 30* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(7400* scale, 540* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(7650* scale, 540* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(7850* scale, 540* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8050* scale, 540* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8300* scale, 540* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8600* scale, 490* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(8950* scale, 100* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(9250* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(9481* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
        ];
    }
    if (level === 2) {
        if (canSum) {
            prevScore = gandalf.score;
            canSum = false;
        }

        gandalf = new Wizzard(stayRight, stayLeft, runRight, runLeft, prevScore);
        mana = [
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 490* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 1550* scale, 400* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 2000* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 2450* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 3950* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 4400* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 5100* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 5900* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 7050* scale, 100* scale),
            new Flower(manaFlower, 100* scale, 70* scale, 338.8, 339, 8800* scale, 50* scale),
            new Flower(ring2, 80* scale, 70* scale, 98, 86, 9720* scale, 200* scale, true),            
        ];
        slimes = [
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 600* scale, 400* scale, -0.3, 450* scale),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 1160* scale, 100* scale, -0.3, 0),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 1700* scale, 400* scale, -0.3, 0, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 1500* scale, 100* scale, -0.3, 0),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 2870* scale, 100* scale, -0.3, 100* scale, false),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 3390* scale, 400* scale, -0.3, 300* scale, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 3793* scale, 100* scale, -0.3, 150* scale),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 4300* scale, 400* scale, -0.3, 0, false),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 4450* scale, 400* scale, -0.3, 0, false),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 4620* scale, 400* scale, -0.3, 0, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 5900* scale, 400* scale, -0.3, 150* scale),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 6100* scale, 400* scale, -0.3, 0, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 6400* scale, 400* scale, -0.3, 150* scale),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 7000* scale, 400* scale, -0.3, 0, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 7620* scale, 400* scale, -0.3, 100* scale),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 7850* scale, 400* scale, -0.3, 0, false),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 8400* scale, 100* scale, -0.3, 0, false),
            new Enemy(orangeSlime, 120* scale, 120* scale, 512, 340, 8600* scale, 100* scale, -0.3, 0, false),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 9010* scale, 100* scale, -0.3, 0),
            new Enemy(greenSlime, 100* scale, 90* scale, 302, 207, 9210* scale, 100* scale, -0.3, 0),
        ];
        stages = [
            new Background(0, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(230* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(462* scale, 540* scale, stage, 231* scale, 120* scale, 231, 120),
            new Background(500* scale, 150* scale, smallPlatform, 123* scale, 122* scale, 123, 122),
            new Background(693* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(924* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(930* scale, 420* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(1050* scale, 300* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(1150* scale, 200* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(1500* scale, 200* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(1550* scale, 500* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(1900* scale, 520* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(2000* scale, 150* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(2170* scale, 520* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(2450* scale, 520* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(2750* scale, 350* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(3150* scale, 350* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(3300* scale, 200* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(3100* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(3331* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(3562* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(3793* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(3950* scale, 150* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(4273* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(4400* scale, 150* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(4504* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(5000* scale, 200* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(5400* scale, 300* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(5700* scale, 200* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(5600* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(5900* scale, 150* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(5830* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(6060* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(6300* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(6000* scale, 300* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(6200* scale, 300* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(6000* scale, 20* scale, block, 119* scale, 119* scale,119, 119, true),
            new Background(6700* scale, 300* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(7000* scale, 300* scale, platform, 273* scale, 120* scale,273, 120),
            new Background(7400* scale, 150* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(7500* scale, 540* scale, stage, 231* scale, 120* scale,231, 120),
            new Background(7850* scale, 300* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8200* scale, 150* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8400* scale, 400* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8600* scale, 400* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(8800* scale, 100* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(9000* scale, 400* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(9200* scale, 400* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(9500* scale, 200* scale, smallPlatform, 123* scale, 122* scale,123, 122),
            new Background(9700* scale, 400* scale, smallPlatform, 123* scale, 122* scale,123, 122),
        ];
    }
}