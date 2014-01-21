window.onload = function() {
    document.getElementById('import').addEventListener('click', doImport);

    function setPeer(appId, name) {
        var peer = document.getElementById('peer');
        peer.innerHTML = 'appId: '
            + appId
            + ', name: '
            + name;
    };

    var results = [];
    function addResult(item) {
        results.push({name: item.name, url: item.url});
        renderResults(results);
    };

    function renderResults(results) {
        var resultEl = document.getElementById('results');
        var content = '<ul>';
        for (var i = 0; i < results.length; ++i) {
            content += '<li>'
            + results[i].name
            + ', '
            + results[i].url
            + '</li>';
        }
        content += '</ul>';
        resultEl.innerHTML = content;
    };

    function doImport() {
        var api = external.getUnityObject(1.0);
        var hub = api.ContentHub;

        var transferState = hub.ContentTransfer.State;
        var pictureContentType = hub.ContentType.Pictures;

        hub.defaultSourceForType(
            pictureContentType
            , function (peer) {
                setPeer(peer.appId(), peer.name());

                hub.importContentForPeer(
                    pictureContentType,
                    peer,
                    function(transfer) {
                        transfer.start(function(state) {
                            if (transferState.Charged == state) {
                                transfer.items(function(items) {
                                    for (var i = 0; i < items.length; ++i) {
                                        addResult(items[i]);
                                    }
                                });
                            }
                        });
                });
            });
    }
};
