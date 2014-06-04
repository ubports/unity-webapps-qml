/**
 *
 * Download API backend binding
 *
 */
function createDownloadApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.DownloadManager';
    var VERSION = 0.1;

    function SingleDownload(singledownload, objectid) {
        var id = objectid;
        if ( ! singledownload) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'SingleDownload');
            id = result.id;
            singledownload = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(singledownload,
                    PLUGIN_URI, VERSION, 'SingleDownload');
        }

        this._id = id;
        this._object = singledownload;
    };
    SingleDownload.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            backendDelegate.deleteId(this._id);
        },

        // object methods
        serialize: function() {
            return {
                type: 'object-proxy',
                apiid: 'DownloadApi',
                objecttype: 'SingleDownload',
                objectid: this._id,
            }
        },

        // methods

        cancel: function() {
            this._validate();
            this._object.cancel();
        },
        start: function() {
            this._validate();
            this._object.start();
        },
        pause: function() {
            this._validate();
            this._object.pause();
        },
        resume: function() {
            this._validate();
            this._object.resume();
        },
        download: function(url) {
            this._validate();
            this._object.download(url);
        },


        // properties
        autoStart: function(callback) {
            this._validate();
            callback(this._object.autoStart);
        },
        setAutoStart: function(shouldAutoStart, callback) {
            this._validate();
            this._object.autoStart = shouldAutoStart;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        allowMobileDownload: function(callback) {
            this._validate();
            callback(this._object.allowMobileDownload);
        },
        setAllowMobileDownload: function(allow, callback) {
            this._validate();
            this._object.allowMobileDownload = allow;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        isCompleted: function(callback) {
            this._validate();
            callback(this._object.isCompleted);
        },
        isCompletedChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.isCompletedChanged.connect(function() {
                    callback(self._object.isCompleted);
                });
            }
        },

        downloadInProgress: function(callback) {
            this._validate();
            callback(this._object.downloadInProgress);
        },
        downloadInProgressChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.downloadInProgressChanged.connect(function() {
                    callback(self._object.downloadInProgress);
                });
            }
        },

        progress: function(callback) {
            this._validate();
            callback(this._object.progress);
        },
        progressChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.progressChanged.connect(function() {
                    callback(self._object.progress);
                });
            }
        },

        downloading: function(callback) {
            this._validate();
            callback(this._object.downloading);
        },
        downloadingChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.downloadingChanged.connect(function() {
                    callback(self._object.downloading);
                });
            }
        },

        errorMessage: function(callback) {
            this._validate();
            callback(this._object.errorMessage);
        },
        errorChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.errorChanged.connect(function() {
                    callback(self._object.errorMessage);
                });
            }
        },

        finished: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                this._object.finished.connect(callback);
            }
        },

        canceled: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                this._object.canceled.connect(callback);
            }
        },

        paused: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                this._object.paused.connect(callback);
            }
        },

        // internal

        internal: {
            error: function(self) {
                return self._object.error;
            }
        }
    };

    function DownloadManager(downloadManager, objectid) {
        var id = objectid;
        if ( ! downloadManager) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'DownloadManager');
            id = result.id;
            downloadManager = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(downloadManager,
                    PLUGIN_URI, VERSION, 'DownloadManager');
        }

        this._id = id;
        this._object = downloadManager;
    };
    DownloadManager.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            backendDelegate.deleteId(this._id);
        },

        // object methods
        serialize: function() {
            return {
                type: 'object-proxy',
                apiid: 'DownloadApi',
                objecttype: 'DownloadManager',
                objectid: this._id,
            }
        },

        // methods
        download: function(url) {
            this._validate();
            this._object.download(url);
        },

        // properties
        autoStart: function(callback) {
            this._validate();
            callback(this._object.autoStart);
        },
        setAutoStart: function(shouldAutoStart, callback) {
            this._validate();
            this._object.autoStart = shouldAutoStart;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        cleanDownloads: function(callback) {
            this._validate();
            callback(this._object.cleanDownloads);
        },
        setCleanDownloads: function(clean, callback) {
            this._validate();
            this._object.cleanDownloads = clean;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        errorMessage: function(callback) {
            this._validate();
            callback(this._object.errorMessage);
        },
        errorChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.errorChanged.connect(function() {
                    callback(self._object.errorMessage);
                });
            }
        },

        downloads: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var downloadCount = this._object.downloads.length;
                var downloads = [];
                for (var i = 0; i < downloadCount; ++i) {
                    var download =
                        new SingleDownload(this._object.downloads[i]);
                    downloads.push(download.serialize());
                }
                callback(downloads);
            }
        },
        downloadsChanged: function(callback) {
            this._validate();
            if (callback && typeof(callback) === 'function') {
                var self = this;
                this._object.downloadsChanged.connect(function() {
                    self.downloads(callback);
                });
            }
        },
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "SingleDownload": SingleDownload,
            "DownloadManager": DownloadManager,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    }

    return {
        createDownloadManager: function(options, callback) {
            if (! callback || typeof callback !== 'function')
                return;

            var autoStart =
                    options && options.autoStart === undefined
                        ? false : options.autoStart;
            var cleanDownloads =
                    options && options.cleanDownloads === undefined
                        ? false : options.cleanDownloads;

            var manager = new DownloadManager();
            manager.setAutoStart(autoStart);
            manager.setCleanDownloads(cleanDownloads);

            callback(manager.serialize());
        },

        downloadFile: function(url, options, onCompleted, onProgress, onError) {
            var download = new SingleDownload();

            var allowMobileDownload =
                    options && options.allowMobileDownload === undefined ? false : options.allowMobileDownload;
            var throttle =
                    options && options.throttle ? options.throttle : undefined;

            if (allowMobileDownload === true)
                download.setAllowMobileDownload(allowMobileDownload);

            if (throttle !== undefined)
                download.setThrottle(throttle);

            if (onProgress && typeof onProgress === 'function') {
                download.progressChanged(onProgress);
            }

            if (onError && typeof onError === 'function') {
                download.errorChanged(onError);
            }

            if (onCompleted && typeof onCompleted === 'function') {
                download.finished(function(path) {
                    onCompleted({status: "Success", path: path, download: download.serialize()})
                });
                download.canceled(function(success) {
                    onCompleted({status: "Cancelled", download: download.serialize()})
                });
            }

            download.setAutoStart(true);
            download.download(url);
        },


        // Internal

        dispatchToObject: function(infos) {
            var args = infos.args;
            var callback = infos.callback;
            var method_name = infos.method_name;
            var objectid = infos.objectid;
            var class_name = infos.class_name;

            if (callback)
                args.push(callback);

            var o = backendDelegate.objectFromId(objectid);
            if (o == null) {
                console.debug('Cannot dispatch to unknown object: ' + objectid);
                return;
            }

            var Constructor = _constructorFromName(class_name);

            var instance = new Constructor(o, objectid);

            instance[method_name].apply(instance, args);
        }
    };
}
