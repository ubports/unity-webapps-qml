window.onload = function() {
    var api = external.getUnityObject('1.0');
    var hub = api.ContentHub;

    var transferState = hub.ContentTransfer.State;
    var pictureContentType = hub.ContentType.Pictures;

    document.getElementById('pick').addEventListener('click', doContentPeerPicking);
    function doContentPeerPicking() {
	hub.launchContentPeerPicker(
	    {
		contentType: hub.ContentType.Pictures,
		handler: hub.ContentHandler.Source,
	    },
	    function(peer) {
		if ( ! peer) {
		    nopeers();
		    return;
		}
		addPeerElement(peer.appId(), peer.name());
		doSimpleApiImport(peer);
	    },
	    function() {
		aborted();
	    });
    };

    function addPeerElement(appId, name) {
        var selectedpeer = document.querySelector('#selected-peer');
        var span = document.createElement('span');

        var text = document.createTextNode('appId: ' + appId + ', name: ' + name)
        span.appendChild(text);
        selectedpeer.appendChild(span);
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

    function doSimpleApiImport(peer) {
        hub.api.importContent(pictureContentType
                      , peer
                      , {scope: hub.ContentScope.App}
                      , function(items) {
                          for (var i = 0; i < items.length; ++i) {
                              addResult(items[i]);
                          }
                      }
                      , function() {
                          aborted();
                      });
    };
};

