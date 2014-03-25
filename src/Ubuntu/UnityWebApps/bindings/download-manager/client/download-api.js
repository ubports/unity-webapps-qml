/**
 * DownloadApi gives access to Download management.

 * @module DownloadApi
 */
function createDownloadApi(backendBridge) {
    var PLUGIN_URI = 'DownloadApi';

/**
 * SingleDownload provides facilities for downloading a single
    file, track the process, react to error conditions, etc.

 * @class SingleDownload
 * @constructor
 * @example

 */
    function SingleDownload(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'SingleDownload', id);
    };
    SingleDownload.prototype = {

        /**
         * This property retrieves if the downloads should start automatically, or let the user
    decide when to start them calling the "start()" method on each download.
         *
         * @method autoStart
         * @param callback {Function(Error)}
         */
        autoStart: function(callback) {
            this._proxy.call('autoStart', [], callback);
        },
        /**
         * This property sets if the downloads should start automatically, or let the user
    decide when to start them calling the "start()" method on each download
         *
         * @method setAutoStart
         * @param shouldAutoStart {Bool}
         * @param callback (optional) {Function()} To be called after the value is set.
         */
        setAutoStart: function(shouldAutoStart, callback) {
            this._proxy.call('setAutoStart', [shouldAutoStart], callback);
        },

        errorMessage: function(callback) {
            this._proxy.call('errorMessage', [], callback);
        },
        errorChanged: function(callback) {
            this._proxy.call('errorChanged', [callback]);
        },

        allowMobileDownload: function(callback) {
            this._proxy.call('allowMobileDownload', [], callback);
        },
        setAllowMobileDownload: function(allow, callback) {
            this._proxy.call('setAllowMobileDownload', [allow], callback);
        },

        isCompleted: function(callback) {
            this._proxy.call('isCompleted', [], callback);
        },
        isCompletedChanged: function(callback) {
            this._proxy.call('isCompletedChanged', [callback]);
        },

        downloadInProgress: function(callback) {
            this._proxy.call('downloadInProgress', [], callback);
        },
        downloadInProgressChanged: function(callback) {
            this._proxy.call('downloadInProgressChanged', [callback]);
        },

        progress: function(callback) {
            this._proxy.call('progress', [], callback);
        },
        progressChanged: function(callback) {
            this._proxy.call('progressChanged', [callback]);
        },

        downloading: function(callback) {
            this._proxy.call('downloading', [], callback);
        },
        downloadingChanged: function(callback) {
            this._proxy.call('downloadingChanged', [callback]);
        },

        /**
         * Sets up a callback that is to be called when the download is finished.
         *
         * @method finished
         * @param callback {Function(String)} Function to be called when the download is finished. Called with a the path of the downloaded file.
         */
        finished: function(callback) {
            this._proxy.call('finished', [callback]);
        },

        /**
         * Sets up a callback that is to be called when the download is canceled.
         *
         * @method canceled
         * @param callback {Function(Bool)} Function to be called when the download is canceled. Called with a boolean indicating if the operation was successful.
         */
        canceled: function(callback) {
            this._proxy.call('canceled', [callback]);
        },

        /**
         * Sets up a callback that is to be called when the download is paused.
         *
         * @method paused
         * @param callback {Function(Bool)} Function to be called when the download is paused. Called with a boolean indicating if the operation was successful.
         */
        paused: function(callback) {
            this._proxy.call('paused', [callback]);
        },

        start: function() {
            this._proxy.call('start', []);
        },

        pause: function() {
            this._proxy.call('pause', []);
        },

        resume: function() {
            this._proxy.call('resume', []);
        },

        cancel: function() {
            this._proxy.call('cancel', []);
        },

        download: function() {
            this._proxy.call('download', []);
        },

        // extras

        /**
         * Destroys the remote object. This proxy object is not valid anymore.
         *
         * @method destroy
         */
        destroy: function() {
            this._proxy.call('destroy', []);
        },
    };


    /**
     * DownloadManager provides facilities for downloading a several
    files, connect the downloads property to any Item that works
    with models, and dynamically update the content of those
    lists/repeaters/etc to show the current downloads and connect
    any UI to the SingleDownload properties in the delegates.
.

     * @class SingleDownload
     * @constructor
     * @example

     */
    function DownloadManager(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'DownloadManager', id);
    };
    DownloadManager.prototype = {

        /**
         * This property sets if the downloads should start automatically, or let the user
    decide when to start them calling the "start()" method on each download
         *
         * @method autoStart
         * @param callback {Function(Error)}
         */
        autoStart: function(callback) {
            this._proxy.call('autoStart', [], callback);
        },
        /**
         * This property sets if the downloads should start automatically, or let the user
    decide when to start them calling the "start()" method on each download
         *
         * @method setAutoStart
         * @param shouldAutoStart {Bool}
         * @param callback (optional) {Function()} To be called after the value is set.
         */
        setAutoStart: function(shouldAutoStart, callback) {
            this._proxy.call('setAutoStart', [shouldAutoStart], callback);
        },

        cleanDownloads: function(callback) {
            this._proxy.call('allowMobileDownload', [], callback);
        },
        setCleanDownloads: function(allow, callback) {
            this._proxy.call('setAllowMobileDownload', [allow], callback);
        },

        errorMessage: function(callback) {
            this._proxy.call('isCompleted', [], callback);
        },
        errorChanged: function(callback) {
            this._proxy.call('isCompletedChanged', [], callback);
        },

        downloads: function(callback) {
            this._proxy.call('downloadInProgress', [], callback);
        },
        downloadsChanged: function(callback) {
            this._proxy.call('downloadInProgressChanged', [], callback);
        },

        download: function(url) {
            this._proxy.call('download', []);
        },

        // extras

        /**
         * Destroys the remote object. This proxy object is not valid anymore.
         *
         * @method destroy
         */
        destroy: function() {
            this._proxy.call('destroy', []);
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
    };

/**
 * The DownloadApi object

 * @class DownloadApi
 * @constructor
 * @example

 */
    return {
        /**
         * Download a file.
         *
         * @method downloadFile
         * @param url {String} Function called with the created Alarm.
         * @param options {Object} A dictionary of download options. The option keys are:
         *  - allowMobileDownload:
         *  - throttle:
         * @param onCompleted {Function(Object)} Function called when the download completes. The function is called with an dictionary with the following keys:
         * @param onProgress {Function(Float)} (optional) Function called with current progress.
         * @param onError {Function(String)} (optional) Function called when an error occurs with the error message.
         *  - error:
         *  - downloads:
         */
        downloadFile: function(url, options, onCompleted, onProgress, onError) {
            if ( ! onCompleted || typeof onCompleted !== 'function')
                throw Error("Invalid (null) onCompleted callback");

            if ( ! url || typeof url !== 'string')
                throw Error("Invalid (null) url");

            backendBridge.call('DownloadApi.downloadFile'
                               , [url, options, onCompleted, onProgress, onError]);
        },

        // Internal

        /**
         * @private
         *
         */
        createObjectWrapper: function(objectType, objectId, content) {
            var Constructor = _constructorFromName(objectType);
            return new Constructor(objectId, content);
        },
    };
};


