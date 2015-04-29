/**
 * ContentHub is the entry point to resource io transfer
   from/to remote applications (peers).

 * @module ContentHub
 */

function createContentHubApi(backendBridge) {
    var PLUGIN_URI = 'ContentHub';

/**
 * ContentTransfer is an object created by the ContentHub to
   and allows one to properly setup and manage a data
   transfer between two peers.

 * @class ContentTransfer
 * @constructor
 * @example

       var api = external.getUnityObject('1.0');
       var hub = api.ContentHub;

       var pictureContentType = hub.ContentType.Pictures;

       hub.defaultSourceForType(
          pictureContentType
          , function(peer) {
            hub.importContentForPeer(
              pictureContentType,
              peer,
              function(transfer) {
                [setup the transfer options and store]
                transfer.start(function(state) { [...] });
              });
           });
 */
    function ContentTransfer(objectid, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentTransfer', objectid);

        this._store = content && content.store
             ? content.store : null;
        this._state = content && content.state
             ? content.state : null;
        this._selectionType = content && content.selectionType
             ? content.selectionType : null;
        this._contentType = content && content.contentType
             ? content.contentType : null;
        this._direction = content && content.direction
             ? content.direction : null;
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
         * Retrieves the current store.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method store
         * @param callback (optional) {Function(String)}
         */
        store: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('store', [], callback);
                return;
            }
            return this._store;
        },
        /**
         * Sets the current store for the ContentTransfer.
         *
         * @method setStore
         * @param store {ContentStore}
         * @param callback (optional) {Function()} called when the store has been updated
         */
        setStore: function(store, callback) {
            this._proxy.call('setStore', [store.serialize(), callback]);
        },

        /**
         * Retrieves the current state.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method state
         * @param callback (optional) {Function(ContentTransfer.State)}
         */
        state: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('state', [], callback);
                return;
            }
            return this._state;
        },
        /**
         * Sets the state of the transfer.
         *
         * @method setState
         * @param state {ContentTransfer.State}
         * @param callback {Function()} called when the state has been updated
         */
        setState: function(state, callback) {
            this._proxy.call('setState', [state, callback]);
        },
        /**
         * Notifies the listener when the state of the transfer changes.
         *
         * @method onStateChanged
         * @param callback {Function(ContentTransfer.State)}
         */
        onStateChanged: function(callback) {
            this._proxy.call('onStateChanged', [callback]);
        },

        /**
         * Retrieves the current selection type.
         *
         * @method selectionType
         * @param callback {Function(ContentTransfer.SelectionType)}
         */
        selectionType: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('selectionType', [], callback);
                return;
            }
            return this._selectionType;
        },
        /**
         * Sets the selection type (single or multiple).
         *
         * @method setSelectionType
         * @param selectionType {ContentTransfer.SelectionType}
         * @param callback {Function()} called when the state has been updated
         */
        setSelectionType: function(selectionType, callback) {
            this._selectionType = selectionType;
            this._proxy.call('setSelectionType', [selectionType, callback]);
        },

        /**
         * Retrieves the current content type.
         *
         * @method contentType
         * @param callback {Function(ContentTransfer.ContentType)}
         */
        contentType: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('contentType', [], callback);
                return;
            }
            return this._contentType;
        },
        /**
         * Sets the content type.
         *
         * @method setContentType
         * @param contentType {ContentTransfer.ContentType}
         * @param callback {Function()} called when the state has been updated
         */
        setContentType: function(contentType, callback) {
            this._contentType = contentType;
            this._proxy.call('setContentType', [contentType, callback]);
        },

        /**
         * Retrieves the current transfer direction.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method direction
         * @param callback (optional) {Function(ContentTransfer.Direction)}
         */
        direction: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('direction', [], callback);
                return;
            }
            return this._direction;
        },
        /**
         * Sets the transfer direction (import or export).
         *
         * @method setDirection
         * @param direction {ContentTransfer.Direction}
         * @param callback {Function()} called when the state has been updated
         */
        setDirection: function(direction, callback) {
            this._direction = direction;
            this._proxy.call('setDirection', [direction, callback]);
        },

        /**
         * Retrieves the list of items associated with the ContentTransfer.
         *
         * @method items
         * @param callback {Function( {Object{name: , url: }} )}
         */
        items: function(callback) {
            this._proxy.call('items', [], callback);
        },
        /**
         * Sets the list of items for the associated ContentTransfer (used when exporting).
         *
         * @method setItems
         * @param items {Array of Object{name: String, url: String}}
         * @param callback {Function()} called when the state has been updated
         */
        setItems: function(items, callback) {
            this._proxy.call('setItems', [items, callback]);
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

/**
 * ContentPeer is an object returned by the ContentHub.
   It represents a remote peer that can be used in a request
   to import, export or share content.

 * @class ContentPeer
 * @module ContentHub
 * @constructor
 * @example

       var api = external.getUnityObject('1.0');
       var hub = api.ContentHub;

       var pictureContentType = hub.ContentType.Pictures;

       hub.defaultSourceForType(
          pictureContentType
          , function(peer) {
             [do something with the peer]
           });
 */
    function ContentPeer(objectid, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentPeer', objectid);

        this._appId = content && content.appId
             ? content.appId : null;
        this._name = content && content.name
             ? content.name : null;
        this._handler = content && content.handler
             ? content.handler : null;
        this._contentType = content && content.contentType
             ? content.contentType : null;
        this._selectionType = content && content.selectionType
             ? content.selectionType : null;
        this._isDefaultPeer = content && content.isDefaultPeer;
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

        /**
         * Retrieves the app Id of the associated peer.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method appId
         * @return {String} Application Id for this peer
         * @param callback (optional) {Function(String)}
         */
        appId: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('appId', [], callback);
                return;
            }
            return this._appId;
        },
        /**
         * Sets the app Id of the associated peer.
         *
         * @method setAppId
         * @param appId {String}
         * @param callback {Function()} called when the appId has been updated
         */
        setAppId: function(appId, callback) {
            this._proxy.call('setAppId', [appId, callback]);
        },

        /**
         * Retrieves the specific ContentHandler for this peer.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method handler
         * @return {String} ContentHandler for this peer
         * @param callback (optional) {Function(String)}
         */
        handler: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('handler', [], callback);
                return;
            }
            return this._handler;
        },
        /**
         * Sets specific ContentHandler for this peer.
         *
         * @method setHandler
         * @param handler {ContentHandler}
         * @param callback {Function()} called when the appId has been updated
         */
        setHandler: function(handler, callback) {
            this._proxy.call('setHandler', [handler, callback]);
        },

        /**
         * Retrieves the specific ContentType for this peer.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method contentType
         * @return {String} ContentType for this peer
         * @param callback (optional) {Function(String)}
         */
        contentType: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('contentType', [], callback);
                return;
            }
            return this._contentType;
        },
        /**
         * Sets specific ContentType for this peer.
         *
         * @method setContentType
         * @param contentType {ContentType}
         * @param callback {Function()} called when the content type has been updated
         */
        setContentType: function(contentType, callback) {
            this._proxy.call('setContentType', [contentType, callback]);
        },

        /**
         * Retrieves the specific SelectionType for this peer.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method selectionType
         * @return {String} ContentTransfer.SelectionType for this peer
         * @param callback (optional) {Function(String)}
         */
        selectionType: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('selectionType', [], callback);
                return;
            }
            return this._selectionType;
        },
        /**
         * Sets specific SelectionType for this peer.
         *
         * @method setSelectionType
         * @param selectionType {ContentTransfer.SelectionType}
         * @param callback {Function()} called when the content type has been updated
         */
        setSelectionType: function(selectionType, callback) {
            this._proxy.call('setSelectionType', [selectionType, callback]);
        },

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

        /**
         * Returns true if the peer is a default one, false otherwise.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method isDefaultPeer
         * @param callback (optional) {Function(Bool)}
         */
        isDefaultPeer: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('isDefaultPeer', [], callback);
                return;
            }
            return this._isDefaultPeer;
        },

        // methods

        /**
         * Request to exchange content with this ContentPeer.
         *
         * @method request
         * @param callback {Function(ContentTransfer)} Called with the resulting content transfer
         */
        request: function(callback) {
            this._proxy.call('request', [], callback);
        },

        /**
         * Request to import content from this ContentPeer and use a ContentStore for permanent storage.
         *
         * @method requestForStore
         * @param store {ContentStore} Store used as a permanent storage
         * @param callback {Function(ContentTransfer)} Called with the resulting content transfer
         */
        requestForStore: function(store, callback) {
            this._proxy.call('requestForStore', [store.serialize()], callback);
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
 * ContentStore is an object returned by the ContentHub.

   It represents a location where the resources imported or
   exported from a peer during a transfer operation are to be
   either saved or found.

 * @class ContentStore
 * @module ContentHub
 * @constructor
 * @example

       var api = external.getUnityObject('1.0');
       var hub = api.ContentHub;

       var pictureContentType = hub.ContentType.Pictures;

       hub.defaultStoreForType(pictureContentType, function(store) {
         [do something with the store]
         });
 */
    function ContentStore(objectid, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ContentStore', objectid);

        this._uri = content && content.uri
             ? content.uri : null;
        this._scope = content && content.scope
             ? content.scope : null;
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
         * @return {String} current uri
         * @param callback (optional) {Function(String)}
         */
        uri: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('uri', [], callback);
                return;
            }
            return this._uri;
        },

        /**
         * Retrieves the current scope.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method scope
         * @return {ContentScope} current scope
         * @param callback (optional) {Function(ContentScope)}
         */
        scope: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('scope', [], callback);
                return;
            }
            return this._scope;
        },
        /**
         * Sets the current scope.
         *
         * @method setScope
         * @param scope {ContentScope}
         * @param callback {Function()} called when the scope has been updated
         */
        setScope: function(scope, callback) {
            this._proxy.call('setScope', [scope, callback]);
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

/**
 * The ContentHub object.

 * @class ContentHub
 * @static
 * @constructor
 */
    return {
        /**
         ContentType is an enumeration of well known content types.
         
           Values:

             Pictures

             Documents
             
             Music

             Contacts

             Videos

             Links

             Text

         @static
         @property ContentType {String}
         
         @example

          var api = external.getUnityObject('1.0');
          var hub = api.ContentHub;
         
          var pictureContentType = hub.ContentType.Pictures;
         */
        ContentType: {
            All: "All",
            Unknown: "Unknown",
            Pictures: "Pictures",
            Documents: "Documents",
            Music: "Music",
            Contacts: "Contacts",
            Videos: "Videos",
            Links: "Links",
            Text: "Text",
        },

        /**
          ContentHandler is an enumeration of well known content handlers.

           Values:

             Source

             Destination

             Share

           @static
           @property ContentHandler {String}
         */
        ContentHandler: {
            Source: "Source",
            Destination: "Destination",
            Share: "Share",
        },

        /**
          ContentScope is an enumeration of well known scope types.

           Values:

             System

             User

             App

           @static
           @property ContentScope {String}
         */
        ContentScope: {
            System: "System",
            User: "User",
            App: "App",
        },

        ContentTransfer: {

        /**
         ContentTransfer.State is an enumeration of the state of a given ongoing ContentTransfer.
         
           Values:

            Created: Transfer created, waiting to be initiated.

            Initiated: Transfer has been initiated.

            InProgress: Transfer is in progress.

            Charged: Transfer is charged with items and ready to be collected.

            Collected: Items in the transfer have been collected.

            Aborted: Transfer has been aborted.

            Finalized: Transfer has been finished and cleaned up.

            Downloaded: Download specified by downloadId has completed.

            Downloading: Transfer is downloading item specified by downloadId.
          
         @static
         @property ContentTransfer.State {String}
         
         @example

          var api = external.getUnityObject('1.0');
          var hub = api.ContentHub;
         
          var transferState = hub.ContentTransfer.State;
          var pictureContentType = hub.ContentType.Pictures;

          hub.importContentForPeer(
            pictureContentType,
            peer,
            function(transfer) {
                hub.defaultStoreForType(pictureContentType, function(store) {
                    transfer.setStore(store, function() {
                        transfer.start(function(state) {
                            if (transferState.Aborted === state) {
                              [...]
                            }
                            [...]
                        });
                    });
                });
          });

         */
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

                // Transfer has finished downloading.
                Downloaded: "Downloaded",

                // Transfer is downloading.
                Downloading: "Downloading",
            },

        /**
         ContentTransfer.Direction is an enumeration of the directions of a given ContentTransfer.
         
           Values:

            Import

            Export

            Share

         @static
         @property ContentTransfer.Direction {String}
         */
            Direction: {
                // Transfer is a request to import content
                Import: "Import",

                // Transfer is a request to export content
                Export: "Export",

                // Transfer is a request to share content
                Share: "Share",
            },

        /**
         ContentTransfer.SelectionType is an enumeration of the directions of a given ContentTransfer.
         
           Values:

            Single: Transfer should contain a single item

            Multiple: Transfer can contain multiple items

         @static
         @property ContentTransfer.SelectionType {String}
         */
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
         * @method getPeers
         * @param filters {Object} A dictionary of parameters to filter the result. The filtering keys are:
         * - contentType: desired ContentType
         * - handler: desired ContentHandler
         *
         * @param callback {Function(List of ContentPeer objects)} Callback that receives the result or null
         */
        getPeers: function(filter, callback) {
            backendBridge.call('ContentHub.getPeers',
                               [filter],
                               callback);
        },

        /**
         * Creates a ContentStore object for the given scope type.
         *
         * @method getStore
         * @param scope {ContentScope} The content scope for the store
         * @param callback {Function(ContentStore)} Callback that receives the result or null
         */
        getStore: function(scope, callback) {
            backendBridge.call('ContentHub.getStore',
                               [scope],
                               callback);
        },

        /**
         * Launches the content peer picker ui that allows the user to select a peer.
         *
         * @method launchContentPeerPicker
         * @param filters {Object} A dictionary of parameters to filter the result. The filtering keys are:
         * - contentType: desired ContentType
         * - handler: desired ContentHandler
         * - showTitle: boolean value indicating if the title should be visible
         * @param onPeerSelected {Function(ContentPeer)} Called when the user has selected a peer
         * @param onCancelPressed {Function()} Called when the user has pressed cancel
         */
        launchContentPeerPicker: function(filters, onPeerSelected, onCancelPressed) {
            backendBridge.call('ContentHub.launchContentPeerPicker',
                               [filters, onPeerSelected, onCancelPressed]);
        },

        /**
         * Sets a handler that is to be called when the current application is the
         * target of an export request.
         *
         * @method onExportRequested
         * @param callback {Function(ContentTransfer)} Function when one requests a resource to be exported.
         *                                                          The corresponding ContentTransfer is provided as a parameter.
         * 
         * @example
         
            var api = external.getUnityObject(1.0);
            var hub = api.ContentHub;
         
            var transferState = hub.ContentTransfer.State;
            
            function _exportRequested(transfer) {
              var url = window.location.href;
              url = url.substr(0, url.lastIndexOf('/')+1) + 'img/ubuntuone-music.png';
            
              transfer.setItems([{name: 'Ubuntu One', url: url}],
                function() {
                  transfer.setState(hub.ContentTransfer.State.Charged);
                });
              };
            
            hub.onExportRequested(_exportRequested);
         
         */
        onExportRequested: function(callback) {
            backendBridge.call('ContentHub.onExportRequested',
                               [callback]);
        },

        /**
         * Sets a handler that is to be called when the current application is the
         * target of an share request.
         *
         * @method onShareRequested
         * @param callback {Function(ContentTransfer)} Function when one requests a resource to be shared.
         *                                                          The corresponding ContentTransfer is provided as a parameter.
         *
         * @example

            var api = external.getUnityObject(1.0);
            var hub = api.ContentHub;

            var transferState = hub.ContentTransfer.State;

            function _shareRequested(transfer) {
            };

            hub.onShareRequested(_shareRequested);

         */
        onShareRequested: function(callback) {
            backendBridge.call('ContentHub.onShareRequested',
                               [callback]);
        },

        /**
         * Sets a handler that is to be called when the current application is the
         * target of an import request.
         *
         * @method onImportRequested
         * @param callback {Function(ContentTransfer)} Function when one requests a resource to be imported.
         *                                                          The corresponding ContentTransfer is provided as a parameter.
         *
         * @example

            var api = external.getUnityObject(1.0);
            var hub = api.ContentHub;

            var transferState = hub.ContentTransfer.State;

            function _importRequested(transfer) {
            };

            hub.onImportRequested(_importRequested);

         */
        onImportRequested: function(callback) {
            backendBridge.call('ContentHub.onImportRequested',
                               [callback]);
        },

        api: {

            /**
             * Creates a ContentStore object for the given ContentPeer.
             *
             * @method api.importContent
             * @param type {ContentType} type of the content to import
             * @param peer {ContentPeer} peer who's content should be imported
             * @param transferOptions {Object} a dictionary of transfer options. The options are the following:
             * - multipleFiles {Bool}: specified if a transfer should involve multiple files or not
             * - scope {ContentScope}: specifies the location where the transferred files should be copied to
             * @param onError {Function(reason:)} called when the transfer has failed
             * @param onSuccess {Function(Array of {ContentItem})} called when the transfer has been a success and items are available
             */
            importContent: function(type, peer, transferOptions, onSuccess, onError) {
                backendBridge.call('ContentHub.apiImportContent',
                                  [type, peer.serialize(), transferOptions, onSuccess, onError]);
            }
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
