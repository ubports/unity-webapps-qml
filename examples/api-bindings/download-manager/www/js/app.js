window.onload = function() {
    var api = external.getUnityObject('1.0');

    document.getElementById('download1').addEventListener('click', function() {
        api.DownloadApi.downloadFile('http://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png'
                                     , {}
                                     , function(download) {
                                         if (download.status === "Success")
                                             displayImageUri(download.path);
                                         setResult(JSON.stringify(download.path))
                                     });
    });

    document.getElementById('download2').addEventListener('click', function() {
        api.DownloadApi.createDownloadManager({}, function(manager) {
            manager.downloadsChanged(function(downloads) {
                if (downloads && downloads.length !== 0) {
                    setResult('Downloading a 10 MB image');
                    downloads[0].progressChanged(function(progress) {
                        setProgress(progress);
                    });
                    downloads[0].finished(function(path) {
                        displayImageUri(path);
                        downloads[0].destroy();
                    });
                    downloads[0].canceled(function() {
                        setResults('Download opertaion cancelled');
                    });
                    downloads[0].start();
                }
            });
            manager.download("http://files.meetup.com/596486/La%20CANADA%20FIRES%20FROM%20CULVER%20CITY%20-%20(10%20MEG%20FILE).jpg");
        });
    });

    function displayImageUri(image) {
        var res = document.getElementById('results');

        var img = document.createElement('img');

        img.setAttribute('src', image);
        img.setAttribute('height', '100px');
        img.setAttribute('width', '100px');

        res.appendChild(img);
    };

    function setResult(results) {
        var resultEl = document.getElementById('results');
        resultEl.innerHTML += results + '<br>';
    };

    function setProgress(progress) {
        var resultEl = document.getElementById('progress');
        resultEl.innerHTML = progress;
    };
};

