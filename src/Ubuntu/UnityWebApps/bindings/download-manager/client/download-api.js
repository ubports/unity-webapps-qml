/**
 * DownloadApi gives access to Download management.

 * @module DownloadApi
 */
function createDownloadApi(backendBridge) {
    var PLUGIN_URI = 'DownloadApi';

/**
 * SingleDownload provides facilities for downloading a single
 *   file, track the process, react to error conditions, etc.
 *
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
         * decide when to start them calling the "start()" method on each download.
         *
         * @method autoStart
         * @param callback {Function(Error)}
         */
        autoStart: function(callback) {
            this._proxy.call('autoStart', [], callback);
        },
        /**
         * This property sets if the downloads should start automatically, or let the user
         * decide when to start them calling the "start()" method on each download.
         *
         * @method setAutoStart
         * @param shouldAutoStart {Bool}
         * @param callback (optional) {Function()} To be called after the value is set.
         */
        setAutoStart: function(shouldAutoStart, callback) {
            this._proxy.call('setAutoStart', [shouldAutoStart], callback);
        },

        /**
         * Retrieves the current error message (if any)
         *
         * @method errorMessage
         * @param callback {Function(String)} Called with the current error message.
         */
        errorMessage: function(callback) {
            this._proxy.call('errorMessage', [], callback);
        },
        /**
         * Sets up a callback that is to be called when error message changes.
         *
         * @method errorChanged
         * @param callback {Function(String)} Called with the current error message.
         */
        errorChanged: function(callback) {
            this._proxy.call('errorChanged', [callback]);
        },

        /**
         * Retrieves the property that determines if the download handled by this object
         * will work under mobile data connection.
         *
         * @method allowMobileDownload
         * @param callback {Function(Bool)} Called with the current value.
         */
        allowMobileDownload: function(callback) {
            this._proxy.call('allowMobileDownload', [], callback);
        },
        /**
         * Sets the property that determines if the download handled by this object
         * will work under mobile data connection.
         *
         * @method setAllowMobileDownload
         * @param allow {Bool}
         * @param callback (optional) {Function()} Called after the value has been set.
         */
        setAllowMobileDownload: function(allow, callback) {
            this._proxy.call('setAllowMobileDownload', [allow], callback);
        },

        /**
         * Retrieves the current state of the download. True if the download already finished, False otherwise.
         *
         * @method isCompleted
         * @param callback {Function(Bool)} Called with the current value.
         */
        isCompleted: function(callback) {
            this._proxy.call('isCompleted', [], callback);
        },
        /**
         * Sets up a callback that is to be called when the download completion status changes.
         *
         * @method isCompletedChanged
         * @param callback {Function(Bool)} Function to be called when the download completion status changes. Called with a boolean corresponding to the current value.
         */
        isCompletedChanged: function(callback) {
            this._proxy.call('isCompletedChanged', [callback]);
        },

        /**
         * Retrieves the property that indicates if the download is active whatever its internal status is (paused etc.).
         * If a download is active, the value will be True. It will become False when the download
         * finished or get canceled.
         *
         * @method downloadInProgress
         * @param callback {Function(Bool)} Called with the current value.
         */
        downloadInProgress: function(callback) {
            this._proxy.call('downloadInProgress', [], callback);
        },
        /**
         * Sets up a callback that is to be called when the download progress status changes.
         *
         * @method downloadInProgressChanged
         * @param callback {Function(Bool)} Function to be called when the downloading progress status changes. Called with a boolean corresponding to the current value.
         */
        downloadInProgressChanged: function(callback) {
            this._proxy.call('downloadInProgressChanged', [callback]);
        },

        /**
         * Retrieves the property that reports the current progress in percentage of the download, from 0 to 100.
         *
         * @method progress
         * @param callback {Function(Int)} Called with the current value.
         */
        progress: function(callback) {
            this._proxy.call('progress', [], callback);
        },
        /**
         * Sets up a callback that is to be called when the progress value changes.
         *
         * @method progressChanged
         * @param callback {Function(Int)} Function to be called when the progress value changes. Called with the current value.
         */
        progressChanged: function(callback) {
            this._proxy.call('progressChanged', [callback]);
        },

        /**
         * Retrieves the property that represents the current state of the download.
         * False if paused or not downloading anything.
         * True if the file is currently being downloaded.
         *
         * @method downloading
         * @param callback {Function(Bool)} Called with the current value.
         */
        downloading: function(callback) {
            this._proxy.call('downloading', [], callback);
        },
        /**
         * Sets up a callback that is to be called when the downloading status changes.
         *
         * @method progressChanged
         * @param callback {Function(Bool)} Function to be called when the downloading status changes. Called with the current value.
         */
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

        /**
         * Starts a download.
         *
         * @method start
         */
        start: function() {
            this._proxy.call('start', []);
        },

        /**
         * Pauses a download.
         *
         * @method pause
         */
        pause: function() {
            this._proxy.call('pause', []);
        },

        /**
         * Resumes a download.
         *
         * @method resume
         */
        resume: function() {
            this._proxy.call('resume', []);
        },

        /**
         * Cancels a download.
         *
         * @method cancel
         */
        cancel: function() {
            this._proxy.call('cancel', []);
        },

        /**
         * Downloads a given item by url.
         *
         * @method download
         * @param url {String} Url of the file to download.
         */
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


    /**
     * DownloadManager provides facilities for downloading a several
     * files, list the current downloads in progress or finished,
     * and dynamically update the content of those to show the current
     * downloads.
.    *
     * @class DownloadManager
     * @constructor
     * @example
     *
     */
    function DownloadManager(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'DownloadManager', id);
    };
    DownloadManager.prototype = {

        /**
         * This property sets if the downloads should start automatically, or let the user
         * decide when to start them calling the "start()" method on each download object.
         *
         * @method autoStart
         * @param callback {Function(Error)}
         */
        autoStart: function(callback) {
            this._proxy.call('autoStart', [], callback);
        },
        /**
         * This property sets if the downloads should start automatically, or let the user
         * decide when to start them calling the "start()" method on each download object.
         *
         * @method setAutoStart
         * @param shouldAutoStart {Bool}
         * @param callback (optional) {Function()} To be called after the value is set.
         */
        setAutoStart: function(shouldAutoStart, callback) {
            this._proxy.call('setAutoStart', [shouldAutoStart], callback);
        },

        /**
         * Retrieves the clean download flag value.
         *
         * @method cleanDownloads
         * @param callback {Function(Bool)} Called with the current value of the clean download flag
         */
        cleanDownloads: function(callback) {
            this._proxy.call('cleanDownloads', [], callback);
        },
        /**
         * Sets the value of the clean download flag. This informs the download manager that
         * the list of SingleDownload listed by the 'downloads' property should only contain
         * the downloads in progress. Those that finishes are being removed from the list.
         *
         * @method setCleanDownloads
         * @param clean {Bool}
         * @param callback (optional) {Function()} To be called after the value is set.
         */
        setCleanDownloads: function(clean, callback) {
            this._proxy.call('setCleanDownloads', [clean], callback);
        },

        /**
         * Retrieves the current error message (if any)
         *
         * @method errorMessage
         * @param callback {Function(String)} Called with the current error message.
         */
        errorMessage: function(callback) {
            this._proxy.call('errorMessage', [], callback);
        },
        /**
         * Sets up a callback that is to be called when error message changes.
         *
         * @method errorChanged
         * @param callback {Function(String)} Called with the current error message.
         */
        errorChanged: function(callback) {
            this._proxy.call('errorChanged', [callback]);
        },

        /**
         * Retrieves the current set of download being proceeded.
         *
         * @method downloads
         * @param callback {Function(List of SingleDownload)} Called with the current set of download objects.
         */
        downloads: function(callback) {
            this._proxy.call('downloads', [], callback);
        },
        /**
         * Sets up a callback that is to be called when the set of urls being downloaded
         * changes (items being added or removed).
         *
         * @method downloadsChanged
         * @param callback {Function(List of SingleDownload)} Called with the current set of download objects.
         */
        downloadsChanged: function(callback) {
            this._proxy.call('downloadsChanged', [callback]);
        },

        /**
         * Starts a download operation for the given url.
         *
         * @method download
         * @param url {String}
         */
        download: function(url) {
            this._proxy.call('download', [url]);
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
         * Creates a download manager object.
         *
         * @method createDownloadManager
         * @param options {Object} A dictionary of download options. The option keys are:
         *  - autoStart: This property sets if the downloads should start automatically, or let the user
         *          decide when to start them calling the "start()" method on each download.
         *  - cleanDownloads: This informs the download manager that the list of SingleDownload listed by
         *          the 'downloads' property should only contain the downloads in progress. Those that
         *          finishes are being removed from the list
         * @param callback {Function(DownloadManager)} Function called with the DownloadManager object created.
         */
        createDownloadManager: function(options, callback) {
            backendBridge.call('DownloadApi.createDownloadManager'
                               , [options]
                               , callback);
        },

        /**
         * Download a file.
         *
         * @method downloadFile
         * @param url {String} Function called with the created Alarm.
         * @param options {Object} A dictionary of download options. The option keys are:
         *  - allowMobileDownload:
         *  - throttle:
         * @param onCompleted {Function(Object)} Function called when the download completes. The function is called with an dictionary with the following keys:
         *  - status: status of the download ("Success" or "Cancelled")
         *  - path: path of the downloaded resource
         *  - download: SingleDownload object that performed the download (so that it can be inspected & destroyed)
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


