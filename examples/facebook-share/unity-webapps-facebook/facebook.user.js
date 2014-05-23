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
    //console.log(res);
    var results = JSON.parse(res);
    //console.log (results);
    console.log (results.accessToken);
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + results.accessToken, true );
    xhr.onload = xhr.onerror = function() {
        console.log("status: " + xhr.status + " : " + xhr.responseText );
        if ( xhr.status == 200 )
            window.location.reload();
    };

    var contentType = results.fileToShare.split(',')[0].split(':')[1];
    var b64data = results.fileToShare.split(',')[1];

    console.log ("Content Type: " + contentType);
    var byteCharacters = atob(b64data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    var div = document.createElement('div');
    div.innerHTML = '<form enctype="multipart/form-data" method="post" id="uploadForm"><textarea id="message" name="message"></textarea></form>';
    document.getElementsByTagName('body')[0].appendChild(div);

    var blob = new Blob([byteArray], {type: contentType});

    console.log('blob size: ' + blob.size);
    console.log(blob.type);

    var uploadForm = document.forms.namedItem("uploadForm");
    var formData = new FormData(uploadForm);
    formData.append('source', blob);
    formData.append('message', results.message);
    xhr.send(formData);

}


