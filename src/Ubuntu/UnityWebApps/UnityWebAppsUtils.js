/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of UnityWebappsQML.
 *
 * UnityWebappsQML is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * UnityWebappsQML is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

.pragma library

//
// \brief Creates a simple proxy object that bridges a UnityWebapps component with a given webview.
//
// The UnityWebApps component does not reach out directly to a webview but expects something that
//  provides a simple interface of needed methods/functions. For the regular case though (binding
//  to an existing webview) writing the interface manually is tedious, so this tool does it and creates
//  the bridging object to a webview.
//
// \param webViewId
// \param handlers (optional) map of handlers for UnityWebApps events to the external world, supported events:
//                  {
//                      onAppRaised: function () {}
//                  }
//
function makeProxiesForQtWebViewBindee(webViewId, handlers) {

    function SignalConnectionDisposer() {
        this._signalConnectionDisposers = [];
    }
    SignalConnectionDisposer.prototype.disposeAndCleanupAll = function() {
        for(var i = 0; i < this._signalConnectionDisposers.length; ++i) {
            if (typeof(this._signalConnectionDisposers[i]) === 'function') {
                this._signalConnectionDisposers[i]();
            }
        }
        this._signalConnectionDisposers = [];
    };
    SignalConnectionDisposer.prototype.addDisposer = function(d) {
        if ( ! this._signalConnectionDisposers.some(function(elt) { return elt === d; }))
            this._signalConnectionDisposers.push(d);
    };

    return (function (disposer) {

        var _appRaisedHandlers = [];

        var makeSignalDisconnecter = function(sig, callback) {
            return function () {
                sig.disconnect(callback);
            };
        };

        return {
            injectUserScripts: function(userScriptUrls) {
                var scripts = webViewId.experimental.userScripts;
                for (var i = 0; i < userScriptUrls.length; ++i) {
                    scripts.push(userScriptUrls[i]);
                }

                webViewId.experimental.userScripts = scripts;
            },
            navigateTo: function(url) {
                webViewId.url = url;
            },
            sendToPage: function (message) {
                webViewId.experimental.postMessage(message);
            },
            loadingStartedConnect: function (onLoadingStarted) {
                function handler(loadRequest) {
                    // bad bad,...
                    var LoadStartedStatus = 0;
                    if (loadRequest.status === LoadStartedStatus) {
                        onLoadingStarted();
                    }
                };
                webViewId.loadingChanged.connect(handler);

                disposer.addDisposer(makeSignalDisconnecter(webViewId.loadingChanged, handler));
            },
            messageReceivedConnect: function (onMessageReceived) {
                function handler(raw) {
                    onMessageReceived(JSON.parse(raw.data));
                };
                webViewId.experimental.messageReceived.connect(handler);

                disposer.addDisposer(makeSignalDisconnecter(webViewId.experimental.messageReceived, handler));
            },
            // called from the UnityWebApps side
            onAppRaised: function () {
                if (handlers && handlers.onAppRaised)
                    handlers.onAppRaised();
            },
            // called from the UnityWebApps side
            cleanup: function() {
                disposer.disposeAndCleanupAll();
            }
        };
    })(new SignalConnectionDisposer());
}

//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function isIterableObject(obj) {
    if (obj === undefined || obj === null) {
        return false;
    }
    var t = typeof(obj);
    var types = {'string': 0, 'function': 0, 'number': 0, 'undefined': 0, 'boolean': 0};
    return types[t] === undefined;
};

//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function formatUnityWebappsCall(type, serialized_args) {
    return {target: "unity-webapps-call", name: type, args: serialized_args};
}

//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function formatUnityWebappsCallbackCall(callbackid, args) {
    return {target: 'unity-webapps-callback-call', id: callbackid, args: args};
};


//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function isUnityWebappsCallbackCall(params) {
    function _has(o,k) { return (k in o) && o[k] != null; }
    return params != null && _has(params,"target") && _has(params,"args") && _has(params,"id") && params.target === 'unity-webapps-callback-call';
};


//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function makePropertyValidator(props) {
    return function (object) {
        var _hasProperty = function(o, prop, type) { return o != null && (prop in o) && typeof (o[prop]) === type; };
        return !props.some(function (prop) { return !_hasProperty(object, prop.name, prop.type); });
    };
}


//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
var makeCallbackManager = function () {
  // TODO: remove magic name
  var prepend = 'ubuntu-webapps-api';
  var callbacks = {};
  return {
    store: function (callback) {
      if (!callback || !(callback instanceof Function))
        throw "Invalid callback";
      var __gensym = function() { return prepend + Math.random(); };
      var id = __gensym();
      while (undefined !== callbacks[id]) {
        id = __gensym();
      }
      callbacks[id] = callback;
      return id;
    }
    ,
    get: function (id) {
      return callbacks[id];
    }
  };
};


//
//
//
var toISODate = function(d) {
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

    return d.getUTCFullYear() + '-'
        + pad(d.getUTCMonth() + 1) + '-'
        + pad(d.getUTCDate()) + 'T'
        + pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes()) + ':'
        + pad(d.getUTCSeconds()) + 'Z';
};


