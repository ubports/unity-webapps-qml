window.onload = function() {
    var api = external.getUnityObject(1.0);
    var hub = api.ContentHub;

    var transferState = hub.ContentTransfer.State;
    var pictureContentType = hub.ContentType.Pictures;

    var sourcePeers = {};
    hub.knownSourcesForType(
        pictureContentType
        , function (peers) {
            for (var j = 0; j < peers.length; ++j) {
                addPeerElement(peers[j].appId(), peers[j].name());
                sourcePeers[peers[j].appId()] = peers[j];
            }

            console.log('peers defaultSourceForType: ' + peers)
            hub.defaultSourceForType(
                pictureContentType
                , function(peer) {
                    if (peer) {
                        addPeerElement(peer.appId(), peer.name());
                        sourcePeers[peer.appId()] = peer;
                    }

                    if (Object.keys(sourcePeers).length === 0) {
                        nopeers();
                        return;
                    }
                    document.getElementById('importdiv').style.display = 'block';
                    document.getElementById('lowLevelImportdiv').style.display = 'block';
                  }
            );
        });

    document.getElementById('import').addEventListener('click', doSimpleApiImport);
    document.getElementById('lowLevelImport').addEventListener('click', doLowLevelImport);

    function addPeerElement(appId, name) {
        var peers = document.querySelector('#known-peers ul');
        var li = document.createElement('li');

        var span = document.createElement('span');

        var text = document.createTextNode('appId: ' + appId + ', name: ' + name)
        span.appendChild(text);

        li.appendChild(span);
        li.addEventListener('click', function (e) { li.classList.toggle('selected'); });
        li.setAttribute('data-appid', appId);

        peers.appendChild(li);
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
            img.setAttribute('height', '100px');
            img.setAttribute('width', '100px');

            if (images[i].name && images[i].name.length !== 0)
                img.setAttribute('alt', images[i].name);

            res.appendChild(img);
        }
    };

    function aborted() {
        setResults('Transfer aborted');
    };

    function nopeers() {
        setResults('No peers found');
    };

    function selectonlyonepeer() {
        setResults('Please select only one peer');
    };

    function pleaseselectonepeer() {
        setResults('Please select one peer');
    };

    function setResults(results) {
        var resultEl = document.getElementById('results');
        resultEl.innerHTML = results;
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
        displayImages(results);
    };

    function doSimpleApiImport() {
        var peers = document.querySelectorAll('#known-peers ul li.selected');
        if (peers.length > 1) {
            selectonlyonepeer();
            return;
        }
        if (peers.length === 0) {
            pleaseselectonepeer();
            return;
        }

        var peer = sourcePeers[peers[0].getAttribute('data-appid')];
        if (! peer) {
            return;
        }

        hub.api.importContent(pictureContentType
                      , peer
                      , {importToLocalStore: true}
                      , function(items) {
                          for (var i = 0; i < items.length; ++i) {
                              addResult(items[i]);
                          }
                      }
                      , function() {
                          aborted();
                      });
    };

    function doLowLevelImport() {
        var peers = document.querySelectorAll('#known-peers ul li.selected');
        if (peers.length > 1) {
            selectonlyonepeer();
            return;
        }
        if (peers.length === 0) {
            pleaseselectonepeer();
            return;
        }

        var peer = sourcePeers[peers[0].getAttribute('data-appid')];
        if (! peer) {
            return;
        }

        hub.importContentForPeer(
            pictureContentType,
            peer,
            function(transfer) {

                hub.defaultStoreForType(pictureContentType, function(store) {
                    transfer.setStore(store, function() {

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
        );
    };
};

