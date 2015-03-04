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

/**
 *
 * Online Accounts API backend binding
 *
 */
function createOnlineAccountsApi(backendDelegate, accessPolicy) {
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
                          data: reply});

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


    function ProviderModel(filterParams) {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'ProviderModel', filterParams);
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
        },

        internal: {

            // special case for an object wrapper
            at: function(self, idx) {
                self._validate();

                var displayName = self._modelAdaptor.itemAt(idx, "displayName");
                var providerId = self._modelAdaptor.itemAt(idx, "providerId");

                return {displayName: displayName, providerId: providerId};
            },

            count: function(self) {
                return self._modelAdaptor ?
                            self._modelAdaptor.rowCount()
                            : -1;
            },
        }
    };

    function AccountServiceModel(filterParams) {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'AccountServiceModel', filterParams);
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
            accountServiceAtIndex: function(self, idx) {
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
            var serviceModel = new AccountServiceModel({'service': service, 'provider': provider});

            var count = serviceModel.internal.count(serviceModel);
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

        getAccounts: function(filters, callback) {
            var serviceModel = new AccountServiceModel(filters);
            var count = serviceModel.internal.count(serviceModel);
            var accounts = []
            for (var i = 0; i < count; ++i) {
                var service = serviceModel.internal.accountServiceAtIndex(serviceModel, i);
                if (service) {
                    var s = service.serialize();
                    console.debug(JSON.stringify(s.content))
                    accounts.push(s);
                }
            }
            callback(accounts);
        },

        getProviders: function(filters, callback) {
            var providerModel = new ProviderModel(filters);
            var count = providerModel.internal.count(providerModel);
            var providers = []
            for (var i = 0; i < count; ++i) {
                providers.push(providerModel.internal.at(providerModel, i));
            }
            callback(providers);
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
                    .accountServiceAtIndex(serviceModel, accountIdx)
                    .authenticate(onAuthenticated);
            }
            else {
                serviceModel.destroy();
                callback({error: "No account found"});
            }
        },

        Client: OnlineAccountsClientApiBackend.createOnlineAccountsClientApi(backendDelegate),

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
