window.onload = function() {
    var api = external.getUnityObject(1.0);
    var hub = api.ContentHub;

    var transferState = hub.ContentTransfer.State;

    function onExportRequested(transfer) {
        log('Received an export request');

        transfer.setItems([{name: 'Ubuntu One', url: ''}],
                          function() {
                              log('The items have been set in the ContentTransfer');
                              transfer.setState(hub.ContentTransfer.State.Charged);
                              log('State set to "Charged"');
                          });
    };

    hud.onExportRequested(onExportRequested);

    function log(content) {
        var resultEl = document.getElementById('results');
        resultEl.innerHTML = resultEl.innerHTML + '<br>' + content;
    };
};
