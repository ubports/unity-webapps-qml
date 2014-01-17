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
    };

    function ContentPeer(objectid) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentPeer', objectid);
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
        appId: function(callback) {
            this._proxy.call('appId', [], callback);
        },
        name: function(callback) {
            this._proxy.call('name', [], callback);
        },
    };

    function ContentStore(objectid) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentStore', objectid);
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
        uri: function() {
            this._proxy.call('uri', [], callback);
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
        ContentType: {
            Pictures: "Pictures",
            Documents: "Documents",
            Music: "Music"
        },

        ContentTransfer: {
            State: {
                Created: "Created",
                Initiated: "Initiated",
                InProgress: "InProgress",
                Charged: "Charged",
                Collected: "Collected",
                Aborted: "Aborted",
                Finalized: "Finalized"
            }
        },

        /**
         * 
         * @method defaultSourceForType
         * 
         * @param type {ContentType}
         * @param callback {Function(ContentPeer)}
         */
        defaultSourceForType: function(type, callback) {
            backendBridge.call('ContentHub.defaultSourceForType',
                               [type],
                               callback);
        },

        /**
         * 
         * @method defaultStoreForType
         * 
         * @param type {ContentType}
         * @param callback {Function(ContentStore)} 
         */
        defaultStoreForType: function(type, callback) {
            backendBridge.call('ContentHub.defaultStoreForType',
                               [type],
                               callback);
        },

        /**
         * 
         * @method importContent
         * 
         * @param type {ContentType}
         * @param callback {Function} function({ContentTransfer})
         */
        importContent: function(type, callback) {
            backendBridge.call('ContentHub.importContent',
                               [type],
                               callback);
        },

        /**
         * 
         * @method importContentForPeer
         * 
         * @param type {ContentType}
         * @param type {ContentPeer}
         * @param callback {Function} function({ContentTransfer})
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
        createObjectWrapper: function(objectType, objectId) {
            var Constructor = _constructorFromName(objectType);
            return new Constructor(objectId);
        },
    };
};
