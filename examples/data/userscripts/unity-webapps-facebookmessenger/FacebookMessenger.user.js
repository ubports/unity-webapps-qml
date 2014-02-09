// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
// ==UserScript==
// @include       http://*.facebook.com/*
// @include       https://*.facebook.com/*
// @include       https://*.facebook.com
// @require       utils.js
// ==/UserScript==

// This placeholder gets munged with real data at build time.
var WebappsGettextDict = JSON.parse(unescape(
    "%7B%22am%22%3A%20%7B%22Messages%22%3A%20%22%5Cu1218%5Cu120d%5Cu12a5%5Cu12ad%5Cu1276%5Cu127d%22%2C%20%22Notifications%22%3A%20%22%5Cu121b%5Cu1235%5Cu1273%5Cu12c8%5Cu1242%5Cu12eb%5Cu12ce%5Cu127d%22%7D%2C%20%22ar%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0627%5Cu0644%5Cu0631%5Cu0633%5Cu0627%5Cu0626%5Cu0644%22%2C%20%22Notifications%22%3A%20%22%5Cu0627%5Cu0644%5Cu062a%5Cu0646%5Cu0628%5Cu064a%5Cu0647%5Cu0627%5Cu062a%22%7D%2C%20%22ast%22%3A%20%7B%22Messages%22%3A%20%22Mensaxes%22%2C%20%22Notifications%22%3A%20%22Notificaciones%22%7D%2C%20%22be%22%3A%20%7B%22Messages%22%3A%20%22%5Cu041f%5Cu0430%5Cu0432%5Cu0435%5Cu0434%5Cu0430%5Cu043c%5Cu043b%5Cu0435%5Cu043d%5Cu043d%5Cu0456%22%2C%20%22Notifications%22%3A%20%22%5Cu0410%5Cu043f%5Cu0430%5Cu0432%5Cu044f%5Cu0448%5Cu0447%5Cu044d%5Cu043d%5Cu043d%5Cu0456%22%7D%2C%20%22bem%22%3A%20%7B%22Messages%22%3A%20%22Amashiwi%22%2C%20%22Notifications%22%3A%20%22Ifishibisho%22%7D%2C%20%22bg%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0421%5Cu044a%5Cu043e%5Cu0431%5Cu0449%5Cu0435%5Cu043d%5Cu0438%5Cu044f%22%2C%20%22Notifications%22%3A%20%22%5Cu0418%5Cu0437%5Cu0432%5Cu0435%5Cu0441%5Cu0442%5Cu044f%5Cu0432%5Cu0430%5Cu043d%5Cu0438%5Cu044f%22%7D%2C%20%22bs%22%3A%20%7B%22Messages%22%3A%20%22Poruke%22%2C%20%22Notifications%22%3A%20%22Obavje%5Cu0161tenja%22%7D%2C%20%22ca%22%3A%20%7B%22Messages%22%3A%20%22Missatges%22%2C%20%22Notifications%22%3A%20%22Notificacions%22%7D%2C%20%22ca%40valencia%22%3A%20%7B%22Messages%22%3A%20%22Missatges%22%2C%20%22Notifications%22%3A%20%22Notificacions%22%7D%2C%20%22cs%22%3A%20%7B%22Messages%22%3A%20%22Zpr%5Cu00e1vy%22%2C%20%22Notifications%22%3A%20%22Ozn%5Cu00e1men%5Cu00ed%22%7D%2C%20%22cy%22%3A%20%7B%22Messages%22%3A%20%22Negeseuon%22%2C%20%22Notifications%22%3A%20%22Hysbysiadau%22%7D%2C%20%22da%22%3A%20%7B%22Messages%22%3A%20%22Beskeder%22%2C%20%22Notifications%22%3A%20%22P%5Cu00e5mindelser%22%7D%2C%20%22de%22%3A%20%7B%22Messages%22%3A%20%22Mitteilungen%22%2C%20%22Notifications%22%3A%20%22Benachrichtigungen%22%7D%2C%20%22el%22%3A%20%7B%22Messages%22%3A%20%22%5Cu039c%5Cu03b7%5Cu03bd%5Cu03cd%5Cu03bc%5Cu03b1%5Cu03c4%5Cu03b1%22%2C%20%22Notifications%22%3A%20%22%5Cu0395%5Cu03b9%5Cu03b4%5Cu03bf%5Cu03c0%5Cu03bf%5Cu03b9%5Cu03ae%5Cu03c3%5Cu03b5%5Cu03b9%5Cu03c2%22%7D%2C%20%22en_AU%22%3A%20%7B%7D%2C%20%22en_CA%22%3A%20%7B%7D%2C%20%22en_GB%22%3A%20%7B%7D%2C%20%22en_US%22%3A%20%7B%7D%2C%20%22eo%22%3A%20%7B%22Messages%22%3A%20%22Mesa%5Cu011doj%22%2C%20%22Notifications%22%3A%20%22Atentigoj%22%7D%2C%20%22es%22%3A%20%7B%22Messages%22%3A%20%22Mensajes%22%2C%20%22Notifications%22%3A%20%22Notificaciones%22%7D%2C%20%22et%22%3A%20%7B%22Messages%22%3A%20%22S%5Cu00f5numid%22%2C%20%22Notifications%22%3A%20%22Teavitused%22%7D%2C%20%22eu%22%3A%20%7B%22Messages%22%3A%20%22Mezuak%22%2C%20%22Notifications%22%3A%20%22Jakinarazpenak%22%7D%2C%20%22fa%22%3A%20%7B%22Messages%22%3A%20%22%5Cu067e%5Cu06cc%5Cu0627%5Cu0645%5Cu200c%5Cu0647%5Cu0627%22%2C%20%22Notifications%22%3A%20%22%5Cu0622%5Cu06af%5Cu0627%5Cu0647%5Cu200c%5Cu0633%5Cu0627%5Cu0632%5Cu06cc%5Cu200c%5Cu0647%5Cu0627%22%7D%2C%20%22fi%22%3A%20%7B%22Messages%22%3A%20%22Viestit%22%2C%20%22Notifications%22%3A%20%22Ilmoitukset%22%7D%2C%20%22fr%22%3A%20%7B%7D%2C%20%22gd%22%3A%20%7B%22Messages%22%3A%20%22Teachdaireachdan%22%2C%20%22Notifications%22%3A%20%22Fiosan%22%7D%2C%20%22gl%22%3A%20%7B%22Messages%22%3A%20%22Mensaxes%22%2C%20%22Notifications%22%3A%20%22Notificaci%5Cu00f3ns%22%7D%2C%20%22gu%22%3A%20%7B%7D%2C%20%22he%22%3A%20%7B%22Messages%22%3A%20%22%5Cu05d4%5Cu05d5%5Cu05d3%5Cu05e2%5Cu05d5%5Cu05ea%22%2C%20%22Notifications%22%3A%20%22%5Cu05d4%5Cu05ea%5Cu05e8%5Cu05e2%5Cu05d5%5Cu05ea%22%7D%2C%20%22hi%22%3A%20%7B%7D%2C%20%22hr%22%3A%20%7B%7D%2C%20%22hu%22%3A%20%7B%22Messages%22%3A%20%22%5Cu00dczenetek%22%2C%20%22Notifications%22%3A%20%22%5Cu00c9rtes%5Cu00edt%5Cu00e9sek%22%7D%2C%20%22id%22%3A%20%7B%22Messages%22%3A%20%22Pesan%22%2C%20%22Notifications%22%3A%20%22Pemberitahuan%22%7D%2C%20%22is%22%3A%20%7B%22Messages%22%3A%20%22Skilabo%5Cu00f0%22%2C%20%22Notifications%22%3A%20%22Tilkynningar%22%7D%2C%20%22it%22%3A%20%7B%22Messages%22%3A%20%22Messaggi%22%2C%20%22Notifications%22%3A%20%22Notifiche%22%7D%2C%20%22ja%22%3A%20%7B%22Messages%22%3A%20%22%5Cu30e1%5Cu30c3%5Cu30bb%5Cu30fc%5Cu30b8%22%2C%20%22Notifications%22%3A%20%22%5Cu901a%5Cu77e5%22%7D%2C%20%22jbo%22%3A%20%7B%22Messages%22%3A%20%22notci%22%7D%2C%20%22ko%22%3A%20%7B%22Messages%22%3A%20%22%5Cuba54%5Cuc2dc%5Cuc9c0%22%2C%20%22Notifications%22%3A%20%22%5Cuc54c%5Cub9bc%22%7D%2C%20%22lt%22%3A%20%7B%22Messages%22%3A%20%22%5Cu017dinut%5Cu0117s%22%2C%20%22Notifications%22%3A%20%22Prane%5Cu0161imai%22%7D%2C%20%22lv%22%3A%20%7B%22Messages%22%3A%20%22Zi%5Cu0146ojumi%22%2C%20%22Notifications%22%3A%20%22Pazi%5Cu0146ojumi%22%7D%2C%20%22mhr%22%3A%20%7B%22Messages%22%3A%20%22%5Cu041a%5Cu0430%5Cu043b%5Cu0430%5Cu0441%5Cu044b%5Cu043c%5Cu0430%5Cu0448-%5Cu0432%5Cu043b%5Cu0430%5Cu043a%22%2C%20%22Notifications%22%3A%20%22%5Cu0423%5Cu0432%5Cu0435%5Cu0440%5Cu0442%5Cu0430%5Cu0440%5Cu044b%5Cu043c%5Cu0430%5Cu0448-%5Cu0432%5Cu043b%5Cu0430%5Cu043a%22%7D%2C%20%22mk%22%3A%20%7B%7D%2C%20%22ml%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0d38%5Cu0d28%5Cu0d4d%5Cu0d26%5Cu0d47%5Cu0d36%5Cu0d19%5Cu0d4d%5Cu0d19%5Cu0d7e%22%2C%20%22Notifications%22%3A%20%22%5Cu0d05%5Cu0d31%5Cu0d3f%5Cu0d2f%5Cu0d3f%5Cu0d2a%5Cu0d4d%5Cu0d2a%5Cu0d41%5Cu0d15%5Cu0d7e%22%7D%2C%20%22mr%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0938%5Cu0902%5Cu0926%5Cu0947%5Cu0936%22%7D%2C%20%22ms%22%3A%20%7B%22Messages%22%3A%20%22Mesej%22%2C%20%22Notifications%22%3A%20%22Pemberitahuan%22%7D%2C%20%22my%22%3A%20%7B%22Messages%22%3A%20%22%5Cu1005%5Cu102c%5Cu1019%5Cu103b%5Cu102c%5Cu1038%22%2C%20%22Notifications%22%3A%20%22%5Cu1021%5Cu101e%5Cu102d%5Cu1015%5Cu1031%5Cu1038%5Cu1001%5Cu103b%5Cu1000%5Cu103a%22%7D%2C%20%22nb%22%3A%20%7B%7D%2C%20%22nl%22%3A%20%7B%22Messages%22%3A%20%22Berichten%22%2C%20%22Notifications%22%3A%20%22Notificaties%22%7D%2C%20%22oc%22%3A%20%7B%22Messages%22%3A%20%22Messatges%22%2C%20%22Notifications%22%3A%20%22Notificacions%22%7D%2C%20%22os%22%3A%20%7B%7D%2C%20%22pl%22%3A%20%7B%22Messages%22%3A%20%22Wiadomo%5Cu015bci%22%2C%20%22Notifications%22%3A%20%22Powiadomienia%22%7D%2C%20%22pt%22%3A%20%7B%22Messages%22%3A%20%22Mensagens%22%2C%20%22Notifications%22%3A%20%22Notifica%5Cu00e7%5Cu00f5es%22%7D%2C%20%22pt_BR%22%3A%20%7B%22Messages%22%3A%20%22Mensagens%22%2C%20%22Notifications%22%3A%20%22Notifica%5Cu00e7%5Cu00f5es%22%7D%2C%20%22ro%22%3A%20%7B%22Messages%22%3A%20%22Mesaje%22%2C%20%22Notifications%22%3A%20%22Notific%5Cu0103ri%22%7D%2C%20%22ru%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0421%5Cu043e%5Cu043e%5Cu0431%5Cu0449%5Cu0435%5Cu043d%5Cu0438%5Cu044f%22%2C%20%22Notifications%22%3A%20%22%5Cu0423%5Cu0432%5Cu0435%5Cu0434%5Cu043e%5Cu043c%5Cu043b%5Cu0435%5Cu043d%5Cu0438%5Cu044f%22%7D%2C%20%22se%22%3A%20%7B%22Messages%22%3A%20%22Reivvet%22%2C%20%22Notifications%22%3A%20%22Muittuhusat%22%7D%2C%20%22shn%22%3A%20%7B%22Messages%22%3A%20%22%5Cu101c%5Cu102d%5Cu1075%5Cu103a%5Cu1088%5Cu1075%5Cu1082%5Cu1062%5Cu1019%5Cu103a%5Cu1038%5Cu1015%5Cu103d%5Cu1010%5Cu103a%5Cu1038%22%2C%20%22Notifications%22%3A%20%22%5Cu1076%5Cu1031%5Cu1083%5Cu1088%5Cu107d%5Cu1062%5Cu1004%5Cu1037%5Cu103a%5Cu1015%5Cu107c%5Cu103a%22%7D%2C%20%22sk%22%3A%20%7B%22Messages%22%3A%20%22Spr%5Cu00e1vy%22%2C%20%22Notifications%22%3A%20%22Ozn%5Cu00e1menia%22%7D%2C%20%22sl%22%3A%20%7B%22Messages%22%3A%20%22Sporo%5Cu010dila%22%2C%20%22Notifications%22%3A%20%22Obvestila%22%7D%2C%20%22sq%22%3A%20%7B%22Messages%22%3A%20%22Mesazhet%22%2C%20%22Notifications%22%3A%20%22Njoftime%22%7D%2C%20%22sr%22%3A%20%7B%22Messages%22%3A%20%22%5Cu041f%5Cu043e%5Cu0440%5Cu0443%5Cu043a%5Cu0435%22%2C%20%22Notifications%22%3A%20%22%5Cu041e%5Cu0431%5Cu0430%5Cu0432%5Cu0435%5Cu0448%5Cu0442%5Cu0435%5Cu045a%5Cu0430%22%7D%2C%20%22sv%22%3A%20%7B%7D%2C%20%22tg%22%3A%20%7B%22Messages%22%3A%20%22%5Cu041f%5Cu0430%5Cu0451%5Cu043c%5Cu04b3%5Cu043e%22%2C%20%22Notifications%22%3A%20%22%5Cu041e%5Cu0433%5Cu043e%5Cu04b3%5Cu0438%5Cu04b3%5Cu043e%22%7D%2C%20%22th%22%3A%20%7B%7D%2C%20%22tr%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0130letiler%22%2C%20%22Notifications%22%3A%20%22Bildirimler%22%7D%2C%20%22ug%22%3A%20%7B%22Messages%22%3A%20%22%5Cu0626%5Cu06c7%5Cu0686%5Cu06c7%5Cu0631%5Cu0644%5Cu0627%5Cu0631%22%2C%20%22Notifications%22%3A%20%22%5Cu0626%5Cu06c7%5Cu0642%5Cu062a%5Cu06c7%5Cu0631%5Cu06c7%5Cu0634%5Cu0644%5Cu0627%5Cu0631%22%7D%2C%20%22uk%22%3A%20%7B%22Messages%22%3A%20%22%5Cu041f%5Cu043e%5Cu0432%5Cu0456%5Cu0434%5Cu043e%5Cu043c%5Cu043b%5Cu0435%5Cu043d%5Cu043d%5Cu044f%22%2C%20%22Notifications%22%3A%20%22%5Cu0421%5Cu043f%5Cu043e%5Cu0432%5Cu0456%5Cu0449%5Cu0435%5Cu043d%5Cu043d%5Cu044f%22%7D%2C%20%22uz%22%3A%20%7B%22Messages%22%3A%20%22Xabarlar%22%2C%20%22Notifications%22%3A%20%22Eslatmalar%22%7D%2C%20%22vi%22%3A%20%7B%22Messages%22%3A%20%22Tin%20nh%5Cu1eafn%22%2C%20%22Notifications%22%3A%20%22Th%5Cu00f4ng%20b%5Cu00e1o%22%7D%2C%20%22zh_CN%22%3A%20%7B%22Messages%22%3A%20%22%5Cu6d88%5Cu606f%22%2C%20%22Notifications%22%3A%20%22%5Cu901a%5Cu77e5%22%7D%2C%20%22zh_HK%22%3A%20%7B%22Messages%22%3A%20%22%5Cu8a0a%5Cu606f%22%2C%20%22Notifications%22%3A%20%22%5Cu901a%5Cu77e5%22%7D%2C%20%22zh_TW%22%3A%20%7B%22Messages%22%3A%20%22%5Cu8a0a%5Cu606f%22%2C%20%22Notifications%22%3A%20%22%5Cu901a%5Cu77e5%22%7D%2C%20%22zn_CN%22%3A%20%7B%7D%7D"
));

