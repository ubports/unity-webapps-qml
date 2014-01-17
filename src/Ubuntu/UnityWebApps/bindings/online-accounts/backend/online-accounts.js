function createOnlineAccountsApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.OnlineAccounts';
    var VERSION = 0.1;
 
    function Manager() {
	this._object = backendDelegate.createQmlObject(
	    PLUGIN_URI, VERSION, 'Manager');
    };
    Manager.prototype = {
	_validate: function() {
	    if (! object)
		throw new TypeError("Invalid object null");
	},

	// methods
	createAccount: function(providerName) {
	    this._validate();
	    return this._object.createAccount(providerName);
	},
	loadAccount: function(id) {
	    this._validate();
	    return this._object.loadAccount(id);
	},
    };

    function ProviderModel() {
	this._object = backendDelegate.createQmlObject(
	    PLUGIN_URI, VERSION, 'ProviderModel');
    };
    ProviderModel.prototype = {
	_validate: function() {
	    if (! object)
		throw new TypeError("Invalid object null");
	},

	// QAbtractListModel prototype
	at: function(idx, callback) {
            if (idx >= this.proxy.count || ! this._modelAdaptor) {
                return null;
            }

            var result = {};
            for (var role in this._roles) {
                result[role] = this._modelAdaptor.itemAt(idx, role);
            }

            callback(result);
	}
    };
    
    function AccountServiceModel() {
	this._object = backendDelegate.createQmlObject(
	    PLUGIN_URI, VERSION, 'AccountServiceModel');
    };
    AccountServiceModel.prototype = {
	_validate: function() {
	    if (! object)
		throw new TypeError("Invalid object null");
	},

	// properties
	count: function() {
	    this.validate();
            return this._object.count;
	},

	service: function() {
	    this.validate();
	    return this._object.service;
	},
	setService: function(service) {
	    this.validate();
	    this._object.service = service;
	},	

	provider: function() {
	    this.validate();
            return this._object.provider;
	},
	setProvider: function(provider) {
	    this.validate();
	    this._object.provider = provider;
	},	

	serviceType: function() {
	    this.validate();
	    return this._object.serviceType;
	},
	setServiceType: function(serviceType) {
	    this.validate();
	    this._object.serviceType = serviceType;
	},	

	accountId: function() {
	    this.validate();
	    return this._object.accountId;
	},
	setAccountId: function(accountId) {
	    this.validate();
	    this._object.accountId = accountId;
	},

	// QAbtractListModel prototype
	forEach: function(callback) {
            return this.proxy.call('QAbtractListModel::forEach',
				   callback);
	},
	at: function(idx, callback) {
            return this.proxy.call('QAbtractListModel::at',
				   callback);
	}
    };

    return {
	createAccountServiceModel: function() {
	    return new AccountServiceModel();
	},
	createManager: function() {
	    return new Manager();
	},
	createProviderModel: function() {
	    return new ProviderModel();
	},
    };
}

