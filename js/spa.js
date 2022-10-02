"use strict";

const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
const stringName='MIHASEWA_GANDALF_SCORE';

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

//для отслеживания. загрузились ли скрипты, мызыка или перезагружалась ли страница
let areScriptsLoaded = false;
let isMusicLoded = false;
let popUp = document.querySelector('.b-popup');
let popUpButton = document.querySelector('.popup-close-button');
popUpButton.addEventListener('click', closePopup, false);

let popUp2 = document.querySelector('.b-popup2');

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
            pageHTML += '<div class="wrapper-for-game"><div class="side-bar"><div class="points"><p>Level:<br><span class="level-number">1</span></p><p>Mana-flowers:<br><span class="mana-flowers">0</span></p> <p>Total score:<br><span class="total-score">0</span></p></div><div class="buttons-container"><input type="text" name="userName" placeholder="Your nickname" id="IName"> <button type="button" class="small-button" onclick="storeInfo()">Save</button><button type="button" id="resetButton"><span>Reset</span></button><button type="button" id="menuButton" onclick="beforeMainMenu()"><span>Menu</span></button><button type="button" id="showButtonsButton"><span>Show buttons</span></button></div><div class="cross-container">&#9650;</div></div><div class="wrapper-for-canvas"><div class="open-container invis">&#9650;</div><div class="button-left invis-button">&#9650;</div><div class="button-right invis-button">&#9650;</div><div class="button-jump invis-button">&#9650;</div><div class="button-cast invis-button">&#128293;</div><canvas></canvas></div></div>';

            if(!areScriptsLoaded) {
                include("js/script.js");
                areScriptsLoaded = true;
            } else{
                //location.reload();
                reset();
                updateLevel(levelNumber, level);
                requestAnimationFrame(tick);
            }


            window.onbeforeunload = function() {
                return false;
            };

            //Для попапа с запуском музыки, если перезагрузили страницу
            if (performance.navigation.type == 1) {
                console.log('was reloaded');
                popUp.classList.toggle('invis-button');
            } else {
                console.log('wasnt reloaded');
                
            }
            break;
        case 'Main':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><button type="button" id="startButton" onclick="switchToGameField(), lounchMusic()"><span>Start</span></button><button type="button" id="rulesButton" onclick="switchToRulesPage()"><span>Rules</span></button><button type="button" id="tableButton" onclick="switchToRecordsPage()"><span>Records</span></button><button type="button" id="settingButton" onclick="switchToSettingsPage()"><span>Settings</span></button></div></div>';
            break;
        case 'Rules':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><h3>Rules</h3>';
            pageHTML += "<div><p>To move the character, use the keys A (left), W (jump) or D (right).</p><p>Also, after collecting 5 mana flowers, you will gain the ability to cast a fireball (press 'Space'), wich can kill your enemies.</p><p>Another option to defeat enemies is to crush them with a jump. But be careful, after that you will be thrown up!</p><p>Points are awarded for collecting mana flowers, defeating enemies and discovering one of the Rings of Power. Once you find the Ring, you will move on to the next level.</p></div>";
            pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div></div></div>';
            break;
        case 'Settings':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><h3>Settings</h3>';
            /*pageHTML += "<p><input type='text' name='userName' placeholder='Enter your nickname' id='IName'> <button type='button' class='small-button' onclick='storeInfo()'>Save</button></p>";*/
            pageHTML += '<label for="volume">Music</label><input type="range" id="volume" name="volume" min="0" max="1" value="0.1" step="0.1"><label for="volume">Side Effects</label><input type="range" id="volume" name="volume" min="0" max="1" value="0.5" step="0.1">';
            pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div></div></div>';
            break;
        case 'Records':
            pageHTML += '<div class="wrapper-for-main-menu"><h1>Gangalf in the mossy cavern</h1><div class="main-menu-container"><h3>Top-5</h3>';
            pageHTML += `<div><ol><li>User 1<span>1100</span></li><li>User 2 <span>1000</span></li><li>User 3 <span>820</span></li><li>User 4 <span>600</span></li><li>User 5 <span>200</span></li></ol></div>`;
            pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div></div></div>';
            test();
            break;
    }
    document.querySelector('.test-wrapper').innerHTML = pageHTML;
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
    switchToState( { pagename:'Game' } );
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
    //document.querySelectorAll('script')[3].after(script);
    document.querySelector('body').append(script);
}
function lounchMusic(){
    if(!isMusicLoded) {
        clickSoundInit(moneyAudio);
        clickSoundInit(slimeAudio);
        clickSoundInit(victoryAudio);
        clickSoundInit(mainAudio);
        isMusicLoded = true;
    }
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

function closePopup(event) {
    event = event || window.event;
    event.preventDefault();

    lounchMusic();
    popUp.classList.toggle('invis-button');
}

function beforeMainMenu(event) {
    event = event || window.event;
    event.preventDefault();

    popUp2.classList.toggle('invis-button');

    let popUpYesButton = document.querySelector('.popup-yes-button');
    popUpYesButton.addEventListener('click', () => {switchToMainPage();popUp2.classList.add('invis-button');}, false);

    let popUpNoButton = document.querySelector('.popup-no-button');
    popUpNoButton.addEventListener('click', () => {popUp2.classList.toggle('invis-button');}, false);
}

function storeInfo() {
    updatePassword = Math.random();
    $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : stringName, p : updatePassword },
            success : lockGetReady, error : errorHandler
        }
    );
}

function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        let scoreTable = JSON.parse(callresult.result);
        if (!scoreTable.length) {
            scoreTable = [];
        }
        function byField(field) {
            return (a, b) => a[field] > b[field] ? -1 : 1;
        }  
    
        const info = {
            name : (document.getElementById('IName').value === '') ? 'Unknown user' : document.getElementById('IName').value,
            score : totalScore.textContent
        };
        scoreTable.push(info)
        scoreTable.sort(byField('score'));
        console.log(scoreTable);
        $.ajax( {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'UPDATE', n : stringName,
                v : JSON.stringify(scoreTable), p : updatePassword },
                success : updateReady, error : errorHandler
            }
        );
    }
}

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function test() {
    $.ajax(
        {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : stringName },
            success : readReady, error : errorHandler
        }
    );
}

function readReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else if ( callresult.result!="" ) {
        const info = JSON.parse(callresult.result);
        let allLi = document.querySelectorAll('li');
        for (let i = 0; i < allLi.length; i++) {
            allLi[i].innerHTML = `${info[i].name} <span>${info[i].score}</span>`;
        }
    }
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}