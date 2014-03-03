/**
 * OnlineAccounts is the entry point to online accounts service access.

 * @module OnlineAccounts
 */

function createOnlineAccountsApi(backendBridge) {
    var PLUGIN_URI = 'OnlineAccounts';

/**
 * AccountService.

 * @class AccountService
 * @constructor
 */
    function AccountService(id, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'AccountService', id);

        this._accountId = content && content.accountId
             ? content.accountId : null;
        this._enabled = content && content.enabled
             ? content.enabled : null;
        this._serviceEnabled = content && content.serviceEnabled
             ? content.serviceEnabled : null;
        this._displayName = content && content.displayName
             ? content.displayName : null;
        this._provider = content && content.provider
             ? content.provider : null;
        this._service = content && content.service
             ? content.service : null;
    };
    AccountService.prototype = {
        // properties
        accountId: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('accountId', [], callback);
                return;
            }
            return this._accountId;
        },

        enabled: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('enabled', [], callback);
                return;
            }
            return this._enabled;
        },

        displayName: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('displayName', [], callback);
                return;
            }
            return this._displayName;
        },

        provider: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('provider', [], callback);
                return;
            }
            return this._provider;
        },

        service: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('service', [], callback);
                return;
            }
            return this._service;
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

    function _constructorFromName(className) {
        var constructorPerName = {
            "AccountService": AccountService,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    };
 
/**
 * The OnlineAccounts object.

 * @class OnlineAccounts
 * @constructor
 * 
 * @example

        var api = external.getUnityObject(1.0);
        var oa = api.OnlineAccounts;

        oa.api.getAccounts({'provider': 'facebook'}, function(result) { [...] });
 */
   return {

        api: {
            /**
             * Gets the configured accounts satisfying the given filters.
             *
             * @method api.getAccounts
             * @param filters {Object} A dictionary of parameters to filter the result. The filtering keys are:
             * - application: the ID of a application (see /usr/share/accounts/applications/ or ~/.local/share/accounts/applications/ for a list of the available applications)
             * - provider: the ID of a provider (see /usr/share/accounts/providers/ or ~/.local/share/accounts/providers/ for a list of the available providers)
             * - service: the ID of a service (see /usr/share/accounts/services/ or ~/.local/share/accounts/services/ for a list of the available services)
             *
             * @param callback {Function(List of AccountService objects)} Callback that receives the result or null
             *
             * @example
               var api = external.getUnityObject(1.0);
               var oa = api.OnlineAccounts;
             
               oa.api.getAccounts({'provider': 'facebook'}, function(result) {
                 for (var i = 0; i < result.length; ++i) {
                   console.log("name: " + result[i].displayName()
                               + ', id: ' + result[i].accountId()
                               + ', providerName: ' + result[i].provider().displayName
                               + ', enabled: ' + (result[i].enabled() ? "true" : "false")
                               );
                 }               
               });

             */
            getAccounts: function(filters, callback) {
                backendBridge.call('OnlineAccounts.getAccounts'
                                   , [filters]
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


