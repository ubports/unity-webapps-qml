function createContentHubApi(backendBridge) {
    var PLUGIN_URI = 'ContentHub';

    function ContentTransfer(objectid) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentTransfer', objectid);
    };
    ContentTransfer.prototype = {
        // object methods
        serialize: function() {
            var self = this;
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentTransfer',
                objectid: self._proxy.id(),
            }
        },

        // properties
        selectionType: function(callback) {
            this._proxy.call('selectionType', [], callback);
        },
        setSelectionType: function(selectionType) {
            this._proxy.call('setSelectionType', [selectionType]);
        },

        items: function(callback) {
            this._proxy.call('items', [], callback);
        },

        // methods

        /**
         * Starts a transfer
         * 
         * @method start
         * @param callback {Function(ContentTransfer.State)} 
         */
        start: function(callback) {
            this._proxy.call('start', [callback]);
        },
        finalize: function() {
            this._proxy.call('finalize', []);
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

    function ContentPeer(objectid, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentPeer', objectid);

        this._appId = content && content.appId
             ? content.appId : null;
        this._name = content && content.name
             ? content.name : null;
    };
    ContentPeer.prototype = {
        // object methods
        serialize: function() {
            var self = this;
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentPeer',
                objectid: self._proxy.id(),
            }
        },

        // properties

        // immutable
        appId: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('appId', [], callback);
                return;
            }
            return this._appId;
        },
        // immutable
        name: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('name', [], callback);
                return;
            }
            return this._name;
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

    function ContentStore(objectid, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentStore', objectid);

        this._uri = content && content.uri
             ? content.uri : null;
    };
    ContentStore.prototype = {
        // object methods
        serialize: function() {
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentStore',
                objectid: this._proxy.id(),
            }
        },

        // properties

        //immutable
        uri: function() {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('uri', [], callback);
                return;
            }
            return this._uri;
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
            "ContentPeer": ContentPeer,
            "ContentStore": ContentStore,
            "ContentTransfer": ContentTransfer,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    };

    return {
        /**
         * ContentType is an enumeration of well known content types.
         *
         */
        ContentType: {
            Pictures: "Pictures",
            Documents: "Documents",
            Music: "Music"
        },

        /**
         * ContentTransfer.State is an enumeration of the states of a content transfer.
         *
         */
        ContentTransfer: {
            State: {
                // Transfer created, waiting to be initiated.
                Created: "Created",

                // Transfer has been initiated.
                Initiated: "Initiated",

                // Transfer is in progress.
                InProgress: "InProgress",

                // Transfer is charged with items and ready to be collected.
                Charged: "Charged",

                // Items in the transfer have been collected.
                Collected: "Collected",

                // Transfer has been aborted.
                Aborted: "Aborted",

                // Transfer has been finished and cleaned up.
                Finalized: "Finalized",
            }
        },

        /**
         * Creates a ContentPeer object for the given source type.
         *
         * @method defaultSourceForType
         * @param type {ContentType} Content type.
         * @param callback {Function ({ContentPeer})} Function called with the created ContentPeer.
         */
        defaultSourceForType: function(type, callback) {
            backendBridge.call('ContentHub.defaultSourceForType',
                               [type],
                               callback);
        },

        /**
         * Creates a ContentStore object for the given content type.
         *
         * @method defaultStoreForType
         * @param type {ContentType} Content type.
         * @param callback {Function ({ContentStore})} Function called with the created ContentStore.
         */
        defaultStoreForType: function(type, callback) {
            backendBridge.call('ContentHub.defaultStoreForType',
                               [type],
                               callback);
        },

        /**
         * Creates a ContentStore object for the given content type.
         *
         * @method importContent
         * @param type {ContentType} Content type.
         * @param callback {Function} function({ContentTransfer}) Function called with the created ContentTransfer.
         */
        importContent: function(type, callback) {
            backendBridge.call('ContentHub.importContent',
                               [type],
                               callback);
        },

        /**
         * Creates a ContentStore object for the given ContentPeer.
         *
         * @method importContent
         * @param type {ContentType} Content type.
         * @param peer {ContentPeer} Content peer.
         * @param callback {Function} function({ContentTransfer}) Function called with the created ContentTransfer.
         */
        importContentForPeer: function(type, peer, callback) {
            backendBridge.call('ContentHub.importContentForPeer',
                               [type, peer.serialize()],
                               callback);
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
