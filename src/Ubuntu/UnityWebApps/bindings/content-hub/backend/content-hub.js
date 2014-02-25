/*
 * Copyright 2014 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * unity-webapps-qml is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

.import Ubuntu.Content 0.1 as ContentHubBridge

/**
 *
 * ContentHub API backend binding
 *
 */

function createContentHubApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.Content';
    var VERSION = 0.1;

    var _contenthub = ContentHubBridge.ContentHub;

    // TODO find a better way
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

    function _nameToContentTransferSelection(name) {
        var contentTypePerName = {
            "Single": ContentHubBridge.ContentTransfer.Single,
            "Multiple": ContentHubBridge.ContentTransfer.Multiple,
        };
        return name in contentTypePerName ?
                    contentTypePerName[name]
                  : ContentHubBridge.ContentTransfer.Single;
    };
    function _contentTransferSelectionToName(state) {
        if (state === ContentHubBridge.ContentTransfer.Single)
            return "Single";
        else if (state === ContentHubBridge.ContentTransfer.Multiple)
            return "Multiple";
        return "Single";
    };

    function _nameToContentTransferDirection(name) {
        var contentTypePerName = {
            "Import": ContentHubBridge.ContentTransfer.Import,
            "Export": ContentHubBridge.ContentTransfer.Export,
        };
        return name in contentTypePerName ?
                    contentTypePerName[name]
                  : ContentHubBridge.ContentTransfer.Import;
    };
    function _contentTransferDirectionToName(state) {
        if (state === ContentHubBridge.ContentTransfer.Import)
            return "Import";
        else if (state === ContentHubBridge.ContentTransfer.Export)
            return "Export";
        return "Import";
    };

    function _nameToContentTransferState(name) {
        var contentTransferStatePerName = {
            "Created": ContentHubBridge.ContentTransfer.Created,
            "Initiated": ContentHubBridge.ContentTransfer.Initiated,
            "InProgress": ContentHubBridge.ContentTransfer.InProgress,
            "Charged": ContentHubBridge.ContentTransfer.Charged,
            "Collected": ContentHubBridge.ContentTransfer.Collected,
            "Aborted": ContentHubBridge.ContentTransfer.Aborted,
            "Finalized": ContentHubBridge.ContentTransfer.Finalized,
        };
        return name in contentTransferStatePerName ?
                    contentTransferStatePerName[name]
                  : ContentHubBridge.ContentTransfer.Created;
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
        return "<Unknown State>";
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

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            backendDelegate.deleteId(this._id);
        },

        // object methods
        serialize: function() {
            var self = this;
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentTransfer',
                objectid: self._id,

                // serialize immutable values

                content: {
                    store: self._object.store,
                    state: self._object.state,
                }
            }
        },

        // properties

        store: function(callback) {
            this._validate();
            callback(this._object.store);
        },
        setStore: function(storeProxy, callback) {
            this._validate();

            if (backendDelegate.isObjectProxyInfo(storeProxy)) {
                var store = backendDelegate.objectFromId(storeProxy.objectid);
                if (store)
                    this._object.setStore(store);
            }
            else {
                console.debug('setStore: invalid store object proxy');
            }
            if (callback)
                callback();
        },

        state: function(callback) {
            this._validate();
            callback(_contentTransferStateToName(this._object.state));
        },
        setState: function(state, callback) {
            this._validate();
            this._object.state = _nameToContentTransferState(state);
            if (callback && typeof(callback) === 'function')
                callback();
        },

        selectionType: function(callback) {
            this._validate();
            callback(_contentTransferSelectionToName(this._object.selectionType));
        },
        setSelectionType: function(selectionType, callback) {
            this._validate();
            this._object.selectionType = _nameToContentTransferSelection(selectionType);
            if (callback && typeof(callback) === 'function')
                callback();
        },

        direction: function(callback) {
            this._validate();
            callback(_contentTransferDirectionToName(this._object.direction));
        },
        setDirection: function(direction, callback) {
            this._validate();
            this._object.direction = _nameToContentTransferDirection(direction);
            if (callback && typeof(callback) === 'function')
                callback();
        },

        items: function(callback) {
            this._validate();

            // return in serialized form
            callback(this.internal.serializeItems(this._object));
        },
        setItems: function(items, callback) {
            this._validate();
            var contentItems = [];
            for (var i = 0; i < items.length; ++i) {
                var item = backendDelegate.createQmlObject(
                            PLUGIN_URI, VERSION, 'ContentItem');
                if ( ! item.object) {
                    console.debug('Could not create ContentItem object');
                    continue;
                }

                item.object.name = items[i].name;
                item.object.url = items[i].url;

                contentItems.push(item.object);
            }

            this._object.items = contentItems;

            if (callback && typeof(callback) === 'function')
                callback();
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


        // internal
        internal: {
            serializeItems: function(self) {
                var items = [];
                for (var i = 0; i < self.items.length; ++i) {
                    items.push({name: self.items[i].name.toString(),
                                   url: self.items[i].url.toString()});
                }
                return items;
            }
        }
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

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            backendDelegate.deleteId(this._id);
        },

        // object methods
        serialize: function() {
            var self = this;
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentStore',
                objectid: this._id,

                // serialize immutable values

                content: {
                    uri: self._object.uri,
                }
            }
        },

        // properties

        //immutable
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

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            backendDelegate.deleteId(this._id);
        },

        // object methods
        serialize: function() {
            var self = this;
            return {
                type: 'object-proxy',
                apiid: 'ContentHub',
                objecttype: 'ContentPeer',
                objectid: self._id,

                // serialize immutable values

                content: {
                    appId: self._object.appId,
                    name: self._object.name,
                },
            }
        },

        // properties

        // immutable
        appId: function(callback) {
            this._validate();
            callback(this._object.appId);
        },

        // immutable
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
            var _type = _nameToContentType(type);
            var peer = _contenthub.defaultSourceForType(_type)
            var source = new ContentPeer(peer);
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

        knownSourcesForType: function(type, callback) {
            var peers = _contenthub.knownSourcesForType(_nameToContentType(type));
            var wrappedPeers = [];

            for (var i = 0; i < peers.length; ++i) {
                var wrappedPeer = new ContentPeer(peers[i]);
                wrappedPeers.push(wrappedPeer.serialize());
            }

            callback(wrappedPeers);
        },

        apiImportContent: function(type, peer, transferOptions, onSuccess, onFailure) {
            if (! backendDelegate.isObjectProxyInfo(peer)) {
                console.debug('apiImportContent: invalid peer object proxy')
                onError("Invalid peer");
                return;
            }
            var _type = _nameToContentType(type);
            var _peer = backendDelegate.objectFromId(peer.objectid);
            if ( ! _peer) {
                onError("Invalid peer object (NULL)");
                return;
            }

            var transfer = _contenthub.importContent(_type, _peer);
            if (transferOptions.multipleFiles) {
                transfer.selectionType = ContentHubBridge.ContentTransfer.Multiple;
            }
            else {
                transfer.selectionType = ContentHubBridge.ContentTransfer.Single;
            }

            if (transferOptions.importToLocalStore) {
                var store = _contenthub.defaultStoreForType(_type);
                transfer.setStore(store);
            }

            var _transfer = new ContentTransfer(transfer)
            transfer.stateChanged.connect(function() {
                if (transfer.state === ContentHubBridge.ContentTransfer.Aborted) {
                    onFailure("Aborted");
                    return;
                }
                else if (transfer.state === ContentHubBridge.ContentTransfer.Charged) {
                    var d = _transfer.internal.serializeItems(transfer);
                    onSuccess(d);
                    transfer.finalize();
                    return;
                }
            });
            transfer.start();
        },

        importContentForPeer: function(type, peerProxy, callback) {
            if (! backendDelegate.isObjectProxyInfo(peerProxy)) {
                console.debug('importContentForPeer: invalid peer object proxy')
                callback();
                return;
            }
            var peer = backendDelegate.objectFromId(peerProxy.objectid);
            var transfer = new ContentTransfer(_contenthub.importContent(_nameToContentType(type), peer));

            callback(transfer.serialize());
        },

        onExportRequested: function(callback) {
            _contenthub.exportRequested.connect(function(exportTransfer) {
                var wrapped = new ContentTransfer(exportTransfer);
                callback(wrapped.serialize());
            });
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


