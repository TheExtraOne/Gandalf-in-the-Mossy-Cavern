"use strict";

  // в закладке УРЛа будем хранить разделённые подчёркиваниями слова
  // #Main - главная
  // #Photo_55 - отобразить фото 55
  // #About - о нас

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
            case 'Main':
                pageHTML += '<button type="button" id="startButton"><span>Start</span></button>';
                pageHTML += '<button type="button" id="rulesButton" onclick="switchToRulesPage()"><span>Rules</span></button>';
                pageHTML += '<button type="button" id="tableButton" onclick="switchToRecordsPage()"><span>Records</span></button>';
                pageHTML += '<button type="button" id="settingButton" onclick="switchToSettingsPage()"><span>Settings</span></button>';
                break;
            case 'Rules':
                pageHTML += "<h3>Rules</h3>";
                pageHTML += "<div><p>To move the character, use the keys A (left), W (jump) or D (right).</p><p>Also, after collecting 5 mana flowers, you will gain the ability to cast a fireball (press 'Space'), wich can kill your enemies.</p><p>Another option to defeat enemies is to crush them with a jump. But be careful, after that you will be thrown up!</p><p>Points are awarded for collecting mana flowers, defeating enemies and discovering one of the Rings of Power. Once you find the Ring, you will move on to the next level.</p></div>";
                pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div>';
                break;
            case 'Settings':
                pageHTML += "<h3>О нас</h3>";
                pageHTML += "<p>Мы круты!</p>";
                pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div>';
                break;
            case 'Records':
                pageHTML += "<h3>Top-5</h3>";
                pageHTML += "<div><ol><li>User 1 <span>1020</span></li><li>User 2 <span>1000</span></li><li>User 3 <span>820</span></li><li>User 4 <span>600</span></li><li>User 5 <span>200</span></li></ol></div>";
                pageHTML += '<div class="back-to-main-menu" onclick="switchToMainPage()">X</div>';
                break;
        }
        console.log(document.querySelector('.main-menu-container'));
        document.querySelector('.main-menu-container').innerHTML = pageHTML;
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