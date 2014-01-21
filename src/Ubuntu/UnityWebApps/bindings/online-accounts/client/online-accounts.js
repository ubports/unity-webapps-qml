function createOnlineAccountsApi(backendBridge) {
    var PLUGIN_URI = 'OnlineAccounts';

    function Account(id, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'Account', id);

        this._accountId = content && content.accountId
             ? content.accountId : null;
        this._provider = content && content.provider
             ? content.provider : null;
    };
    Account.prototype = {

        // properties

        enabled: function(callback) {
            this._proxy.call('enabled', [], callback);
        },

        displayName: function(callback) {
            this._proxy.call('displayName', [], callback);
        },

        // immutable
        provider: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('provider', [], callback);
                return;
            }
            return this._provider;
        },

        // immutable
        accountId: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('accountId', [], callback);
                return;
            }
            return this._accountId;
        },

        // method

        updateDisplayName: function(displayName) {
            this._proxy.call('displayName', []);
        },

        updateEnabled: function(enabled) {
            this._proxy.call('updateEnabled', [enabled]);
        },

        remove: function(enabled) {
            this._proxy.call('remove', [enabled]);
        },

        // extras

        destroy: function() {
            this._proxy.call('destroy', []);
        },
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

        // extras

        destroy: function() {
            this._proxy.call('destroy', []);
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

        // extras

        destroy: function() {
            this._proxy.call('destroy', []);
        },
    };

    function ProviderModel(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'ProviderModel', id);
    };
    ProviderModel.prototype = {
        // properties
        count: function(callback) {
            this._proxy.call('count', [], callback);
        },

        applicationId: function(callback) {
            this._proxy.call('applicationId', [], callback);
        },
        setApplicationId: function(applicationId, callback) {
            this._proxy.call('setApplicationId', [applicationId, callback]);
        },

        // QAbtractListModel prototype

        at: function(idx, callback) {
            this._proxy.call('at',
                             [idx],
                             callback);
        },

        // extras

        destroy: function() {
            this._proxy.call('destroy', []);
        },
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
        setService: function(service, callback) {
            this._proxy.call('setService', [service, callback]);
        },

        provider: function(callback) {
            this._proxy.call('provider', [], callback);
        },
        setProvider: function(provider, callback) {
            this._proxy.call('setProvider', [provider, callback]);
        },      

        serviceType: function(callback) {
            this._proxy.call('serviceType', [], callback);
        },
        setServiceType: function(serviceType, callback) {
            this._proxy.call('setServiceType', [serviceType, callback]);
        },      

        accountId: function(callback) {
            this._proxy.call('accountId', [], callback);
        },
        setAccountId: function(accountId, callback) {
            this._proxy.call('setAccountId', [accountId, callback]);
        },

        // QAbtractListModel prototype

        at: function(idx, callback) {
            this._proxy.call('at',
                             [idx],
                             callback);
        },

        // extras

        destroy: function() {
            this._proxy.call('destroy', []);
        },
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
        setService: function(service, callback) {
            this._proxy.call('setService', [service, callback]);
        },

        // QAbtractListModel prototype

        at: function(idx, callback) {
            this._proxy.call('at',
                             [idx],
                             callback);
        },

        // extras

        destroy: function() {
            this._proxy.call('destroy', []);
        },
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "AccountServiceModel": AccountServiceModel,
            "Account": Account,
            "ProviderModel": ProviderModel,
            "Manager": Manager,
            "AccountService": AccountService,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    };

    return {

        Account: {
            RemovalOptions: {
                RemoveAccountOnly: 0,
                RemoveCredentials: 1
            }
        },

        /**
         * Creates a AccountServiceModel object.
         * 
         * @method createAccountServiceModel
         * @param callback {Function ( {ProviderModel} )}
         */
        createAccountServiceModel: function(callback) {
            backendBridge.call('OnlineAccounts.createAccountServiceModel'
                               , []
                               , callback);
        },

        /**
         * Creates a Manager object.
         *
         * @method createManager
         * @param callback {Function ( {Manager} )}
         */
        createManager:  function(callback) {
            backendBridge.call('OnlineAccounts.createManager'
                               , []
                               , callback);
        },

        /**
         * Creates a ProviderModel object.
         *
         * @method createProviderModel
         * @param callback {Function ( {ProviderModel} )}
         */
        createProviderModel:  function(callback) {
            backendBridge.call('OnlineAccounts.createProviderModel'
                               , []
                               , callback);
        },

        api: {
            /**
             * Gets the access token for a given set of filtering parameters.
             * 
             * @method getAccessTokenFor
             * @param service If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param provider If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param accountId If set, the access token will be retrieved for the accounts that correspond to that specific service.
             *                  It is used when multiple accounts are found, otherwise the first account is selected.
             * @param callback {Function({Object(error:, authenticated: {Bool}, data: )})} Callback that receives the result or null
             */
            getAccessTokenFor: function(service, provider, accountId, callback) {
                backendBridge.call('OnlineAccounts.getAccessTokenFor'
                                   , [service, provider, accountId]
                                   , callback);
            },

            /**
             * Gets the account information for a given set of filtering parameters.
             *
             * @method getAccountsInfoFor
             * @param service If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param provider If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param callback {Function({List {Object(displayName:, accountId: {Bool} )} })} Callback that receives the result or null
             */
            getAccountsInfoFor: function(service, provider, callback) {
                backendBridge.call('OnlineAccounts.getAccountsInfoFor'
                                   , [service, provider]
                                   , callback);
            },

            /**
             * Gets the account that corresponds to a given id.
             *
             * @method getAccountById
             * @param accountId The account id.
             * @param callback {Function({Account})} Callback that receives the result or null
             */
            getAccountById: function(accountId, callback) {
                backendBridge.call('OnlineAccounts.getAccountById'
                                   , [accountId]
                                   , callback);
            },
        },


        // Internal

        /**
         * @private
         *
         */
        createObjectWrapper: function(objectType, objectId, content) {
            var Constructor = _constructorFromName(objectType);
            return new Constructor(objectId, content);
        },
    };
};


