function createMessagingProxyForCurrentWebRuntime() {
    if (navigator &&
            navigator.qt &&
            navigator.qt.postMessage &&
            navigator.qt.onmessage) {
        return new UnityQtWebkitBackendMessagingProxy();
    }
    else if (oxide) {
        return new UnityOxideBackendMessagingProxy();
    }
    return null;
}

function UnityOxideBackendMessagingProxy() {
}
UnityOxideBackendMessagingProxy.prototype = {
    postMessage: function(content) {
        // a little bit of a dup from whats in UnityWebAppsUtils.js
        var message = JSON.parse(content);
        oxide.sendMessage("UnityWebappApi-Message", message)
        oxide.sendMessage('UnityWebappApi-Message', {data: 'sendinf message: ' + JSON.stringify(message)})
    },
    addMessageHandler: function(callback) {
        if (callback && typeof callback === 'function')
            // a little bit of a dup from whats in UnityWebAppsUtils.js
            oxide.addMessageHandler("UnityWebappApi-Host-Message", callback);
    },
};

function UnityQtWebkitBackendMessagingProxy() {
}
UnityQtWebkitBackendMessagingProxy.prototype = {
    postMessage: function(content) {
        navigator.qt.postMessage(content);
    },
    addMessageHandler: function(callback) {
        if (callback && typeof callback === 'function')
            navigator.qt.onmessage = callback;
    },
};
