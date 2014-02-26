function UnityBindingBridge(callbackManager) {
    this._proxies = {};
    this._last_proxy = 0;
    this._callbackManager = callbackManager;
    this._bindingApi = null;
    this._startMessagePump();
};
UnityBindingBridge.prototype = {
    /**
     * Calls a plain raw API function.
     *
     * @method call
     * @param
     */
    call: function(method_name, args, callback) {
        var self = this;
        var _args = JSON.stringify(args.map (function (arg) {
            return self._transformCallbacksToIds(arg);
        }));
        this._sendToBackend(
            JSON.stringify({target: "ubuntu-webapps-binding-call",
                            name: method_name,
                            args: _args,
                            callback: callback ?
                            this._transformCallbacksToIds(callback)
                            : null}));
    },

    /**
     *
     *
     * @method setBindingApi
     * @param
     */
    setBindingApi: function(bindingApi) {
        this._bindingApi = bindingApi;
    },

    /**
     *
     *
     * @method isObjectProxyInfo
     * @param
     */
    isObjectProxyInfo: function(info) {
        return 'type' in info &&
            info.type === 'object-proxy' &&
            'apiid' in info &&
            'objecttype' in info &&
            'objectid' in info;
    },

    /**
     *
     *
     * @method
     * @param
     */
    createRemoteObject: function(plugin_uri, class_name, objectid) {
        var id = objectid ?
            objectid
            : this._generateProxyIdFor(plugin_uri, class_name);
        return new UnityBindingProxy(this,
                                     id,
                                     {uri: plugin_uri,
                                      class_name: class_name});
    },

    /**
     * @method
     * @param
     */
    callObjectMethod: function(objectid,
                               api_data,
                               method_name,
                               params,
                               callback) {
        params = params || [];
        var self = this;

        var args = JSON.stringify(params.map (
            function (param) {
                return self._transformCallbacksToIds(param);
            }));

        this._sendToBackend(
            JSON.stringify({target: "ubuntu-webapps-binding-call-object-method",
                            objectid: objectid,
                            name: method_name,
                            api_uri: api_data.uri,
                            class_name: api_data.class_name,
                            args: args,
                            callback: callback ?
                            this._transformCallbacksToIds(callback)
                            : null}));
    },

    /**
     * @internal
     */
    _generateProxyIdFor: function(uri, object_name) {
        var candidate = uri +
            object_name +
            this._last_proxy_id;

        while (this._proxies[candidate] != undefined) {
            ++this._last_proxy_id;
            candidate = uri + object_name + this._last_proxy_id;
        }

        return candidate;
    },

    /**
     * @internal
     */
    _startMessagePump: function() {
        var self = this;
        navigator.qt.onmessage = function (event) {
            var message = JSON.parse(event.data);

            if (isUbuntuBindingCallbackCall (message)) {
                try {
                    self._dispatchCallbackCall (message.id, message.args);
                }
                catch(e) {
                    console.log('Error while dispatching callback call: ' + e)
                }
            }
            else {
                try {
                    console.log('Unknown message received: '
                                + JSON.stringify(message));
                }
                catch(e) {}
            }
        }
    },

    /**
     * @internal
     */
    _dispatchCallbackCall: function(id, args) {
        if (! id || ! args)
            return;

        var cbfunc = this._callbackManager.get(id);
        if (!cbfunc || !(cbfunc instanceof Function)) {
            try {
                console.log('Invalid callback id: ' + id);
            }
            catch (e) {}
            return;
        }

        // actual callback call
        var targs = this._translateArgs(args);
        cbfunc.apply(null, targs);
    },

    /**
     * @internal
     */
    _translateArgs: function(args) {
        var _args = args || [];
        var self = this;
        _args = _args.map(function(arg) {
            if (isUbuntuBindingObjectProxy(arg)) {
                var narg = self._wrapObjectProxy(arg.apiid,
                                                 arg.objecttype,
                                                 arg.objectid,
                                                 arg.content);
                return narg;
            }
            else if (arg instanceof Array) {
                return self._translateArgs(arg);
            }

            return arg;
        });
        return _args;
    },

    /**
     * @internal
     */
    _wrapObjectProxy: function(apiId, objectType, objectId, content) {
        if (this._bindingApi && this._bindingApi[apiId] != null) {
            var wrapper = this._bindingApi[apiId]
                .createObjectWrapper(objectType, objectId, content);
            return wrapper;
        }
        return null;
    },

    /**
     * @internal
     */
    _sendToBackend: function(data) {
        navigator.qt.postMessage(data);
    },

    /**
     * @internal
     */
    _transformToIdIfNecessary: function(obj) {
        var ret = obj;
        if (obj instanceof Function) {
            var id = this._callbackManager.store(obj);
            ret = {callbackid: id};
        }
        return ret;
    },

    /**
     * @internal
     */
    _transformCallbacksToIds: function(obj) {
        var self = this;
        if ( ! isIterableObject(obj)) {
            return self._transformToIdIfNecessary (obj);
        }
        var ret = (obj instanceof Array) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] instanceof Function) {
                    var id = self._callbackManager.store(obj[key]);
                    ret[key] = {callbackid: id};
                }
                else if (isIterableObject (obj[key])) {
                    ret[key] = self._transformCallbacksToIds (obj[key]);
                }
                else {
                    ret[key] = obj[key];
                }
            }
        } // for (var key
        return ret;
    },
};
