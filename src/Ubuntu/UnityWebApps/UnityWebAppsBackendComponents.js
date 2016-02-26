/*
 * Copyright 2013 Canonical Ltd.
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

var _backends = {};

function __set(id, component) {
    _backends[id] = component;
};

function __areValidParams(params) {
    function __has(o,n) { return n in o && o[n] != null && (typeof o[n] === 'string' ? o[n] !== "" : true); };
    return params && __has(params, 'name') && __has(params, 'displayName');
};

function __createQmlObject(qmlStatement, parentItem, params) {
    var component = null;
    var error = null;

    try {
        component = Qt.createQmlObject(qmlStatement, parentItem);
    } catch(e) {
        error = JSON.stringify(e.qmlErrors);
    }
    return { object: component, error: error};
};

//TODO: bad mechanism, it could possibly be that the "base" backend is
// ready after the "notify" one ... which is bad and could enable calls
// to notify w/o base ready
var _backendReadyListeners = {};
function __onBackendReady(name) {
    if (!(name instanceof String) || name.length !== 0)
        return;

    var listeners = _backendReadyListeners[name];
    if (listeners && listeners instanceof Array && listeners.length !== 0) {
        listeners.forEach(function (listener) {
            try {
                listener(name);
            } catch (e) {};
        });
    }
};


function signalOnBackendReady(name, func) {
    if (typeof(name) != "string" || name.length === 0)
        return;

    if (!(func instanceof Function))
        return;

    // check if backend already ready
    if (!!get(name)) {
        console.debug('Backend ready: ' + name);
        func(name);
        return;
    }

    if (!_backendReadyListeners[name])
        _backendReadyListeners[name] = [];

    _backendReadyListeners[name].push(func);
}

function UnityActionsBackendAdaptor(parentItem, actionsContext) {
    this._actions = {};
    this._actionsContext = actionsContext;
};
UnityActionsBackendAdaptor.prototype.destroy = function () {
    this.clearActions();
}
UnityActionsBackendAdaptor.prototype.__normalizeName = function (actionName) {
    return actionName.replace(/^\/+/, '');
}
UnityActionsBackendAdaptor.prototype.__actionExists = function (actionName) {
    if (!actionName || typeof(actionName) != 'string' || actionName.lenght === 0)
        return false;
    return this._actions[actionName] != null && this._actions[actionName].action != null;
};
UnityActionsBackendAdaptor.prototype.addAction = function (_actionText, callback, id) {
    var actionText = this.__normalizeName(_actionText);

    if (this.__actionExists(actionText))
        this.clearAction(actionText);

    var params = ' text: "' + actionText + '";'
            + ' enabled: true; ' +
            (id ? ('name: ' + '"' + id + '"') : '');

    var action = __createQmlObject('import Ubuntu.Unity.Action 1.0 as UnityActions; \
                                    UnityActions.Action { ' + params + ' }',
                                   this._actionsContext).object;
    this._actionsContext.addAction(action);

    action.triggered.connect(callback);

    this._actions[actionText] = { action: action, callback: callback};
}
UnityActionsBackendAdaptor.prototype.clearAction = function (_actionName) {
    var actionName = this.__normalizeName(_actionName);

    if ( ! this.__actionExists(actionName))
        return;
    try {
        this._actionsContext.removeAction(this._actions[actionName].action);
        this._actions[actionName].action.enabled = false;
        this._actions[actionName].action.triggered.disconnect(this._actions[actionName].callback);
        this._actions[actionName] = null;
    } catch(e) {
        console.debug('Error while removing an action: ' + e);
    }
}
UnityActionsBackendAdaptor.prototype.clearActions = function () {
    for(var action in this._actions) {
        if (this._actions.hasOwnProperty(action) && this._actions[action] != null)
            this.clearAction(action);
    }
}

/*!
  \internal

  Extracts the properties of a given js object and tries to
  create a string for the definition of a QML object w/ those values.
  e.g.
  params = {name: "myname", version: 1}
  ->
  "name: 'myname'; version: 1"

  It assumes a lot and is fragile (no array, complex object support, error handling, etc,)

  FIXME: Shamefully hacky
 */
function __extractParams(params) {
    if (!params || !(params instanceof Object))
        return "";
    var extracted = "";
    for (var p in params) {
        if (params.hasOwnProperty(p) && params[p] != null) {
            extracted += p + ":" + JSON.stringify(params[p]) + "; ";
        }
    }
    return extracted;
}

function get(id) {
    return _backends[id];
};


