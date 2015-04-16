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


.import "UnityWebAppsUtils.js" as UnityWebAppsUtils

//
// sendtoPageFunc: experimental.postMessage
//
// FIXME(AAU): lexical bindings (e.g. the global JSON object) do not seem to be
//  properly bounded when a qml file calls a js closure returned
//  and imported from an external js file. QML bug or developer bug?
//
var UnityWebApps = (function () {

    var json = JSON;

    /**
     * \param parentItem
     * \param bindeeProxies
     * \param accessPolicy
     * \param injected_api_path
     * \param dispatched_callback
     */
    function _UnityWebApps(
            parentItem,
            bindeeProxies,
            accessPolicy,
            injected_api_path,
            dispatched_callback) {
        this._injected_unity_api_path = injected_api_path;
        this._bindeeProxies = bindeeProxies;
        this._backends = null;
        this._accessPolicy = accessPolicy;
        this._callbackManager = UnityWebAppsUtils.makeCallbackManager();
        this._dispatchedCallback = dispatched_callback

        this._bind();
    };

    _UnityWebApps.prototype = {

        cleanup: function() {
            if (this._bindeeProxies.cleanup
                    && typeof(this._bindeeProxies.cleanup) == 'function') {
                this._bindeeProxies.cleanup();
            }
        },

        proxies: function() {
            return this._bindeeProxies;
        },

        injectWebappUserScripts: function(userscripts) {
            if (this._bindeeProxies) {
                this._bindeeProxies.injectUserScripts(
                         userscripts.map(function(script) {
                             return Qt.resolvedUrl(script); }));
            }
        },

        setBackends: function(backends) {
            this._backends = backends;
        },

        /**
         * \internal
         *
         */
        _bind: function () {
            var self = this;
            var cb = this._onMessageReceivedCallback.bind(self);
            self._bindeeProxies.messageReceivedConnect(cb);

            this._injectCoreBindingUserScripts();
        },

        /**
         * \internal
         *
         */
        _injectCoreBindingUserScripts: function () {
            if (this._bindeeProxies) {
                this._bindeeProxies.injectUserScripts(
                         [Qt.resolvedUrl(this._injected_unity_api_path)]);
            }
        },

        /**
         * \internal
         *
         */
        _onMessageReceivedCallback: function (message) {
            if (!message)
                return;
            this._onMessage(message);
        },

        /**
         * \internal
         *
         */
        _onMessage: function(msg) {
            if ( ! this._isValidWebAppsMessage(msg) && ! this._isValidCallbackMessage(msg)) {
                this._log ('Invalid message received: ' + json.stringify(msg));

                return;
            }

            var self = this;
            var args = json.parse(msg.args);
            args = args.map (function (arg) {
                return self._wrapCallbackIds (arg);
            });

            this._dispatch(msg, args);

            return true;
        },


        /**
         * \internal
         *
         */
        _dispatch: function(message, params) {
            var target = message.target;

            //TODO improve dispatch
            if (target === UnityWebAppsUtils.UBUNTU_WEBAPPS_BINDING_API_CALL_MESSAGE) {
                // Actuall call, e.g. 'Notification.showNotification("a","b")
                // being reduces to successive calls to associated objects:
                // Notification, showNotification
                //
                // TODO add proper error handling
                if (message.callback) {
                    var cb = this._wrapCallbackIds (message.callback);
                    params.push(cb);
                }

                var apiCallName = message.name;
                if (this._accessPolicy && this._accessPolicy.allowed && !this._accessPolicy.allowed(apiCallName)) {
                    console.error("Unauthorize API call blocked: " + apiCallName);
                    return;
                }


                this._log ('WebApps API message being dispatch: ' + apiCallName);

                if (this._dispatchedCallback &&
                        typeof(this._dispatchedCallback) === 'function') {
                    this._dispatchedCallback({type: "dispatching", name: apiCallName})
                }

                this._dispatchApiCall (message.name, params);

            } else if (target === UnityWebAppsUtils.UBUNTU_WEBAPPS_BINDING_OBJECT_METHOD_CALL_MESSAGE) {

                var objectid = message.objectid;
                var api_uri = message.api_uri;
                var class_name = message.class_name;
                var method_name = message.name;
                var callback = this._wrapCallbackIds (message.callback);

                console.debug('Dispatching object method call to: '
                              + api_uri
                              + ', method: '
                              + method_name);

                this._dispatchApiCall(api_uri + ".dispatchToObject",
                                      [{args: params,
                                          callback: callback,
                                          objectid: objectid,
                                          class_name: class_name,
                                          method_name: method_name}]);

            } else if (target === UnityWebAppsUtils.UBUNTU_WEBAPPS_BINDING_API_CALLBACK_MESSAGE) {

                var id = message.id;

                if (! id || ! params)
                    return;

                var cbfunc = this._callbackManager.get(id);
                if (!cbfunc || !(cbfunc instanceof Function)) {
                    try {
                        console.log('Invalid callback id: ' + id);
                    }
                    catch (e) {}
                    return;
                }
                cbfunc.apply(null, params);
            }
        },

        /**
         * \internal
         *
         */
        _dispatchApiCall: function (name, args) {
            if ( ! this._backends)
                return;

            var names = name.split('.');
            var reducetarget = this._backends;
            try {
              // Assumes that we are calling a 'callable' from a succession of objects
              var t = names.reduce (
                function (prev, cur) {
                   return (typeof prev[cur] == "function") ?
                                (function(prev, cur) { return prev[cur].bind(prev); })(prev, cur)
                                : prev[cur];
                }, reducetarget);
                t.apply (null, args);

                if (this._dispatchedCallback &&
                        typeof(this._dispatchedCallback) === 'function') {
                    this._dispatchedCallback({type: "called", name: name})
                }

            } catch (err) {
              this._log('Error while dispatching call to ' + names.join('.') + ': ' + err);
            }
        },

        /**
         * \internal
         *
         */
        _makeWebpageCallback: function (callbackid) {
            var self = this;
            return function () {
                // TODO add validation higher
                if (!self._bindeeProxies.sendToPage || !(self._bindeeProxies.sendToPage instanceof Function))
                    return;

                var callback_args = Array.prototype.slice.call(arguments);
                callback_args = callback_args.map (function (arg) {
                    return UnityWebAppsUtils.transformCallbacksToIds(arg, self._callbackManager);
                });

                var message = UnityWebAppsUtils.formatUnityWebappsCallbackCall(callbackid, callback_args);

                self._bindeeProxies.sendToPage(JSON.stringify(message));
            };
        },

        /**
         * \internal
         *
         * Wraps callback ids in proper callback that dispatch to the
         * webpage thru a proper event
         *
         */
        _wrapCallbackIds: function (obj) {
            if ( ! obj)
                return obj;
            if ( ! UnityWebAppsUtils.isIterableObject(obj)) {
                return obj;
            }

            if (obj
                && obj.hasOwnProperty('callbackid')
                && obj.callbackid !== null) {
              return this._makeWebpageCallback (obj.callbackid);
            }

            var ret = (obj instanceof Array) ? [] : {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (UnityWebAppsUtils.isIterableObject (obj[key])) {
                        if (obj[key].callbackid != null) {
                            ret[key] = this._makeWebpageCallback (obj[key].callbackid);
                        }
                        else {
                            ret[key] = this._wrapCallbackIds (obj[key]);
                        }
                    }
                    else {
                        ret[key] = obj[key];
                    }
                }
            }
            return ret;
        },

        /**
         * \internal
         *
         */
        _log: function (msg) {
            try {
                console.debug(msg);
            }
            catch(e) {}
        },

        /**
         * \internal
         *
         */
        _isValidWebAppsMessage: function(message) {
            return message != null &&
                    message.target &&
                    message.target.indexOf('ubuntu-webapps-binding-call') === 0 &&
                    message.name &&
                    message.args;
        },

        /**
         * \internal
         *
         */
        _isValidCallbackMessage: function(message) {
            return message != null &&
                    message.target &&
                    message.target.indexOf('ubuntu-webapps-binding-callback-call') === 0 &&
                    message.args;
        }
    };

    return _UnityWebApps;
}) ();


