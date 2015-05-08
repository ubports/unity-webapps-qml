/*
 * Copyright 2014-2015 Canonical Ltd.
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

/**
 *
 * ContentHub API backend binding
 *
 */

function createContentHubApi(backendDelegate, parent) {

    var bridge = null
    try {
        bridge = Qt.createQmlObject(
            'import QtQuick 2.0; import Ubuntu.Content 0.1 as ContentHubBridge; \
            QtObject { property var hub: ContentHubBridge }', parent)
    }
    catch(e) { }

    if (!bridge) {
        console.log('Could not create ContentHub backend (does not appear to be installed)')
        return {};
    }

    var ContentHubBridge = bridge.hub;

    var PLUGIN_URI = 'Ubuntu.Content';
    var VERSION = 0.1;

    var _contenthub = ContentHubBridge.ContentHub;

    // TODO find a better way
    function _nameToContentType(name) {
        var contentTypePerName = {
            "All": ContentHubBridge.ContentType.All,
            "Unknown": ContentHubBridge.ContentType.Unknown,
            "Pictures": ContentHubBridge.ContentType.Pictures,
            "Documents": ContentHubBridge.ContentType.Documents,
            "Music": ContentHubBridge.ContentType.Music,
            "Contacts": ContentHubBridge.ContentType.Contacts,
            "Videos": ContentHubBridge.ContentType.Videos,
            "Links": ContentHubBridge.ContentType.Links,
            "Text": ContentHubBridge.ContentType.Text,
            "EBooks": ContentHubBridge.ContentType.EBooks,
        };
        return name in contentTypePerName ?
                    contentTypePerName[name]
                  : ContentHubBridge.ContentType.Unknown;
    };
    function _contentTypeToName(state) {
        if (state === ContentHubBridge.ContentType.All)
            return "All";
        else if (state === ContentHubBridge.ContentType.Unknown)
            return "Unknown";
        else if (state === ContentHubBridge.ContentType.Pictures)
            return "Pictures";
        else if (state === ContentHubBridge.ContentType.Documents)
            return "Documents";
        else if (state === ContentHubBridge.ContentType.Music)
            return "Music";
        else if (state === ContentHubBridge.ContentType.Contacts)
            return "Contacts";
        else if (state === ContentHubBridge.ContentType.Videos)
            return "Videos";
        else if (state === ContentHubBridge.ContentType.Links)
            return "Links";
        else if (state === ContentHubBridge.ContentType.Text)
            return "Text";
        else if (state === ContentHubBridge.ContentType.EBooks)
            return "EBooks";
        return "Unknown";
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

    function _nameToContentHandler(name) {
        var contentHandlerPerName = {
            "Source": ContentHubBridge.ContentHandler.Source,
            "Destination": ContentHubBridge.ContentHandler.Destination,
            "Share": ContentHubBridge.ContentHandler.Share,
        };
        return name in contentHandlerPerName ?
                    contentHandlerPerName[name]
                  : ContentHubBridge.ContentHandler.Source;
    };
    function _contentHandlerToName(state) {
        if (state === ContentHubBridge.ContentHandler.Source)
            return "Source";
        else if (state === ContentHubBridge.ContentHandler.Destination)
            return "Destination";
        else if (state === ContentHubBridge.ContentHandler.Share)
            return "Share";
        return "Source";
    };

    function _nameToContentTransferDirection(name) {
        var contentTypePerName = {
            "Import": ContentHubBridge.ContentTransfer.Import,
            "Export": ContentHubBridge.ContentTransfer.Export,
            "Share": ContentHubBridge.ContentTransfer.Share,
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
        else if (state === ContentHubBridge.ContentTransfer.Share)
            return "Share";
        return "Import";
    };

    function _nameToContentScope(name) {
        var contentScopePerName = {
            "System": ContentHubBridge.ContentScope.System,
            "User": ContentHubBridge.ContentScope.User,
            "App": ContentHubBridge.ContentScope.App,
        };
        return name in contentScopePerName ?
                    contentScopePerName[name]
                  : ContentHubBridge.ContentScope.App;
    };
    function _contentScopeToName(state) {
        if (state === ContentHubBridge.ContentScope.System)
            return "System";
        else if (state === ContentHubBridge.ContentScope.User)
            return "User";
        else if (state === ContentHubBridge.ContentScope.App)
            return "App";
        return "App";
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
            "Downloading": ContentHubBridge.ContentTransfer.Downloading,
            "Downloaded": ContentHubBridge.ContentTransfer.Downloaded,
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
        else if (state === ContentHubBridge.ContentTransfer.Downloading)
            return "Downloading";
        else if (state === ContentHubBridge.ContentTransfer.Downloaded)
            return "Downloaded";
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
                    selectionType: self._object.selectionType,
                    contentType: self._object.contentType,
                    direction: self._object.direction
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
        onStateChanged: function(callback) {
            if (!callback || typeof(callback) !== 'function')
                return;
            this._validate();
            var self = this;
            this._object.onStateChanged.connect(function() {
                callback(_contentTransferStateToName(self._object.state));
            });
        },

        contentType: function(callback) {
            this._validate();
            callback(_contentTypeToName(this._object.contentType));
        },
        setContentType: function(contentType, callback) {
            this._validate();
            this._object.contentType = _nameToContentType(contentType);
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
                if (items[i].text) {
		    item.object.text = items[i].text;
		}

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
                    items.push({
			name: self.items[i].name.toString(),
                        url: self.items[i].url.toString(),
                        text: self.items[i].text.toString()
		    });
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
                    scope: _contentScopeToName(self._object.scope),
                }
            }
        },

        // properties

        scope: function(callback) {
            this._validate();
            callback(_contentScopeToName(this._object.scope));
        },
        setScope: function(scope, callback) {
            this._validate();
            this._object.scope = _nameToContentScope(scope);
            if (callback && typeof(callback) === 'function')
                callback();
        },

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
                    handler: self._object.handler,
                    contentType: self._object.contentType,
                    selectionType: self._object.selectionType,
                    isDefaultPeer: self._object.isDefaultPeer,
                },
            }
        },

        // properties

        appId: function(callback) {
            this._validate();
            callback(this._object.appId);
        },
        setAppId: function(appId, callback) {
            this._validate();
            this._object.appId = appId;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        handler: function(callback) {
            this._validate();
            callback(_contentHandlerToName(this._object.handler));
        },
        setHandler: function(handler, callback) {
            this._validate();
            this._object.handler = _nameToContentHandler(handler);
            if (callback && typeof(callback) === 'function')
                callback();
        },

        contentType: function(callback) {
            this._validate();
            callback(_contentTypeToName(this._object.contentType));
        },
        setContentType: function(contentType, callback) {
            this._validate();
            this._object.contentType = _nameToContentType(contentType);
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

        // immutable
        name: function(callback) {
            this._validate();
            callback(this._object.name);
        },

        isDefaultPeer: function(callback) {
            this._validate();
            callback(this._object.isDefaultPeer);
        },

        // methods

        request: function(callback) {
            this._validate();
            var transfer = new ContentTransfer(this._object.request());

            if (callback && typeof(callback) === 'function')
                callback(transfer.serialize());
        },

        requestForStore: function(store, callback) {
            if ( ! store) {
                callback(null);
                return;
            }

            if (! backendDelegate.isObjectProxyInfo(store)) {
                console.debug('requestForStore: invalid store object proxy')
                callback("Invalid store");
                return;
            }

            var _store = backendDelegate.objectFromId(store.objectid);
            if ( ! _store) {
                callback("Invalid store object (NULL)");
                return;
            }
            this._validate();

            var transfer = new ContentTransfer(this._object.request(_store));
            if (callback && typeof(callback) === 'function')
                callback(transfer.serialize());
        },

        // internal

        internal: {
            request: function(self) {
                return self._object.request();
            }
        }
    };

    function ContentPeerModel(filterParams) {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'ContentPeerModel', filterParams);
        this._id = result.id;
        this._object = result.object;

        this._modelAdaptor = backendDelegate.createModelAdaptorFor(this._object);
        this._roles = this._modelAdaptor.roles();
    };
    ContentPeerModel.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            this._modelAdaptor.destroy();
            backendDelegate.deleteId(this._id);
        },

        // properties
        setContentType: function(contentType, callback) {
            this._validate();
            this._object.contentType = contentType;
            if (callback)
                callback();
        },

        setHandler: function(handler, callback) {
            this._validate();
            this._object.handler = handler;
            if (callback)
                callback();
        },

        peers: function() {
            this._validate();
            return this._object.peers;
        },

        // QAbtractListModel prototype
        count: function(callback) {
            if (!this._modelAdaptor) {
                callback(-1);
                return;
            }
            callback(this._modelAdaptor.rowCount());
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
        getPeers: function(filters, callback) {
            if ( ! filters){
                callback(null);
                return;
            }

            var statement = "import QtQuick 2.0; import Ubuntu.Content 0.1; ContentPeerModel { ";
            if (filters.contentType) {
                statement += " contentType: ContentType." + filters.contentType + ";";
            }
            if (filters.handler) {
                statement += " handler: ContentHandler." + filters.handler + ";";
            }
            statement += " }";

            var peerModel = Qt.createQmlObject(statement, backendDelegate.parent());
            var peers = peerModel.peers;

            var wrappedPeers = [];
            for (var i = 0; i < peers.length; ++i) {
                var wrappedPeer = new ContentPeer(peers[i]);
                wrappedPeers.push(wrappedPeer.serialize());
            }
            callback(wrappedPeers);
        },

        getStore: function(scope, callback) {
            if ( ! scope){
                callback(null);
                return;
            }
            var store = new ContentStore();
            store.setScope(scope);
            callback(store.serialize());
        },

        launchContentPeerPicker: function(filters, onPeerSelected, onCancelPressed) {
            if ( ! filters){
                callback(null);
                return;
            }

            var parentItem = backendDelegate.parentView();
            if ( ! parentItem || ! parentItem.visible || ! parentItem.height || ! parentItem.width) {
                console.debug("Cannot launch the content peer picker UI, invalid parent item: " + parentItem);
                onCancelPressed();
                return;
            }

            var statement = "import QtQuick 2.0; import Ubuntu.Content 0.1; ContentPeerPicker {";
            if (filters.contentType) {
                statement += " contentType: ContentType." + filters.contentType + "";
            }
            if (filters.handler) {
                statement += "; handler: ContentHandler." + filters.handler + "";
            }
            if (filters.showTitle) {
                statement += "; showTitle: " + filters.showTitle === false ? "false" : "true";
            }
            statement += "; visible: true; }";

            if (parentItem.parent)
                parentItem.visible = false;
            var contentPeerPicker = Qt.createQmlObject(statement,
                                                       parentItem.parent ? parentItem.parent : parentItem);
            function _onPeerSelected() {
                var peer = new ContentPeer(contentPeerPicker.peer);
                contentPeerPicker.visible = false;
                parentItem.visible = true;
                onPeerSelected(peer.serialize());
                contentPeerPicker.onPeerSelected.disconnect(_onPeerSelected);
                contentPeerPicker.destroy();
            }
            function _onCancelPressed() {
                contentPeerPicker.visible = false;
                parentItem.visible = true;
                onCancelPressed();
                contentPeerPicker.onPeerSelected.disconnect(_onCancelPressed);
                contentPeerPicker.destroy();
            }

            contentPeerPicker.onPeerSelected.connect(_onPeerSelected);
            contentPeerPicker.onCancelPressed.connect(_onCancelPressed);
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
            var _transfer = null;
            if (transferOptions.scope) {
                var store = new ContentStore();
                store.setScope(transferOptions.scope);
                _transfer = _peer.request(store._object);
            }
            else {
                _transfer = _peer.request();
            }

            if (transferOptions.multipleFiles) {
                _transfer.selectionType = ContentHubBridge.ContentTransfer.Multiple;
            }
            else {
                _transfer.selectionType = ContentHubBridge.ContentTransfer.Single;
            }

            var transfer = new ContentTransfer(_transfer)
            _transfer.stateChanged.connect(function() {
                if (_transfer.state === ContentHubBridge.ContentTransfer.Aborted) {
                    onFailure("Aborted");
                    return;
                }
                else if (_transfer.state === ContentHubBridge.ContentTransfer.Charged) {
                    var d = transfer.internal.serializeItems(_transfer);
                    onSuccess(d);
                    _transfer.finalize();
                    return;
                }
            });
            _transfer.start();
        },

        onExportRequested: function(callback) {
            _contenthub.exportRequested.connect(function(exportTransfer) {
                var wrapped = new ContentTransfer(exportTransfer);
                callback(wrapped.serialize());
            });
        },

        onImportRequested: function(callback) {
            _contenthub.onImportRequested.connect(function(importTransfer) {
                var wrapped = new ContentTransfer(importTransfer);
                callback(wrapped.serialize());
            });
        },

        onShareRequested: function(callback) {
            _contenthub.shareRequested.connect(function(shareTransfer) {
                var wrapped = new ContentTransfer(shareTransfer);
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

