window.onload = function() {
    function setResult(message) {
        var results = document.getElementById('results');
        results.innerHTML += message + '<br>';
    }

    var api = external.getUnityObject('1.0');
    api.ApplicationApi.applicationName(function(name) {
        setResult('application name: ' + name);
    });
    api.ApplicationApi.getPlatformInfos(function(name) {
        setResult(name);
    });
    api.ApplicationApi.getInputMethod(function(name) {
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
    api.ApplicationApi.onAboutToQuit(function(name) {
        setResult('onAboutToQuit: ' + name);
    });
    api.ApplicationApi.onDeactivated(function(name) {
        setResult('onDeactivated: ' + name);
    });
    api.ApplicationApi.onActivated(function(name) {
        setResult('onActivated: ' + name);
    });
    api.ApplicationApi.onInputMethodVisibilityChanged(function(visibility) {
        setResult('onInputMethodVisibilityChanged: ' + visibility);
    });
    document.getElementById('inputMethodVisibleButton').addEventListener('click', function() {
        api.ApplicationApi.setInputMethodVisible(true, function() {
            setResult('setInputMethodVisible: true');
        });
    });
};
