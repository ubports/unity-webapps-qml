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

        /**
         * Retrieves the current selection type.
         *
         * @method selectionType
         * @param callback {Function(ContentTransfer.SelectionType)}
         */
        selectionType: function(callback) {
            this._proxy.call('selectionType', [], callback);
        },
        /**
         * Sets the selection type (single or multiple).
         *
         * @method setSelectionType
         * @param selectionType {ContentTransfer.SelectionType}
         */
        setSelectionType: function(selectionType) {
            this._proxy.call('setSelectionType', [selectionType]);
        },

        /**
         * Retrieves the current transfer direction.
         *
         * @method direction
         * @param callback {Function(ContentTransfer.Direction)}
         */
        direction: function(callback) {
            this._proxy.call('direction', [], callback);
        },
        /**
         * Sets the transfer direction (import or export).
         *
         * @method setDirection
         * @param direction {ContentTransfer.Direction}
         */
        setDirection: function(direction) {
            this._proxy.call('setDirection', [direction]);
        },

        /**
         * Retrieves the list of items included in the ContentTransfer.
         *
         * @method items
         * @param callback {Function( {Object{name: , url: }} )}
         */
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

        /**
         * Sets State to ContentTransfer.Finalized and cleans up temporary files.
         *
         * @method finalize
         */
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

        /**
         * Retrieves the app Id of the associated peer.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method appId
         * @param callback (optional) {Function(String)}
         */
        appId: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('appId', [], callback);
                return;
            }
            return this._appId;
        },

        // immutable

        /**
         * Retrieves the name of the associated peer.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method name
         * @param callback (optional) {Function(String)}
         */
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

        /**
         * Retrieves the uri of the associated store.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method uri
         * @param callback (optional) {Function(String)}
         */
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
            },

            Direction: {
                // Transfer is a request to import content
                Import: "Import",

                // Transfer is a request to export content
                Export: "Export",
            },

            SelectionType: {
                // Transfer should contain a single item
                Single: "Single",

                // Transfer can contain multiple items
                Multiple: "Multiple",
            },
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
