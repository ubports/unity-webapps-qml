window.onload = function() {
    var api = external.getUnityObject('1.0');
    var hub = api.ContentHub;

    var transferState = hub.ContentTransfer.State;

    function _exportRequested(transfer) {
        log('Received an export request');

        var url = window.location.href;
        url = url.substr(0, url.lastIndexOf('/')+1) + 'img/ubuntuone-music.png';

        log('item url: ' + url);

        transfer.setItems([{name: 'Ubuntu One', url: url}],
                          function() {
                              log('The items have been set in the ContentTransfer');
                              transfer.setState(hub.ContentTransfer.State.Charged);
                              log('State set to "Charged"');
                          });
    };
    hub.onExportRequested(_exportRequested);

    function log(content) {
        var resultEl = document.getElementById('results');
        resultEl.innerHTML = resultEl.innerHTML + '<br>' + content;
    };
};
