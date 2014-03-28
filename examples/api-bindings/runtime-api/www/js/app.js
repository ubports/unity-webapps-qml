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

    api.RuntimeApi.getApplication(function(application) {
        setResult('application name: ' + application.getApplicationName());
        setResult('application info: ' + JSON.stringify(application.getPlatformInfo()));

        application.getInputMethodName(function(name) {
            if (name.length == 0)
                setResult('input method: no OSK available');
            else
                setResult('input method: ' + name);
        });

        setResult('screen orientation: ' + application.getScreenOrientation());

        application.onScreenOrientationChanged(function(name) {
            setResult('Event: orientation changed - ' + name);
        });

        application.onAboutToQuit(function(killed) {
            localStorage.setItem("lastkilled", last + 1);

            console.log('killed: ' + killed)

            setResult('onAboutToQuit: ' + killed);
        });

        application.onDeactivated(function() {
            setResult('Event: application deactivated');
        });

        application.onActivated(function() {
            setResult('Event: application activated');
        });

        application.onInputMethodVisibilityChanged(function(visibility) {
            setResult('Event: onInputMethodVisibilityChanged - ' + visibility);
        });

        application.setupUriHandler(function(uris) {
            setResult('Event: received URI to open w/ UriHandler - ' + JSON.stringify(uris));
        });

    });
};
