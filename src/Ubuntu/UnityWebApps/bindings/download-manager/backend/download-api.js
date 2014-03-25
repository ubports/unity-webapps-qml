/**
 *
 * Download API backend binding
 *
 */
function createDownloadApi(backendDelegate) {
    var PLUGIN_URI = 'UbuntuDownloadManager';
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
        download: function() {
            this._validate();
            this._object.download();
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
                this._object.isCompletedChanged.connect(function() {
                    callback(this._object.isCompleted);
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
                this._object.downloadInProgressChanged.connect(function() {
                    callback(this._object.downloadInProgress);
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
                this._object.progressChanged.connect(function() {
                    callback(this._object.progress);
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
                this._object.downloadingChanged.connect(function() {
                    callback(this._object.downloading);
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
                this._object.errorChanged.connect(function() {
                    callback(this._object.errorMessage);
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
        downloadFile: function(url, options, onCompleted, onProgress, onError) {
            var download = new SingleDownload();

            var allowMobileDownload =
                    options && options.allowMobileDownload === undefined ? true : options.allowMobileDownload;
            var throttle =
                    options && options.throttle;

            download.setAutoStart(true);
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
                download.finished.connect(function(path) {
                    onCompleted({status: "Success", path: path})
                });
                download.canceled.connect(function(success) {
                    onCompleted({status: "Cancelled"})
                });
            }

            download.setUrl(url);
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
