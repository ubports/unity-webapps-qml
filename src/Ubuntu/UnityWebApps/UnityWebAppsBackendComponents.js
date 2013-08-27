/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of UnityWebappsQML.
 *
 * UnityWebappsQML is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * UnityWebappsQML is distributed in the hope that it will be useful,
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
    for(var p in params) {
        if(params.hasOwnProperty(p))
            extracted += p + ":" + JSON.stringify(params[p]) + "; ";
    }
    return extracted;
}

function get(id) {
    return _backends[id];
};

function createAllWithAsync(parentItem, params) {
    if (!__areValidParams(params)) {
        //TODO: error reporting
        throw new Error("Invalid creation parameters");
    }
    var extracted = __extractParams(params);

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
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends;  Backends.UnityWebappsNotificationsBinding { name: "' + params.name + '"; }',
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


    // hud
    function HUDBackendAdaptor(parentItem, actionsContext) {
        this._actions = {};
        this._actionsContext = actionsContext;
    };
    HUDBackendAdaptor.prototype.destroy = function () {
        this.clearActions();
    }
    HUDBackendAdaptor.prototype.__normalizeName = function (actionName) {
        return actionName.replace(/^\/+/, '');
    }
    HUDBackendAdaptor.prototype.__actionExists = function (actionName) {
        if (!actionName || typeof(actionName) != 'string' || actionName.lenght === 0)
            return false;
        return this._actions[actionName] != null && this._actions[actionName].action != null;
    };
    HUDBackendAdaptor.prototype.addAction = function (_actionName, callback) {
        var actionName = this.__normalizeName(_actionName);

        if (this.__actionExists(actionName))
            this.clearAction(actionName);
        var action = __createQmlObject('import Ubuntu.Unity.Action 1.0 as UnityActions; UnityActions.Action { text: "' + actionName + '"; enabled: true; }',
                                       this._actionsContext).object;
        this._actionsContext.addAction(action);

        action.triggered.connect(callback);

        this._actions[actionName] = { action: action, callback: callback};
    }
    HUDBackendAdaptor.prototype.clearAction = function (_actionName) {
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
    HUDBackendAdaptor.prototype.clearActions = function () {
        for(var action in this._actions) {
            if (this._actions.hasOwnProperty(action) && this._actions[action] != null)
                this.clearAction(action);
        }
    }

    //FIXME: find a better way to access parentItem.actionsContext
    if (parentItem.actionsContext) {
        __set("hud", new HUDBackendAdaptor(parentItem, parentItem.actionsContext));
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

    if (_backends.mediaplayer) {
        _backends.mediaplayer.destroy();
        _backends['mediaplayer'] = null;
    }

    if (_backends.messaging) {
        _backends.messaging.destroy();
        _backends['messaging'] = null;
    }
};


