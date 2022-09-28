"use strict";

const moneyAudio = new Audio();
moneyAudio.volume = 0.5;
if (moneyAudio.canPlayType("audio/mpeg") == "probably"){
    moneyAudio.src = "sounds/money.mp3";
} else {
    moneyAudio.src=
    "sounds/moneyOgg.ogg";
}
const slimeAudio = new Audio();
slimeAudio.volume = 0.5;
if (slimeAudio.canPlayType("audio/mpeg") == "probably"){
    slimeAudio.src = "sounds/sqush.mp3";
} else {
    slimeAudio.src=
    "sounds/squshOgg.ogg";
}
const victoryAudio = new Audio();
victoryAudio.volume = 0.5;
if (victoryAudio.canPlayType("audio/mpeg") == "probably"){
    victoryAudio.src = "sounds/victory.mp3";
} else {
    victoryAudio.src=
    "sounds/victoryOgg.ogg";
}
const mainAudio = new Audio();
mainAudio.loop = true;
mainAudio.volume = 0.15;
if (mainAudio.canPlayType("audio/mpeg") == "probably"){
    mainAudio.src = "sounds/general2.mp3";
} else {
    mainAudio.src=
    "sounds/general2Ogg.ogg";
}

// отслеживаем изменение закладки в УРЛе
// оно происходит при любом виде навигации
// в т.ч. при нажатии кнопок браузера ВПЕРЁД/НАЗАД
window.onhashchange = switchToStateFromURLHash;

// текущее состояние приложения
// это Model из MVC
let SPAState = {};

// вызывается при изменении закладки УРЛа
// а также при первом открытии страницы
// читает новое состояние приложения из закладки УРЛа
// и обновляет ВСЮ вариабельную часть веб-страницы
// соответственно этому состоянию
// это упрощённая реализация РОУТИНГА - автоматического выполнения нужных
// частей кода в зависимости от формы URLа
// "роутинг" и есть "контроллер" из MVC - управление приложением через URL
function switchToStateFromURLHash() {
    let URLHash = window.location.hash;

    // убираем из закладки УРЛа решётку
    // (по-хорошему надо ещё убирать восклицательный знак, если есть)
    let stateStr = URLHash.substr(1);

    if ( stateStr !== "" ) { // если закладка непустая, читаем из неё состояние и отображаем
        let parts = stateStr.split("_")
        SPAState = { pagename: parts[0] }; // первая часть закладки - номер страницы
    } else {
    SPAState = {pagename:'Main'}; // иначе показываем главную страницу
    }

    // обновляем вариабельную часть страницы под текущее состояние
    // это реализация View из MVC - отображение состояния модели в HTML-код
    let pageHTML = "";
    switch ( SPAState.pagename ) {
        case 'Game':
            pageHTML += '<div class="wrapper-for-game"><div class="button-left invis-button">&#9650;</div><div class="button-right invis-button">&#9650;</div><div class="button-jump invis-button">&#9650;</div><div class="button-cast invis-button">&#128293;</div><div class="side-bar"><div class="points"><p>Level:<br><span class="level-number">1</span></p><p>Mana-flowers:<br><span class="mana-flowers">0</span></p> <p>Total score:<br><span class="total-score">0</span></p></div><div class="buttons-container"><button type="button" id="resetButton"><span>Reset</span></button><button type="button" id="menuButton" onclick="switchToMainPage()"><span>Menu</span></button><button type="button" id="showButtonsButton"><span>Show buttons</span></button></div><div class="cross-container">&#9650;</div></div><div class="open-container invis">&#9650;</div><canvas></canvas></div>';
            break;
        case 'Main':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><button type="button" id="startButton" onclick="switchToGameField()"><span>Start</span></button><button type="button" id="rulesButton" onclick="switchToRulesPage()"><span>Rules</span></button><button type="button" id="tableButton" onclick="switchToRecordsPage()"><span>Records</span></button><button type="button" id="settingButton" onclick="switchToSettingsPage()"><span>Settings</span></button></div></div>';
            break;
        case 'Rules':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><h3>Rules</h3>';
            pageHTML += "<div><p>To move the character, use the keys A (left), W (jump) or D (right).</p><p>Also, after collecting 5 mana flowers, you will gain the ability to cast a fireball (press 'Space'), wich can kill your enemies.</p><p>Another option to defeat enemies is to crush them with a jump. But be careful, after that you will be thrown up!</p><p>Points are awarded for collecting mana flowers, defeating enemies and discovering one of the Rings of Power. Once you find the Ring, you will move on to the next level.</p></div>";
            pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div></div></div>';
            break;
        case 'Settings':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><h3>Settings</h3>';
            pageHTML += "<input type='text' name='userName' placeholder='Enter your nickname'>";
            pageHTML += '<label for="volume">Music</label><input type="range" id="volume" name="volume" min="0" max="1" value="0.1" step="0.1"><label for="volume">Side Effects</label><input type="range" id="volume" name="volume" min="0" max="1" value="0.5" step="0.1">';
            pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div></div></div>';
            break;
        case 'Records':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><h3>Top-5</h3>';
            pageHTML += "<div><ol><li>User 1 <span>1020</span></li><li>User 2 <span>1000</span></li><li>User 3 <span>820</span></li><li>User 4 <span>600</span></li><li>User 5 <span>200</span></li></ol></div>";
            pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div></div></div>';
            break;
    }
    document.querySelector('body').innerHTML = pageHTML;
}

// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function switchToState(newState) {
    // устанавливаем закладку УРЛа
    // нужно для правильной работы кнопок навигации браузера
    // (т.к. записывается новый элемент истории просмотренных страниц)
    // и для возможности передачи УРЛа другим лицам
    let stateStr = newState.pagename;
    location.hash = stateStr;
    // АВТОМАТИЧЕСКИ вызовется switchToStateFromURLHash()
    // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
}

function switchToGameField() {
    lounchMusic();
    switchToState( { pagename:'Game' } );
    include("js/class.js");
    include("js/levelMap.js");
    include("script.js");
}

function switchToMainPage() {
    switchToState( { pagename:'Main' } );
}

function switchToRulesPage() {
    switchToState( { pagename:'Rules' } );
}

function switchToSettingsPage() {
    switchToState( { pagename:'Settings' } );
}

function switchToRecordsPage() {
    switchToState( { pagename:'Records' } );
}

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
switchToStateFromURLHash();

function include(url) {
    let script = document.createElement('script');
    script.src = url;
    document.querySelector('body').append(script);
}
function lounchMusic(){
    //startButton.blur();
    clickSoundInit(moneyAudio);
    clickSoundInit(slimeAudio);
    clickSoundInit(victoryAudio);
    clickSoundInit(mainAudio);
}

function clickSoundInit(audio) {
    if (audio === mainAudio) {
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