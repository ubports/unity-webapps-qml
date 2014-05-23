var api = external.getUnityObject('1.0');
var oa = api.OnlineAccounts;
var hub = api.ContentHub;

function _shareRequested(transfer) {
    transfer.items(function(items) {
	api.launchEmbeddedUI("HubSharer", upload, {"fileToShare": items[0]});
    });
};
hub.onShareRequested(_shareRequested);

function upload(res) {
    var results = JSON.parse(res);
    //console.log (results);
    console.log (results.accessToken);
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + results.accessToken, true );
    xhr.onload = xhr.onerror = function() {
        console.log( xhr.responseText );
    };

    //var xhrr = new XMLHttpRequest();
    //var re = /file:\/\//gi;
    //var file = results.fileToShare.replace(re, '');
    //console.log ("FILE: " + results.fileToShare);
    console.log('file to share lenght: ' + [].slice.call(results.fileToShare).length)

    console.log(results.fileToShare)

    console.log("After atob: " + atob(results.fileToShare))

    var bin = atob(results.fileToShare);
    var a = new Uint8Array(results.contentlength);

    console.log('results.length: ' + results.size)

    for (var i = 0; i < results.size; ++i) {
	a[i] = bin.charCodeAt(i);
    }

    console.log("array buffer content: " + btoa(a.buffer))

    var div = document.createElement('div');
    div.innerHTML = '<form enctype="multipart/form-data" method="post" id="uploadForm"><textarea id="message" name="message"></textarea></form>';
    document.getElementsByTagName('body')[0].appendChild(div);

    var blob = new Blob([a], {type: "image/png"});

    console.log('blob size: ' + blob.size)
    console.log(blob.type)

    var uploadForm = document.forms.namedItem("uploadForm");
    var formData = new FormData(uploadForm);
    formData.append('source', blob);
    xhr.send(formData);

    /*
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
    */
}


