function UnityBindingProxy(backend, id, api_data) {
    this._backend = backend;
    this._id = id;
    this._api_data = api_data;
}
UnityBindingProxy.prototype = {
    call: function(method_name, params, callback) {
        this._backend.callObjectMethod(
            this._id,
            this._api_data,
            method_name,
            params,
            callback);
    },
    id: function(name, params) {
        return this._id;
    },
};
