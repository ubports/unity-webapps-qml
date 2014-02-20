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
    function AccountService(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'AccountService', id);
    };
    AccountService.prototype = {
        // properties
        accountId: function(callback) {
            this._proxy.call('accountId', [], callback);
        },

        enabled: function(callback) {
            this._proxy.call('enabled', [], callback);
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

        oa.api.getAccountsInfoFor(null, 'facebook', function(result) { [...] });
 */
   return {

        api: {
            /**
             * Gets the access token for a given set of filtering parameters.
             * 
             * @method api.getAccessTokenFor
             * @param service {String} If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param provider {String} If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param accountId {Integer} If set, the access token will be retrieved for the accounts that correspond to that specific service.
             *                  It is used when multiple accounts are found, otherwise the first account is selected.
             * @param callback {Function(Object(error:, authenticated: Bool, data: ))} Callback that receives the result or null
             * 
             * @example
             
             var api = external.getUnityObject(1.0);
             var oa = api.OnlineAccounts;

             oa.api.getAccessTokenFor(null, 'facebook', null, function(result) {
               if (result.error) {
                 console.log("Error: " + result.error);
                 return;
               }
               console.log("Authenticated: "
                             + result.authenticated
                             + ", token: "
                             + result.data);
             });
             */
            getAccessTokenFor: function(service, provider, accountId, callback) {
                backendBridge.call('OnlineAccounts.getAccessTokenFor'
                                   , [service, provider, accountId]
                                   , callback);
            },

            /**
             * Gets the account information for a given set of filtering parameters.
             *
             * @method api.getAccountsInfoFor
             * @param service {String} If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param provider {String} If set, the access token will be retrieved for the accounts that correspond to that specific service.
             * @param callback {Function(List of Object(displayName:, accountId: Bool, providerName: String, serviceName: String, enabled: Bool))} Callback that receives the result or null
             *
             * @example
               var api = external.getUnityObject(1.0);
               var oa = api.OnlineAccounts;
             
               oa.api.getAccountsInfoFor(null, 'facebook', function(result) {
                 for (var i = 0; i < result.length; ++i) {
                   console.log("name: " + result[i].displayName
                               + ', id: ' + result[i].accountId
                               + ', providerName: ' + result[i].providerName
                               + ', serviceName: ' + result[i].serviceName
                               + ', enabled: ' + (result[i].enabled ? "true" : "false")
                               );
                 }               
               });

             */
            getAccountsInfoFor: function(service, provider, callback) {
                backendBridge.call('OnlineAccounts.getAccountsInfoFor'
                                   , [service, provider]
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


