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
         * @param callback (optional) {Function()}
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
         * @param callback {Function()} called when the state has been updated
         */
        setSelectionType: function(selectionType, callback) {
            this._proxy.call('setSelectionType', [selectionType, callback]);
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
         * @param callback {Function()} called when the state has been updated
         */
        setDirection: function(direction, callback) {
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
   to export or import date.

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
        uri: function(callback) {
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
          
         @static
         @property ContentType {String}
         
         @example

          var api = external.getUnityObject('1.0');
          var hub = api.ContentHub;
         
          var pictureContentType = hub.ContentType.Pictures;
         */
        ContentType: {
            Pictures: "Pictures",
            Documents: "Documents",
            Music: "Music"
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
            },

        /**
         ContentTransfer.Direction is an enumeration of the directions of a given ContentTransfer.
         
           Values:

            Import

            Export

         @static
         @property ContentTransfer.Direction {String}
         */
            Direction: {
                // Transfer is a request to import content
                Import: "Import",

                // Transfer is a request to export content
                Export: "Export",
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
         * @method defaultSourceForType
         * @param type {ContentType} Content type.
         * @param callback {Function (ContentPeer)} Function called with the created ContentPeer.
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
         * @param callback {Function (ContentStore)} Function called with the created ContentStore.
         */
        defaultStoreForType: function(type, callback) {
            backendBridge.call('ContentHub.defaultStoreForType',
                               [type],
                               callback);
        },

        /**
         * Returns all possible peers for the given ContentType.
         *
         * @method knownSourcesForType
         * @param type {ContentType} Content type.
         * @param callback {Function (Array of ContentPeer)} Function called with the possible ContentPeers.
         */
        knownSourcesForType: function(type, callback) {
            backendBridge.call('ContentHub.knownSourcesForType',
                               [type],
                               function(peers) {
                                    var wrappedPeers = [];

                                   // FIXME: do this above recursively in the (bridge.js)
                                    for (var i = 0; i < peers.length; ++i) {
                                        wrappedPeers.push(
                                                    new ContentPeer(
                                                        peers[i].objectid,
                                                        peers[i].content));
                                    }
                                    callback (wrappedPeers);
                               });
        },

        /**
         * Creates a ContentTransfer object for the given content type.
         *
         * @method importContent
         * @param type {ContentType} Content type.
         * @param callback {Function(ContentTransfer)} Function called with the created ContentTransfer.
         */
        importContent: function(type, callback) {
            backendBridge.call('ContentHub.importContent',
                               [type],
                               callback);
        },

        /**
         * Creates a ContentTransfer object for the given ContentPeer.
         *
         * @method importContentForPeer
         * @param type {ContentType} Content type.
         * @param peer {ContentPeer} Content peer.
         * @param callback {Function(ContentTransfer)} Function called with the created ContentTransfer.
         */
        importContentForPeer: function(type, peer, callback) {
            backendBridge.call('ContentHub.importContentForPeer',
                               [type, peer.serialize()],
                               callback);
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
