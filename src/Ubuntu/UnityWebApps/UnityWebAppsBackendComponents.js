var _backends = {};

function __set(id, component) {
    _backends[id] = component;
};

function __areValidParams(params) {
    function __has(o,n) { return n in o && o[n] != null && (typeof o[n] === 'string' ? o[n] !== "" : true); };
    return params && __has(params, 'name');
};

function __createQmlObject(qmlStatement, parentItem, params, onCreated) {
    var component;

    if (!onCreated || !(onCreated instanceof Function)) {
        //TODO error handling
        throw "Invalid onCreated function"
    }
    try {
        component = Qt.createQmlObject(qmlStatement, parentItem);
        onCreated({object: component});
    } catch(e) {
        console.debug(JSON.stringify(e.qmlErrors))
    }
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

    console.debug(get(name))

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

//TODO very hacky
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
    //TODO proper error reporting and more sound creation chaining
    __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends;  Backends.UnityWebappsBase { }',
                      parentItem,
                      params,
                      function (result) {
                          if (!result.error) {
                              __set("base", result.object);
                              __onBackendReady("base");
                          }
                      });

    __createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends;  Backends.UnityWebappsNotificationsBinding { ' + extracted + ' }',
                      parentItem,
                      params,
                      function (result) {
                          if (!result.error) {
                              __set("notify", result.object);
                              __onBackendReady("notify");
                          }
                      });

    // hud
/*    function HUDBackendAdaptor(parentItem) {
        component = Qt.createComponent('import Ubuntu.HUD 0.1;  HUD { id: hud }', parentItem);
        this._hud = component.createObject(parentItem, params);
    };
    HUDBackendAdaptor.prototype.addAction = function (actionName, callback) {
    }
    HUDBackendAdaptor.prototype.removeAction = function (actionName, callback) {
    }
    _backends.hud = new HUDBackendAdaptor(parentItem);*/
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
};