window.Unity = external.getUnityObject('1.0');

function isCorrectPage() {
    var i, ids = ['mercurymessagesCountValue'];

    for (i = 0; i < ids.length; i++) {
        if (!document.getElementById(ids[i])) {
            return false;
        }
    }

    return true;
}

function getMessageCountElement() {
    return document.getElementById('mercurymessagesCountValue');
}

function getNotificationCountElement() {
    return document.getElementById('notificationsCountValue');
}

function selfTest() {
    if (!getMessageCountElement()) {
        reportTestState('FAILED: getMessageCountElement is null');
        return;
    }

    if (!getNotificationCountElement()) {
        reportTestState('FAILED: getNotificationCountElement is null');
        return;
    }

    reportTestState('PASS SELF TEST');
}

function messagingIndicatorSetup() {
    if (!isCorrectPage()) {
        return;
    }
    var countElement = getMessageCountElement();
    var notificationElement = getNotificationCountElement();

    function checkMessagesCount() {
        var indicators = [];
        function makeCallback(node) {
            return function () { launchClickEvent(node.parentNode); };
        }
        indicators.push({ name: _("Messages"),
                          count: countElement.textContent,
                          callback: makeCallback(countElement) });
        indicators.push({ name: _("Notifications"),
                          count: notificationElement.textContent,
                          callback: makeCallback(notificationElement) });
        return indicators;
    }
    var indicatorsController = new Indicators(checkMessagesCount);

    if (document.location.hostname === 'apps.facebook.com') {
        var name = document.evaluate('//div[@role="contentinfo"]/div/span', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.textContent;
        linkVisited(document.location.toString(), name);
    }
console.log(JSON.stringify(checkMessagesCount()));
    selfTest();
}

if (document.getElementById('email')) {
    var email = document.getElementById('email');

    window.onunload = function () {
        localStorage.setItem('login', email.value);
    };
}

var login = localStorage.getItem('login');
if (!login) {
    login = null;
}

Unity.init({ name: "facebook",
             iconUrl: "icon://unity-webapps-facebook",
             login: login,
             domain: 'facebook.com',
             homepage: 'https://www.facebook.com/',
             onInit: wrapCallback(messagingIndicatorSetup) });
