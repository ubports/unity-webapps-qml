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
// \brief For a given list of objects returns a function that validates the presence and validity of the
//  specified properties.
//
// \param props list of object properties to validate. Each property is an object w/ a 'name' and 'type' (as in typeof()).
//
function makeProxiesForQtWebViewBindee(webViewId) {
    return {
        injectUserScripts: function(userScriptUrls) {
            var scripts = webViewId.experimental.userScripts;
            for (var i = 0; i < userScriptUrls.length; ++i)
                scripts.push(userScriptUrls[i]);
            webViewId.experimental.userScripts = scripts;
        },
        navigateTo: function(url) {
            webViewId.url = url;
        },
        sendToPage: function (message) {
            webViewId.experimental.postMessage(message);
        },
        loadingStartedConnect: function (onLoadingStarted) {
            webViewId.loadingChanged.connect(function (loadRequest) {
                // bad bad,...
                var LoadStartedStatus = 0;
                if (loadRequest.status === LoadStartedStatus) {
                    onLoadingStarted();
                }
            });
        },
        messageReceivedConnect: function (onMessageReceived) {
            webViewId.experimental.messageReceived.connect(function (raw) {
                onMessageReceived(JSON.parse(raw.data));
            });
        }
    };
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

