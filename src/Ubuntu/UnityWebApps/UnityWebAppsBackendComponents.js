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
    return params && __has(params, 'name');
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

    var result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends;  Backends.UnityWebappsBase { }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create base backend: ' + result.error);
        clearAll();
        return false;
    }
    __set("base", result.object);
    __onBackendReady("base");


    // notifications
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends;  Backends.UnityWebappsNotificationsBinding { ' + extracted + ' }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create notifications backend: ' + result.error);
        clearAll();
        return false;
    }
    __set("notify", result.object);
    __onBackendReady("notify");


    // messaging menu
    result = __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; \
                                Backends.UnityWebappsMessagingBinding { ' + extracted + ' }',
                      parentItem,
                      params);
    if (result.error != null) {
        console.debug('Could not create notifications backend: ' + result.error);
        clearAll();
        return false;
    }
    __set("messaging", result.object);
    __onBackendReady("messaging");


    // hud
    function HUDBackendAdaptor(parentItem, actionsContext) {
        this._actions = {};
        this._actionsContext = actionsContext;
    };
    HUDBackendAdaptor.prototype.__actionExists = function (actionName) {
        if (!actionName || typeof(actionName) != 'string' || actionName.lenght === 0)
            return false;
        return this._actions[actionName] != null;
    };
    HUDBackendAdaptor.prototype.addAction = function (actionName, callback) {
        if (this.__actionExists(actionName))
            this.removeAction(actionName);

        var action = __createQmlObject('import Ubuntu.HUD 1.0 as HUD; HUD.Action { label: "' + actionName + '"; enabled: true; }', this._actionsContext).object;
        this._actionsContext.addAction(action);

        action.triggered.connect(callback);

        this._actions[actionName] = action;
    }
    HUDBackendAdaptor.prototype.removeAction = function (actionName) {
        if ( ! this.__actionExists(actionName))
            return;
        try {
            this._actionsContext.removeAction(this._actions[actionName]);
            this._actions[actionName] = null;
        } catch(e) {
            console.debug('Error while removing an action: ' + e);
        }
    }
    HUDBackendAdaptor.prototype.removeActions = function () {
        for(var action in this._actions) {
            if (this._actions.hasOwnProperty(action) && this._actions[action] != null)
                this.removeAction(action);
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
        delete _backends['base'];
    }

    //TODO hu?
    if (_backends.hud) {
        _backends.hud._hud.destroy();
        delete _backends['hud'];
    }

    if (_backends.notify) {
        _backends.notify.destroy();
        delete _backends['notify'];
    }

    if (_backends.messaging) {
        _backends.messaging.destroy();
        delete _backends['messaging'];
    }
};