function UbuntuBindingBackendDelegate(parent) {
    this._parent = parent;
    this._id = 0;
    this._objects = {};
    this._last_proxy_id = 0;
}
UbuntuBindingBackendDelegate.prototype = {
    createQmlObject: function(uri, version, component, properties) {
        var statement = 'import ' + uri
                + ' ' + version + '; '
                + component + ' { '
                + __extractParams(properties)
                + ' }';

        var result = __createQmlObject(statement,
                          this._parent);

        if (result.error != null) {
            console.debug('Error while creating object: '
                          + uri
                          + '.'
                          + component
                          + ' : '
                          + result.error);
            return null;
        }

        var id = this._generateObjectId(uri, component);

        this._objects[id] = result.object;

        return {object: this._objects[id], id: id};
    },

    parent: function() {
        return this._parent;
    },

    parentView: function() {
        if (! this._parent) {
            return null
        }
        if (this._parent.embeddedUiComponentParent) {
            return this._parent.embeddedUiComponentParent
        }
        return this._parent.bindee
    },

    isObjectProxyInfo: function(info) {
        return 'type' in info &&
            info.type === 'object-proxy' &&
            'apiid' in info &&
            'objecttype' in info &&
            'objectid' in info;
    },

    deleteId: function(id) {
        if (this._objects[id] != null) {
            delete this._objects[id];
            this._objects[id] = null;
        }
    },

    objectFromId: function(id) {
        return id != null ? this._objects[id] : null;
    },

    storeQmlObject: function(object, uri, version, component, properties) {
        var id = this._generateObjectId(uri, component);
        console.debug('got an id: ' + id)
        this._objects[id] = object;
        return id;
    },

    createModelAdaptorFor: function(model) {
        var adaptor = Qt.createQmlObject('import Ubuntu.UnityWebApps 0.1 \
                                          as UW; UW.AbstractItemModelAdaptor {}', this._parent);
        adaptor.itemModel = model;
        return adaptor;
    },

    _generateObjectId: function(uri, name) {
        var candidate = uri + name + this._id;
        while (this._objects[candidate] != undefined) {
            ++this._last_proxy_id;
            candidate = uri + name + this._last_proxy_id;
        }
        return candidate;
    }

};

var backendDelegate;

function createBackendDelegate(parentItem) {
    backendDelegate = new UbuntuBindingBackendDelegate(parentItem);
}

/**
 * \brief creates all the backends
 *
 * \param
 */
function createAllWithAsync(parentItem, params, eventHandlers) {
    if (!__areValidParams(params)) {
        //TODO: error reporting
        throw new Error("Invalid creation parameters");
    }
    var extracted = __extractParams(params);

    function connectAppRaisedEvent(target) {
        if (target && eventHandlers && eventHandlers.onAppRaised)
            target.raised.connect(function() { try { eventHandlers.onAppRaised(); } catch(e){} });
    }

    //FIXME:!!! lots of duplicated stuff

    var result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; \
                                    Backends.UnityWebappsBase { }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create base backend: ' + result.error);
        clearAll();
        return false;
    }
    var apiBase = result.object;
    apiBase.model = parentItem.model;
    __set("base", apiBase);
    __onBackendReady("base");


    // notifications
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; \
                                Backends.UnityWebappsNotificationsBinding { name: "' + params.name + '"; }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create notifications backend: ' + result.error);
        clearAll();
        return false;
    }
    __set("notify", result.object);
    __onBackendReady("notify");


    // launcher
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; \
                                Backends.UnityWebappsLauncherBinding { }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create launcher backend: ' + result.error);
        clearAll();
        return false;
    }
    var launcher = result.object;
    apiBase.appInfosChanged.connect(function(appInfos) {
        launcher.onAppInfosChanged(appInfos);
    });
    __set("launcher", launcher);
    __onBackendReady("launcher");



    // media player
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; \
                                Backends.UnityWebappsMediaPlayerBinding { }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create MediaPlayer backend: ' + result.error);
        clearAll();
        return false;
    }
    var mediaplayer = result.object;
    apiBase.appInfosChanged.connect(function(appInfos) { mediaplayer.onAppInfosChanged(appInfos); });
    __set("mediaplayer", mediaplayer);
    __onBackendReady("mediaplayer");

    connectAppRaisedEvent(mediaplayer);


    // messaging menu
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; \
                                Backends.UnityWebappsMessagingBinding { }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create messaging menu backend: ' + result.error);
        clearAll();
        return false;
    }
    // model have to be manuall set
    var messagingmenu = result.object;
    apiBase.appInfosChanged.connect(function(appInfos) { messagingmenu.onAppInfosChanged(appInfos); });
    __set("messaging", messagingmenu);
    __onBackendReady("messaging");

    connectAppRaisedEvent(messagingmenu);

    // extra actions set for the launcher/messaging-menu
    if (parentItem.actionsContext) {
        __set("indicator-actions", new UnityActionsBackendAdaptor(parentItem, parentItem.actionsContext));
        __onBackendReady("indicator-actions");
    }


    // Unity actions/HUD
    //FIXME: find a better way to access parentItem.actionsContext
    if (parentItem.actionsContext) {
        __set("hud", new UnityActionsBackendAdaptor(parentItem, parentItem.actionsContext));
        __onBackendReady("hud");
    }
}

function clearAll () {
    if (_backends.base) {
        _backends.base.destroy();
        _backends['base'] = null;
    }

    if (_backends.hud) {
        _backends.hud.destroy();
        _backends['hud'] = null;
    }

    if (_backends.notify) {
        _backends.notify.destroy();
        _backends['notify'] = null;
    }

    if (_backends.launcher) {
        _backends.launcher.destroy();
        _backends['launcher'] = null;
    }

    if (_backends['indicator-actions']) {
        _backends['indicator-actions'].destroy();
        _backends['indicator-actions'] = null;
    }

    if (_backends.mediaplayer) {
        _backends.mediaplayer.destroy();
        _backends['mediaplayer'] = null;
    }

    if (_backends.messaging) {
        _backends.messaging.destroy();
        _backends['messaging'] = null;
    }
};


