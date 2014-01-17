function createOnlineAccountsApi(backendBridge) {
    var PLUGIN_URI = 'OnlineAccounts';

    function Account(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'Account', id);
    };
    Account.prototype = {
    };

    function AccountService(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'AccountService', id);
    };
    AccountService.prototype = {
        // properties
        accountId: function(callback) {
            this._proxy.call('accountId', [], callback);
        },
        setAccountId: function(accountId) {
            this._proxy.call('setAccountId', [accountId]);
        },      

        enabled: function(callback) {
            this._proxy.call('enabled', [], callback);
        },
        setEnabled: function(enabled) {
            this._proxy.call('setEnabled', [enabled]);
        },      

        serviceEnabled: function(callback) {
            this._proxy.call('serviceEnabled', [], callback);
        },
        setServiceEnabled: function(serviceEnabled) {
            this._proxy.call('setServiceEnabled', [serviceEnabled]);
        },      

        autoSync: function(callback) {
            this._proxy.call('autoSync', [], callback);
        },
        setAutoSync: function(autoSync) {
            this._proxy.call('setAutoSync', [autoSync]);
        },      

        displayName: function(callback) {
            this._proxy.call('displayName', [], callback);
        },

        provider: function(callback) {
            this._proxy.call('provider', [], callback);
        },

        service: function(callback) {
            this._proxy.call('service', [], callback);
        },

        // methods

        authenticate: function(callback) {
            this._proxy.call('authenticate', [callback]);
        },
    };

    function Manager(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'Manager', id);
    };
    Manager.prototype = {
        createAccount: function(providerName, callback) {
            this._proxy.call('createAccount', [providerName], callback);
        },
        loadAccount: function(id, callback) {
            this._proxy.call('loadAccount', [id], callback);
        },
    };

    function ProviderModel(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ProviderModel', id);
    };
    ProviderModel.prototype = {
        // QAbtractListModel prototype

        at: function(idx, callback) {
            this._proxy.call('at',
                             [idx],
                             callback);
        }
    };

    function AccountServiceModel(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'AccountServiceModel', id);
    };
    AccountServiceModel.prototype = {
        // properties
        count: function(callback) {
            this._proxy.call('count', [], callback);
        },

        service: function(callback) {
            this._proxy.call('service', [], callback);
        },
        setService: function(service) {
            this._proxy.call('setService', [service]);
        },      

        provider: function(callback) {
            this._proxy.call('provider', [], callback);
        },
        setProvider: function(provider) {
            this._proxy.call('setProvider', [provider]);
        },      

        serviceType: function(callback) {
            this._proxy.call('serviceType', [], callback);
        },
        setServiceType: function(serviceType) {
            this._proxy.call('setServiceType', [serviceType]);
        },      

        accountId: function(callback) {
            this._proxy.call('accountId', [], callback);
        },
        setAccountId: function(accountId) {
            this._proxy.call('setAccountId', [accountId]);
        },

        // QAbtractListModel prototype

        at: function(idx, callback) {
            this._proxy.call('at',
                             [idx],
                             callback);
        }
    };

    function ApplicationModel(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ApplicationModel', id);
    };
    ApplicationModel.prototype = {
        // method
        service: function(callback) {
            this._proxy.call('service', [], callback);
        },
        setService: function(service) {
            this._proxy.call('setService', [service]);
        },

        // QAbtractListModel prototype

        at: function(idx, callback) {
            this._proxy.call('at',
                             [idx],
                             callback);
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
        /**
         * Calls a plain raw API function.
         * 
         * @method call
         * @param
         */
        createAccountServiceModel: function(callback) {
            backendBridge.call('OnlineAccounts.createAccountServiceModel'
                               , []
                               , callback);
        },

        /**
         * Calls a plain raw API function.
         * 
         * @method call
         * @param
         */
        createManager:  function(callback) {
            backendBridge.call('OnlineAccounts.createManager'
                               , []
                               , callback);
        },

        /**
         * Calls a plain raw API function.
         * 
         * @method call
         * @param
         */
        createProviderModel:  function(callback) {
            backendBridge.call('OnlineAccounts.createProviderModel'
                               , []
                               , callback);
        },

        api: {
            /**
             * Calls a plain raw API function.
             * 
             * @method call
             * @param
             */
            getAccessTokenFor: function(service, provider, callback) {
                backendBridge.call('OnlineAccounts.getAccessTokenFor'
                                   , [service, provider]
                                   , callback);
            },
        },


        // Internal

        /**
         * @private
         *
         */
        createObjectWrapper: function(objectType, objectId) {
            var Constructor = _constructorFromName(objectType);
            return new Constructor(objectId);
        },
    };
};


