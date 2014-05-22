var api = external.getUnityObject('1.0');

var oa = api.OnlineAccounts;
var hub = api.ContentHub;

function _shareRequested(transfer) {
    transfer.items(function(items) {
	api.launchEmbeddedUI("hub-sharer", upload, {"fileToShare": items[0]});
    });
};
hub.onShareRequested(_shareRequested);

function upload(results) {
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + results.accessToken, true );
    xhr.onload = xhr.onerror = function() {
        console.log( xhr.responseText );
    };

    var xhrr = new XMLHttpRequest();
    xhrr.open("GET", results.fileToShare, true);
    xhrr.responseType = "blob";
    xhrr.onload = function (e) {
        var blob = new Blob([xhrr.response], {type: "image/png"});
        var formData = new FormData();
        formData.append('source', blob);
        formData.append('message', results.message);
        xhr.send(formData);
    }
    xhrr.send();
}


