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

.pragma library

var UBUNTU_WEBAPPS_BINDING_API_CALL_MESSAGE = "ubuntu-webapps-binding-call";
var UBUNTU_WEBAPPS_BINDING_OBJECT_METHOD_CALL_MESSAGE = "ubuntu-webapps-binding-call-object-method";


function QtWebviewAdapter(webview, disposer) {
    this.webview = webview;
    this.disposer = disposer;
}
QtWebviewAdapter.prototype = {
    injectUserScripts: function(userScriptUrls) {
        var scripts = this.webview.experimental.userScripts;
        for (var i = 0; i < userScriptUrls.length; ++i) {
            scripts.push(userScriptUrls[i]);
        }
        this.webview.experimental.userScripts = scripts;
    },
    sendToPage: function (message) {
        this.webview.experimental.postMessage(message);
    },
    loadingStartedConnect: function (onLoadingStarted) {
        function handler(loadRequest) {
            var LoadStartedStatus = 0;
            if (loadRequest.status === LoadStartedStatus) {
                onLoadingStarted();
            }
        };
        this.webview.loadingChanged.connect(handler);
        this.disposer.addDisposer(makeSignalDisconnecter(this.webview.loadingChanged, handler));
    },
    messageReceivedConnect: function (onMessageReceived) {
        function handler(raw) {
            onMessageReceived(JSON.parse(raw.data));
        };
        this.webview.experimental.messageReceived.connect(handler);
        this.disposer.addDisposer(makeSignalDisconnecter(this.webview.experimental.messageReceived, handler));
    }
}


function OxideWebviewAdapter(webview, disposer) {
    this.webview = webview;
    this.disposer = disposer;
}
OxideWebviewAdapter.prototype = {
    injectUserScripts: function(userScriptUrls) {
        var context = this.webview.context;
        var scripts = [];
        for (var i = 0; i < userScriptUrls.length; ++i) {
            var scriptStart = "import com.canonical.Oxide 0.1 as Oxide; Oxide.UserScript { worldId:";
            var scriptEnd = "};";
            scripts.push(Qt.createQmlObject(scriptStart + '"Unity"; url:' +  userScriptsUrls[i] + scriptEnd, null));
        }
        context.userScripts = scripts;
    },
    sendToPage: function (message) {
        this.webview.rootFrame.sendMessageNoReply("Unity", "host-msg", message);
    },
    loadingStartedConnect: function (onLoadingStarted) {
        function handler(loadEvent) {
            var typeStarted = 0; //LoadEvent.TypeStarted
            if (loadEvent.type == typeStarted) {
                onLoadingStarted();
            }
        }
        this.webview.loadingChanged.connect(handler);
        this.disposer.addDisposer(makeSignalDisconnecter(this.webview.loadingChanged, handler));
    },
    messageReceivedConnect: function (onMessageReceived) {
        function handler(msg, frame) {
            onMessageReceived(JSON.parse(msg.args));
        }
        var script = 'import com.canonical.Oxide 0.1 as Oxide; Oxide.MessageHandler { msgId:"Unity-Message"; worldIds:["Unity"]; };';
        var messageHandler = Qt.createQmlObject(script, null);
        messageHandler.callback = handler;
        this.webview.messageHandlers = [ messageHandler ];
    }
}

function WebviewAdapterFactory(disposer) {
    this.disposer = disposer;
};
WebviewAdapterFactory.prototype = {
    create: function(webview) {
        if (! webview)
            return null
        if (webview.experimental) {
            // assume qtwebkit
            return new QtWebviewAdapter(webview, this.disposer);
        }
        // assume oxide
        return new OxideWebviewAdapter(webview, this.disposer);
    }
};

/**
 * Creates a simple proxy object that bridges
 *  a UnityWebapps component with a given webview.
 *
 * The UnityWebApps component does not reach out directly to
 *  a webview but expects something that provides a simple
 *  interface of needed methods/functions. For the regular
 *  case though (binding to an existing webview) writing the
 *  interface manually is tedious, so this tool does it and creates
 *  the bridging object to a webview.
 *
 * @param webViewId
 * @param handlers (optional) map of handlers for UnityWebApps
 *                            events to the external world, supported events:
 *  {
 *    onAppRaised: function () {}
 *  }
 */
function makeProxiesForQtWebViewBindee(webViewId, eventHandlers) {

    var handlers = eventHandlers && typeof(eventHandlers) === 'object' ? eventHandlers : {};
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

        var makeSignalDisconnecter = function(sig, callback) {
            return function () {
                sig.disconnect(callback);
            };
        };

        var waf = new WebviewAdapterFactory(disposer);
        var proxy = waf.create(webViewId);

        // inject common function

        proxy.navigateTo = function(url) {
            webViewId.url = url;
        };
        // called from the UnityWebApps side
        proxy.onAppRaised = function () {
            if (handlers && handlers.onAppRaised)
                handlers.onAppRaised();
        };
        // called from the UnityWebApps side
        proxy.cleanup = function() {
            disposer.disposeAndCleanupAll();
        };

        return proxy;

    })(new SignalConnectionDisposer());
}


/**
 * For a given list of objects returns a function that validates the presence and validity of the
 *  specified properties.
 *
 * \param props list of object properties to validate. Each
 *   property is an object w/ a 'name' and 'type' (as in typeof()).
 */
function isIterableObject(obj) {
    if (obj === undefined || obj === null) {
        return false;
    }
    var t = typeof(obj);
    var types = {'string': 0, 'function': 0, 'number': 0, 'undefined': 0, 'boolean': 0};
    return types[t] === undefined;
};


/**
 * Format a specific
 *
 * \param props list of object properties to validate. Each
 *   property is an object w/ a 'name' and 'type' (as in typeof()).
 */
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
    return {target: 'ubuntu-webapps-binding-callback-call', id: callbackid, args: args};
};


//
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function isUbuntuBindingCallbackCall(params) {
    function _has(o,k) { return (k in o) && o[k] != null; }
    return params != null
            && (typeof(params) === 'object')
            && _has(params,"target")
            && _has(params,"args")
            && _has(params,"id")
            && params.target === 'ubuntu-webapps-binding-callback-call';
};

/**
 *
 *
 */
function isUbuntuBindingObjectProxy(params) {
    function _has(o,k) { return (k in o) && o[k] != null; }
    return params != null
            && (typeof(params) === 'object')
            && _has(params,"type")
            && params.type === 'object-proxy'
            && _has(params,"apiid")
            && _has(params,"objecttype")
            && _has(params,"objectid");
};

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


