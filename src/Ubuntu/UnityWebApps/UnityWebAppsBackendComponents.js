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

.import Ubuntu.Content 0.1 as ContentHubBridge
.import Ubuntu.Components 0.1 as ComponentsBridge

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
        if (params.hasOwnProperty(p))
            extracted += p + ":" + JSON.stringify(params[p]) + "; ";
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




/**
 *
 * Online Accounts API backend binding
 *
 */
function createOnlineAccountsApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.OnlineAccounts';
    var VERSION = 0.1;

    function Account(account, objectid) {
        var id = objectid;
        if ( ! id) {
            id = backendDelegate.storeQmlObject(transfer,
                    PLUGIN_URI, VERSION, 'Account');
        }
        this._id = id;
        this._object = account;
    };
    Account.prototype = {
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
                apiid: 'OnlineAccounts',
                objecttype: 'Account',
                objectid: self._id,

                // serialize immutable values
                content: {
                    enabled: self._object.enabled,
                    provider: self._object.provider,
                    displayName: self._object.displayName,
                    accountId: self._object.accountId,
                }
            }
        },

        // properties

        // immutable
        enabled: function(callback) {
            this._validate();
            callback(this._object.enabled);
        },

        // immutable
        provider: function(callback) {
            this._validate();
            callback(this._object.provider);
        },

        // immutable
        displayName: function(callback) {
            this._validate();
            callback(this._object.displayName);
        },

        // immutable
        accountId: function(callback) {
            this._validate();
            callback(this._object.accountId);
        },

        // method

        updateDisplayName: function(displayName) {
            this._validate();
            this._object.updateDisplayName(displayName);
        },

        updateEnabled: function(enabled) {
            this._validate();
            this._object.updateEnabled(enabled);
        },

        remove: function(enabled) {
            this._validate();
            this._object.remove();
        },
    };

    function AccountService(service, objectid) {
        var id = objectid;
        if ( ! service) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'AccountService');
            id = result.id;
            service = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(service,
                    PLUGIN_URI, VERSION, 'AccountService');
        }
        this._id = id;
        this._object = service;
    };
    AccountService.prototype = {
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
                apiid: 'OnlineAccounts',
                objecttype: 'AccountService',
                objectid: self._id,

                // serialize immutable values

                content: {
                    accountId: self._object.accountId,
                    enabled: self._object.enabled,
                    serviceEnabled: self._object.serviceEnabled,
                    displayName: self._object.displayName,
                    provider: self.internal.getProvider(self),
                    service: self.internal.getService(self),
                },
            }
        },

        // properties

        autoSync: function(callback) {
            this._validate();
            callback(this._object.autoSync);
        },
        setAutoSync: function(autoSync, callback) {
            this._validate();
            this._object.autoSync = autoSync;
            if (callback)
                callback();
        },

        // immutable
        accountId: function(callback) {
            this._validate();
            callback(this._object.accountId);
        },

        // immutable
        enabled: function(callback) {
            this._validate();
            callback(this._object.enabled);
        },

        // immutable
        serviceEnabled: function(callback) {
            this._validate();
            callback(this._object.serviceEnabled);
        },

        // immutable
        displayName: function(callback) {
            this._validate();
            callback(this._object.displayName);
        },

        // immutable
        provider: function(callback) {
            this._validate();
            callback(this.internal.getProvider(this));
        },

        // immutable
        service: function(callback) {
            this._validate();
            callback(this.internal.getService(this));
        },

        objectHandle: function(callback) {
            this._validate();
            callback(this._object.objectHandle);
        },
        setObjectHandle: function(objectHandle) {
            this._validate();
            this._object.objectHandle = objectHandle;
        },

        // methods
        authenticate: function(callback) {
            this._validate();

            var onAuthenticated;
            var onAuthenticationError;

            var self = this;
            onAuthenticated = function(reply) {
                callback({error: null,
                          authenticated: true,
                          data: reply.AccessToken});

                self._object.onAuthenticated.disconnect(onAuthenticated);
                self._object.onAuthenticationError.disconnect(onAuthenticationError);
            };
            onAuthenticationError = function(error){
                callback({error: error.message,
                          authenticated: false,
                          data: null,
                          accountId: null});

                self._object.onAuthenticated.disconnect(onAuthenticated);
                self._object.onAuthenticationError.disconnect(onAuthenticationError);
            };

            this._object.onAuthenticated.connect(onAuthenticated);
            this._object.onAuthenticationError.connect(onAuthenticationError);

            this._object.authenticate(null);
        },

        // Internal

        internal: {
            getService: function(self) {
                return {
                    id: self._object.service.id,
                    displayName: self._object.service.displayName,
                    iconName: self._object.service.iconName,
                };
            },
            getProvider: function(self) {
                return {
                    id: self._object.provider.id,
                    displayName: self._object.provider.displayName,
                    iconName: self._object.provider.iconName,
                };
            }
        }
    };


    function Manager() {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'Manager');
        this._id = result.id;
        this._object = result.object;
    };
    Manager.prototype = {
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
            return {
                type: 'object-proxy',
                apiid: 'OnlineAccounts',
                objecttype: 'Manager',
                objectid: this._id,
            }
        },

        // methods
        createAccount: function(providerName, callback) {
            this._validate();
            var account = new Account(this._object.createAccount(providerName));
            callback(account.serialize());
        },
        loadAccount: function(id, callback) {
            this._validate();
            var account = new Account(this._object.loadAccount(id));
            callback(account.serialize());
        },

        internal: {
            loadAccount: function(self, id) {
                return new Account(self._object.loadAccount(id));
            },
        },
    };


    function ProviderModel() {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'ProviderModel');
        this._id = result.id;
        this._object = result.object;

        this._modelAdaptor = backendDelegate.createModelAdaptorFor(this._object);
        this._roles = this._modelAdaptor.roles();
    };
    ProviderModel.prototype = {
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

        // object methods
        serialize: function() {
            this._validate();
            return {
                type: 'object-proxy',
                apiid: 'OnlineAccounts',
                objecttype: 'ProviderModel',
                objectid: this._id,
            }
        },

        // properties

        applicationId: function(callback) {
            this._validate();
            callback(this._object.applicationId);
        },
        setApplicationId: function(applicationId, callback) {
            this._validate();
            this._object.applicationId = applicationId;
            if (callback)
                callback();
        },

        // QAbtractListModel prototype
        count: function(callback) {
            this._validate();
            if (this._modelAdaptor) {
                return -1;
            }
            callback(this._modelAdaptor.rowCount());
        },

        at: function(idx, callback) {
            this._validate();
            if (idx >= this.proxy.count || ! this._modelAdaptor) {
                callback(null);
                return;
            }

            var result = {};
            for (var role in this._roles) {
                result[role] = this._modelAdaptor.itemAt(idx, role);
            }
            callback(result);
        }
    };

    function AccountServiceModel() {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'AccountServiceModel');
        this._id = result.id;
        this._object = result.object;

        this._modelAdaptor = backendDelegate.createModelAdaptorFor(this._object);
        this._roles = this._modelAdaptor.roles();

        // quickly filter out roles that are "tricky"
        if (this._roles.indexOf('accountServiceHandle') !== -1) {
            this._roles.splice(this._roles.indexOf('accountServiceHandle'), 1);
        }
        if (this._roles.indexOf('accountHandle') !== -1) {
            this._roles.splice(this._roles.indexOf('accountHandle'), 1);
        }
    };
    AccountServiceModel.prototype = {
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
        count: function(callback) {
            this._validate();
            callback(this._object.count);
        },

        service: function(callback) {
            this._validate();
            callback(this._object.service);
        },
        setService: function(service, callback) {
            this._validate();
            this._object.service = service;
            if (callback)
                callback();
        },

        provider: function(callback) {
            this._validate();
            callback(this._object.provider);
        },
        setProvider: function(provider, callback) {
            this._validate();
            this._object.provider = provider;
            if (callback)
                callback();
        },

        serviceType: function(callback) {
            this._validate();
            callback(this._object.serviceType);
        },
        setServiceType: function(serviceType, callback) {
            this._validate();
            this._object.serviceType = serviceType;
            if (callback)
                callback();
        },

        includeDisabled: function(callback) {
            this._validate();
            callback(this._object.includeDisabled);
        },
        setIncludeDisabled: function(includeDisabled, callback) {
            this._validate();
            this._object.includeDisabled = includeDisabled;
            if (callback)
                callback();
        },

        accountId: function(callback) {
            this._validate();
            callback(this._object.accountId);
        },
        setAccountId: function(accountId, callback) {
            this._validate();
            this._object.accountId = accountId;
            if (callback)
                callback();
        },

        // QAbtractListModel prototype
        count: function(callback) {
            if (this._modelAdaptor) {
                callback(-1);
            }
            callback(this._modelAdaptor.rowCount());
        },

        at: function(idx, callback) {
            var count = this._modelAdaptor.rowCount();
            if (idx >= count || ! this._modelAdaptor) {
                callback(null);
                return;
            }
            var result = {};
            for (var role in this._roles) {
                result[role] = this._modelAdaptor.itemAt(idx, role);
            }
            callback(result);
        },

        // Internal bits, not part of the API (especially no async)

        internal: {

            // special case for an object wrapper
            accountServiceHandleAtIndex: function(self, idx) {
                self._validate();

                var accountServiceHandle = self._modelAdaptor.itemAt(idx, "accountServiceHandle");

                if (accountServiceHandle != null) {
                    var accountService = new AccountService();
                    accountService.setObjectHandle(accountServiceHandle);
                    return accountService;
                }

                return null;
            },

            itemAt: function(self, idx, role) {
                self._validate();
                return self._modelAdaptor.itemAt(idx, role);
            },

            count: function(self) {
                return self._modelAdaptor ?
                            self._modelAdaptor.rowCount()
                          : -1;
            },

            includeDisabled: function(self) {
                return self._object.includeDisabled;
            },
        }
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "AccountServiceModel": AccountServiceModel,
            "Account": Account,
            "ProviderModel": ProviderModel,
            "Manager": Manager,
            "AccountService": AccountService
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    };

    return {
        createAccountServiceModel: function(callback) {
            var service = new AccountServiceModel();
            callback(service.serialize());
        },
        createManager: function(callback) {
            var manager = new Manager();
            callback(manager.serialize());
        },
        createProviderModel: function(callback) {
            var provider = new ProviderModel();
            callback(provider.serialize());
        },

        // api
        getAccountsInfoFor: function(service, provider, callback) {
            var serviceModel = new AccountServiceModel();

            if (service)
                serviceModel.setService(service);
            if (provider)
                serviceModel.setProvider(provider);

            var count = serviceModel.internal.count(serviceModel);
            console.log(count)
            var accountsInfo = []
            for (var i = 0; i < count; ++i) {
                var displayName = serviceModel.internal.itemAt(serviceModel, i, "displayName");
                var accountId = serviceModel.internal.itemAt(serviceModel, i, "accountId");
                var providerName = serviceModel.internal.itemAt(serviceModel, i, "providerName");
                var serviceName = serviceModel.internal.itemAt(serviceModel, i, "serviceName");
                var enabled = serviceModel.internal.itemAt(serviceModel, i, "enabled");

                accountsInfo.push({displayName: displayName
                                      , accountId: accountId
                                      , providerName: providerName
                                      , serviceName: serviceName
                                      , enabled: enabled
                                  });
            }
            serviceModel.destroy();

            callback(accountsInfo);
        },

        getAccountById: function(accountId, callback) {
            var manager = new Manager();
            var account = manager.internal.loadAccount(manager, accountId);
            manager.destroy();
            callback(account.serialize());
        },

        getAccessTokenFor: function(serviceName, providerName, accountId, callback) {
            var serviceModel = new AccountServiceModel();

            if (serviceName)
                serviceModel.setService(serviceName);
            if (providerName)
                serviceModel.setProvider(providerName);
            if (accountId)
                serviceModel.setAccountId(accountId);

            var count = serviceModel.internal.count(serviceModel);
            if (count > 0) {
                var accountIdx = 0;
                if (count > 1) {
                    console.debug("More than one account with id: " + accountId);
                }
                var onAuthenticated = function(results) {
                    serviceModel.destroy();
                    callback(results);
                };
                serviceModel.internal
                    .accountServiceHandleAtIndex(serviceModel, accountIdx)
                    .authenticate(onAuthenticated);
            }
            else {
                serviceModel.destroy();
                callback({error: "No account found"});
            }
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


/**
 *
 * Alarm API backend binding
 *
 */
function createAlarmApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.Components';
    var VERSION = 0.1;

    function _nameToAlarmType(name) {
        var alarmTypePerName = {
            "OneTime": ComponentsBridge.Alarm.OneTime,
            "Repeating": ComponentsBridge.Alarm.Repeating,
        };
        return name in alarmTypePerName ?
                    alarmTypePerName[name]
                  : ComponentsBridge.Alarm.OneTime;
    };
    function _alarmTypeToName(type) {
        if (type === ComponentsBridge.Alarm.OneTime)
            return "OneTime";
        else if (type === ComponentsBridge.Alarm.Repeating)
            return "Repeating";
        return ;
    };

    function Alarm(alarm, objectid) {
        var id = objectid;
        if ( ! alarm) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'Alarm');
            id = result.id;
            alarm = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(alarm,
                    PLUGIN_URI, VERSION, 'Account');
        }

        this._id = id;
        this._object = alarm;
    };
    Alarm.prototype = {
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
            return {
                type: 'object-proxy',
                apiid: 'Alarm',
                objecttype: 'Alarm',
                objectid: this._id,
            }
        },

        // methods
        cancel: function() {
            this._validate();
            this._object.cancel();
        },
        reset: function() {
            this._validate();
            this._object.reset();
        },
        save: function() {
            this._validate();
            this._object.save();
        },


        // properties
        error: function(callback) {
            this._validate();
            callback(this._object.error);
        },

        date: function(callback) {
            this._validate();
            callback(this._object.date.getTime());
        },
        setDate: function(date, callback) {
            this._validate();
            var _date = new Date();
            _date.setTime(parseInt(date));
            this._object.date = _date;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        daysOfWeek: function(callback) {
            this._validate();
            callback(this._object.daysOfWeek);
        },
        setDaysOfWeek: function(daysOfWeek, callback) {
            this._validate();
            this._object.daysOfWeek = daysOfWeek;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        enabled: function(callback) {
            this._validate();
            callback(this._object.enabled);
        },
        setEnabled: function(enabled, callback) {
            this._validate();
            this._object.enabled = enabled;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        message: function(callback) {
            this._validate();
            callback(this._object.message);
        },
        setMessage: function(message, callback) {
            this._validate();
            this._object.message = message;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        sound: function(callback) {
            this._validate();
            callback(this._object.sound);
        },
        setSound: function(sound, callback) {
            this._validate();
            this._object.sound = sound;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        status: function(callback) {
            this._validate();
            callback(this._object.status.toString());
        },

        type: function(callback) {
            this._validate();
            callback(_alarmTypeToName(this._object.type));
        },
        setType: function(type, callback) {
            this._validate();
            this._object.type = _nameToAlarmType(type);
            if (callback && typeof(callback) === 'function')
                callback();
        },

        // internal

        internal: {
            error: function(self) {
                return self._object.error;
            }
        }
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "Alarm": Alarm,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    }

    return {
        createAlarm: function(callback) {
            console.log('createAlarm')
            var alarm = new Alarm();
            callback(alarm.serialize());
        },

        createAndSaveAlarmFor: function(date, type, daysOfWeek, message, callback) {
            var alarm = new Alarm();

            alarm.setDate(date);
            alarm.setMessage(message);
            alarm.setType(_nameToAlarmType(type));
            alarm.setDaysOfWeek(daysOfWeek);
            alarm.save();

            if (callback && typeof(callback) === 'function')
                callback(alarm.internal.error(alarm));

            alarm.destroy();
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

                console.debug('setItems: adding item ' + item.object.name.toString()
                              + ', ' + item.object.url.toString());

                contentItems.push(item.object);
            }

            this._object.items = contentItems;

            console.debug('setItems: grand total of ' + this._object.items.length + ' added');

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
            console.log('*** Transfer object: ' + transfer + '')
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
                console.log('** Transfer state change: ' + transfer + ', state: ' + _contentTransferStateToName(transfer.state));
                if (transfer.state === ContentHubBridge.ContentTransfer.Aborted) {
                    onFailure("Aborted");
                    transfer.destroy();
                    return;
                }
                else if (transfer.state === ContentHubBridge.ContentTransfer.Charged) {
                    console.log('*** Transfer complete: got: ' + transfer.items.length + ' items (' + transfer + ')')
                    for (var i = 0; i < transfer.items.length; ++i) {
                        console.log('** item ' + i + ' : ' + transfer.items[i].url);
                    }

                    var d = _transfer.internal.serializeItems(transfer);
                    onSuccess(d);
                    transfer.finalize();
                    transfer.destroy();
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


