// ==UserScript==
// @include       http://www.bbc.co.uk/news/
// @include       http://www.bbc.com/news/
// @require       utils.js
// ==/UserScript==

// This placeholder gets munged with real data at build time.
const WebappsGettextDict = JSON.parse(unescape(
  "[]"
));

window.Unity = external.getUnityObject('1.0');

function isCorrectPage() {
    var i, ids = ['tickerHolder'];

    for (i = 0; i < ids.length; i++) {
        if (!document.getElementById(ids[i])) {
            return false;
        }
    }
    return true;
}

function messagingIndicatorSetup() {
    if (!isCorrectPage()) {
        return;
    }
    var recent = document.getElementById('tickerHolder');

    recent.addEventListener('DOMSubtreeModified', wrapCallback(function () {
        var title = null, node = document.evaluate('div/div/p/a', recent, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;

        if (node) {
            title = node.textContent;
        }

        if (title && !localStorage.getItem(title)) {
            localStorage.setItem(title, true);
            Unity.Notification.showNotification("BBC", title, null);
        }
    }), false);
}

Unity.init({ name: "BBC News",
             domain: 'bbc.co.uk',
             homepage: 'http://www.bbc.co.uk/news/',
             iconUrl: "icon://unity-webapps-bbc",
             onInit: wrapCallback(messagingIndicatorSetup) });
