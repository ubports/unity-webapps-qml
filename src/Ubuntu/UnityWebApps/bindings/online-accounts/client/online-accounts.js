/**
 * OnlineAccounts is the entry point to online accounts service access.

 * @module OnlineAccounts
 */

function createOnlineAccountsApi(backendBridge) {
    var PLUGIN_URI = 'OnlineAccounts';

/**
 * AccountService represents an instance of a service in an Online Accounts.

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

        /**
         * Retrieves the account's numeric ID; note that all
	 * AccountService objects which work on the same online account will have the same ID.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method accountId
         * @param callback (optional) {Function(String)}
         */
        accountId: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('accountId', [], callback);
                return;
            }
            return this._accountId;
        },

        /**
         * This read-only property tells whether the AccountService is enabled.
	 * An application shouldn't use an AccountService which is disabled
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method enabled
         * @param callback (optional) {Function(String)}
         */
        enabled: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('enabled', [], callback);
                return;
            }
            return this._enabled;
        },

        /**
         * Retrieves The account's display name (usually the user's login or ID).
	 * Note that all AccountService objects which work on the same online account
	 * will share the same display name.
         *
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method displayName
         * @param callback (optional) {Function(String)}
         */
        displayName: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('displayName', [], callback);
                return;
            }
            return this._displayName;
        },

        /**
         * An immutable object representing the provider which provides the account.
	 * 
	 * The returned object will have at least these properties:
	 *   - 'id' is the unique identifier for this provider
	 *   - 'displayName'
	 *   - 'iconName'
	 * 
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method provider
         * @param callback (optional) {Function(String)}
         */
        provider: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('provider', [], callback);
                return;
            }
            return this._provider;
        },

        /**
         * An immutable object representing the service which this AccountService instantiates
	 * 
	 * The returned object will have at least these properties:
	 *   - 'id' is the unique identifier for this service
	 *   - 'displayName'
	 *   - 'iconName'
	 *   - 'serviceTypeId' identifies the provided service type
	 * 
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method service
         * @param callback (optional) {Function(String)}
         */
        service: function(callback) {
            if (callback && typeof(callback) === 'function') {
                this._proxy.call('service', [], callback);
                return;
            }
            return this._service;
        },

        // methods

        /**
         * Perform the authentication on this account.
	 * 
	 * The callback will be called with the authentication result object which will have
	 * these properties:
	 *   - 'error': error message if the authentication was a failure
	 *   - 'authenticated': boolean value that identifies if the operation was a success
	 *   - 'data': Object with the data returned by the authentication process. An 'AccessToken' property can be usually found (when it applies) with the OAuth access token.
         * 
         * If the callback parameter is not set, the current "local" value is retrieved.
         *
         * @method authenticate
         * @param callback {Function(Object)}
         */
        authenticate: function(callback) {
            this._proxy.call('authenticate', [callback]);
        },

        // extras

        /**
         * Destroys the remote object. This proxy object is not valid anymore.
         *
         * @method destroy
         */
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


