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

    function displayImages(images) {
        var res = document.getElementById('results');
        for (var i = 0; i < images.length; ++i) {
            var img = document.createElement('img');

            img.setAttribute('src', images[i].url);

            if (images[i].name && images[i].name.length !== 0)
                img.setAttribute('alt', images[i].name);

            res.appendChild(img);
        }
    };

    function aborted() {
        setResults('Transfer aborted');
    };

    function setResults(results) {
        var resultEl = document.getElementById('results');
        resultEl.innerHTML = results;

        displayImages(results);
    };

    function formatResults(results) {
        var content = '<ul>';
        for (var i = 0; i < results.length; ++i) {
            content += '<li>'
            + results[i].name
            + ', '
            + results[i].url
            + '</li>';
        }
        content += '</ul>';
        return content;
    };

    function renderResults(results) {
        setResults(formatResults(results));
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
                            if (transferState.Aborted === state) {
                                transfer.finalize();
                                peer.destroy();
                                transfer.destroy();
                                aborted();
                                return;
                            }

                            if (transferState.Charged === state) {
                                transfer.items(function(items) {
                                    for (var i = 0; i < items.length; ++i) {
                                        addResult(items[i]);
                                    }
                                    transfer.finalize();
                                    peer.destroy();
                                    transfer.destroy();
                                });
                            }
                        });
                });
            });
    }
};
