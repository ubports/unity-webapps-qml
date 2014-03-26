window.onload = function() {
    function setResult(message) {
        var results = document.getElementById('results');
        results.innerHTML += message + '<br>';
    }

    var last = 0;
    if (localStorage.getItem("lastkilled") !== null)
        last = localStorage.getItem("lastkilled");

    setResult('last killed: ' + last);

    var api = external.getUnityObject('1.0');
    api.ApplicationApi.getApplicationName(function(name) {
        setResult('application name: ' + name);
    });
    api.ApplicationApi.getPlatformInfo(function(info) {
        setResult(info.name);
    });
    api.ApplicationApi.getInputMethodName(function(name) {
        if (name.length == 0)
            setResult('input method: no OSK available');
        else
            setResult('input method: ' + name);
    });
    api.ApplicationApi.getScreenOrientation(function(name) {
        setResult(name);
    });
    api.ApplicationApi.onScreenOrientationChanged(function(name) {
        setResult('orirntation: ' + name);
    });
    api.ApplicationApi.onAboutToQuit(function(killed) {
        localStorage.setItem("lastkilled", last + 1);

        console.log('killed: ' + killed)

        setResult('onAboutToQuit: ' + killed);
    });
    api.ApplicationApi.onDeactivated(function() {
        setResult('Application deactivated');
    });
    api.ApplicationApi.onActivated(function() {
        setResult('Application activated');
    });
    api.ApplicationApi.onInputMethodVisibilityChanged(function(visibility) {
        setResult('onInputMethodVisibilityChanged: ' + visibility);
    });

    api.ApplicationApi.setupUriHandler(function(uris) {
        setResult('setupUriHandler: ' + JSON.stringify(uris));
    });

    /*
    document.getElementById('inputMethodVisibleButton').addEventListener('click', function() {
        api.ApplicationApi.setInputMethodVisible(true, function() {
            setResult('setInputMethodVisible: true');
        });
    });
*/
};
