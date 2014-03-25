window.onload = function() {
    var api = external.getUnityObject('1.0');

    document.getElementById('download1').addEventListener('click', function() {
        api.DownloadApi.downloadFile('http://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png'
                                     , {}
                                     , function(download) {
                                         setResult(download)
                                     });
    });


    function setResult(results) {
        var resultEl = document.getElementById('results');
        resultEl.innerHTML += results + '<br>';
    };
};

