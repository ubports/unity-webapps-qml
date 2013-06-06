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

    /*!
        \param parentItem
        \param bindeeProxies
        \param backends
        \param userscriptContent
     */
    function _UnityWebApps(parentItem, bindeeProxies, backends, userscripts) {
        this._injected_unity_api_path = Qt.resolvedUrl('unity-webapps-api.js');
        this._bindeeProxies = bindeeProxies;
        this._backends = backends;
        this._userscripts = userscripts;

        this._bind();
    };

    _UnityWebApps.prototype = {
        _bind: function () {
            var self = this;
            self._bindeeProxies.loadingStartedConnect(function () {
                var scripts = [self._injected_unity_api_path];
                for(var i = 0; i < self._userscripts.length; ++i)
                    scripts.push(Qt.resolvedUrl(self._userscripts[i]));
                self._bindeeProxies.injectUserScripts(scripts);
            });
            self._bindeeProxies.messageReceivedConnect(function (message) {
                if (!message)
                    return;
                self._onMessage(message);
            });
        },

        //FIXME: api design
        _onMessage: function(msg) {
            if (!this._isValidWebAppsMessage(msg)) {
                //FIXME(AAU): proper error handling
                return;
            }

            this._log ('WebApps received message: ' + json.stringify(msg));

            var self = this;
            var args = json.parse(msg.args);
            args = args.map (function (arg) { return self._wrapCallbackIds (arg); });

            // Actuall call, e.g. 'Notification.showNotification("a","b")
            // being reduces to successive calls to associated objects:
            // Notification, showNotification
            //
            // TODO add proper error handling
            this._dispatchApiCall(msg.name, args);

            return true;
        },

        _makeWebpageCallback: function (callbackid) {
            var self = this;
            return function () {
                var sendToPage = self._bindeeProxies.sendToPage;
                // TODO add validation higher
                if (!sendToPage || !(sendToPage instanceof Function))
                    return;
                sendToPage(JSON.stringify(UnityWebAppsUtils.formatUnityWebappsCallbackCall(callbackid, Array.prototype.slice.call(arguments))));
            };
        },

        /**
         * Wraps callback ids in proper callback that dispatch to the
         * webpage thru a proper event
         *
         */
        _wrapCallbackIds: function (obj) {
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

        _dispatchApiCall: function (name, args) {
            var names = name.split('.');
            var reducetarget = this._backends;

            try {
              // Assumes that we are calling a 'callable' from a succession of objects
              names.reduce (
                function (prev, cur) {
                  return typeof prev[cur] == "function" ? prev[cur].bind(prev) : prev[cur];
                }, reducetarget).apply (null, args);
            } catch (err) {
              this._log('Error while dispatching call to ' + names.join('.') + ': ' + err);
            }
        },

        _log: function (msg) {
            console.debug(msg);
        },

        _isValidWebAppsMessage: function(message) {
            return message != null && message.target && message.target === 'unity-webapps-call' && message.name && message.args;
        }
    };

    return _UnityWebApps;
}) ();


