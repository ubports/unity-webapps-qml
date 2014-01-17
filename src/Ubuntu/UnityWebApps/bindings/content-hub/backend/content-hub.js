/**
 *
 * ContentHub API backend binding
 *
 */

function createContentHubApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.Content';
    var VERSION = 0.1;

    var _contenthub = ContentHubBridge.ContentHub;

    function _nameToContentType(name) {
        var contentTypePerName = {
            "Pictures": ContentHubBridge.ContentType.Pictures,
            "Documents": ContentHubBridge.ContentType.Pictures,
            "Music": ContentHubBridge.ContentType.Pictures,
        };
        return name in contentTypePerName ?
                    contentTypePerName[name]
                  : ContentHubBridge.ContentType.Unknown;
    };

    function _contentTransferStateToName(state) {
        if (state === ContentHubBridge.ContentTransfer.Created)
            return "Created";
        else if (state === ContentHubBridge.ContentTransfer.Initiated)
            return "Initiated";
        else if (state === ContentHubBridge.ContentTransfer.InProgress)
            return "InProgress";
        else if (state === ContentHubBridge.ContentTransfer.Charged)
            return "Charged";
        else if (state === ContentHubBridge.ContentTransfer.Collected)
            return "Collected";
        else if (state === ContentHubBridge.ContentTransfer.Aborted)
            return "Aborted";
        else if (state === ContentHubBridge.ContentTransfer.Finalized)
            return "Finalized";
        return "Created";
    };

    function ContentTransfer(transfer, objectid) {
        var id = objectid;
        if ( ! transfer) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'ContentTransfer');
            id = result.id;
            transfer = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(transfer,
                    PLUGIN_URI, VERSION, 'ContentTransfer');
        }
        this._id = id;
        this._object = transfer;
        this._callback = null;
    };
    ContentTransfer.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        // object methods
        serialize: function() {
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentTransfer',
                objectid: this._id,
            }
        },

        // properties
        selectionType: function(callback) {
            this._validate();
            callback(this._object.selectionType)
        },
        setSelectionType: function(selectionType) {
            this._validate();
            this._object.selectionType = selectionType;
        },

        items: function(callback) {
            this._validate();

            // return in serialized form
            var items = [];
            for (var i = 0; i < this._object.items.length; ++i) {
                items.push({name: this._object.items[i].name, url: this._object.items[i].url});
            }
            callback(items)
        },

        // methods
        start: function(callback) {
            this._validate();

            var self = this;
            this._callback = function () {
                callback(_contentTransferStateToName(self._object.state));
            };
            this._object.stateChanged.connect(this._callback);

            this._object.start();
        },
        finalize: function() {
            this._validate();
            if (this._callback)
                this._object.stateChanged.disconnect(this._callback);
            this._callback = null;
            this._object.finalize();
        },
    };

    function ContentStore(store, objectid) {
        var id = objectid;
        if ( ! store) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'ContentStore');
            id = result.id;
            store = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(store,
                    PLUGIN_URI, VERSION, 'ContentStore');
        }
        this._id = id;
        this._object = store;
    };
    ContentStore.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        // object methods
        serialize: function() {
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentStore',
                objectid: this._id,
            }
        },

        // properties
        uri: function(callback) {
            this._validate();
            callback(this._object.uri);
        },
    };

    function ContentPeer(peer, objectid) {
        var id = objectid;
        if ( ! peer) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'ContentPeer');
            id = result.id;
            peer = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(peer,
                    PLUGIN_URI, VERSION, 'ContentPeer');
        }
        this._id = id;
        this._object = peer;
    };
    ContentPeer.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        // object methods
        serialize: function() {
            var self = this;
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentPeer',
                objectid: self._id,
                content: {
                    appId: self._object.appId,
                    name: self._object.name,
                },
            }
        },

        // properties
        appId: function(callback) {
            this._validate();
            callback(this._object.appId);
        },
        name: function(callback) {
            this._validate();
            callback(this._object.name);
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
    }

    return {
        defaultSourceForType: function(type, callback) {
            var source = new ContentPeer(_contenthub.defaultSourceForType(_nameToContentType(type)));
            console.log('callback ' + callback);
            callback(source.serialize());
        },

        defaultStoreForType: function(type, callback) {
            var store = new ContentStore(_contenthub.defaultStoreForType(_nameToContentType(type)));
            callback(store.serialize());
        },

        importContent: function(type, callback) {
            var transfer = new ContentTransfer(_contenthub.importContent(_nameToContentType(type)));
            callback(transfer.serialize());
        },

        importContentForPeer: function(type, peerProxy, callback) {
            if (! backendDelegate.isObjectProxyInfo(peerProxy)) {
                console.debug('importContentForPeer: invalid peer object proxy')
                return;
            }
            var peer = backendDelegate.objectFromId(peerProxy.objectid);
            var transfer = new ContentTransfer(_contenthub.importContent(_nameToContentType(type), peer));

            callback(transfer.serialize());
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
            var Constructor = _constructorFromName(class_name);

            var instance = new Constructor(o, objectid);

            instance[method_name].apply(instance, args);
        }
    };
};


