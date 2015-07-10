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

import QtQuick 2.0
import Ubuntu.UnityWebApps 0.1 as UbuntuUnityWebApps
import "UnityWebApps.js" as UnityWebAppsJs
import "UnityWebAppsUtils.js" as UnityWebAppsJsUtils
import "UnityWebAppsBackendComponents.js" as UnityBackends

import "./bindings/runtime-api/backend/runtime-api.js" as RuntimeApiBackend
import "./bindings/alarm-api/backend/alarm-api.js" as AlarmApiBackend
import "./bindings/content-hub/backend/content-hub.js" as ContentHubApiBackend
import "./bindings/online-accounts/backend/online-accounts.js" as OnlineAccountsApiBackend
import "./bindings/online-accounts/backend/online-accounts-client.js" as OnlineAccountsClientApiBackend
import "./bindings/download-manager/backend/download-api.js" as DownloadApiBackend
import "./bindings/tools/backend/tools.js" as ToolsApiBackend

/*!
    \qmltype UnityWebApps
    \inqmlmodule Ubuntu.UnityWebApps 0.1
    \ingroup ubuntu
    \brief The QML component that binds to a QML WebView and exposes the Unity WebApps
        API to it's javascript.

    Examples:
    \qml
        UnityWebApps {
            id: webapps
            name: "MyApp"
            bindee: webView
        }
    \endqml

    On the page's javascript side, an event is being sent to the document when the API is exposed
    and ready to be used: "ubuntu-webapps-api-ready".

    So a typical pattern for the page's javascript could be:

    \code
        function init() {
            // The Unity APIs are available throuhg external.getUnityObject
            var Unity = external.getUnityObject(1);
        }
        if (!external.getUnityObject) {
            document.addEventListener ("ubuntu-webapps-api-ready", function () {
                    init();
                });
        }
    \endcode

*/
Item {
    id: webapps

    /*!
      \qmlproperty string UnityWebApps::name
      Holds the name of the application that is run as a WebApp. It should be used
        in conjunction with a model. The 'name' property is then used while looking up
        for the webapp in the set of locally installed ones.

      The name should not change once it has been set. (?)
      */
    property string name: ""


    /*!
      \qmlproperty string UnityWebApps::bindee
      Holds a reference to the object that webapps are to be injected in.

      The UnityWebApps QML component expects any bindee to duck-type with
        the following IDL signature:

        \code
            method getUnityWebappsProxies()
        \endcode

        that should return a BindeeExports:

        \code
            interface BindeeExports {
                method injectUserScripts(string userScriptUrls);
                method sendToPage(string message);
                method loadingStartedConnect(Callback onLoadingStarted);
                method messageReceivedConnect(Callback onMessageReceived);
                method navigateTo(string url);
            }
        \endcode

      */
    property var bindee


    /*!
      \qmlproperty UnityWebappsAppModel UnityWebApps::model

      An optional model used in conjunction with the 'name' property
        as a location for looking up the desired webapps.

     */
    property var model: null


    /*!
      \qmlproperty bool UnityWebApps::injectExtraUbuntuApis

     */
    property alias injectExtraUbuntuApis: settings.injectExtraUbuntuApis

    /*!
      \qmlproperty bool UnityWebApps::injectExtraContentShareCapabilities

     */
    property alias injectExtraContentShareCapabilities: settings.injectExtraContentShareCapabilities

    /*!
      \qmlproperty bool UnityWebApps::requiresInit

     */
    property alias requiresInit: settings.requiresInit

    /*!
      \qmlproperty UnityActions.Context UnityWebApps::actionsContext

      The actions context that this element can reach out to for
      additional actions.

     */
    property var actionsContext: null

    /*!
      \qmlproperty string UnityWebApps::customBackendProxies

      Used only for testing.
      Allows optional (not the default ones) mocked backends to be used.

     */
    property var customBackendProxies: null

    /*!
      \qmlproperty string UnityWebApps::_opt_clientApiFileUrl

      Used only for testing.
      Allows optional (not the default ones) client api to be used instead of the default one.

     */
    property string customClientApiFileUrl: ""

    /*!
      \qmlproperty string UnityWebApps::_opt_homepage

      Used only for testing.
      Allows an optional a homepage to be specified when running a local http server.

     */
    property string _opt_homepage: ""


    /*!
     \qmlsignal UnityWebApps::userScriptsInjected()

     This signal is emitted when the component has completed its initialization and
     the userscripts have been injected into the binded webview.
     */
    signal userScriptsInjected()

    /*!
     \qmlsignal UnityWebApps::apiCallDispatched()

     This signal is emitted when an api call is being dispatched to the backend.
     */
    signal apiCallDispatched(string type, string name)

    Settings {
        id: settings
        injectExtraContentShareCapabilities: name && name.length && name.length !== 0
    }


    /*!
      \internal

      PRIVATE FUNCTION: __bind

      Binds a given webapp object with something that
      is expected to support the following calls:

       \code
            interface BindeeExports {
                method injectUserScripts(string userScriptUrls);
                method sendToPage(string message);
                method loadingStartedConnect(Callback onLoadingStarted);
                method messageReceivedConnect(Callback onMessageReceived);
                method navigateTo(string url);
            }
        \endcode

       The bindee should not be null.
    */
    function __bind(bindee, webappUserscripts) {
        if (!bindee) {
            console.debug('__bind: ERROR Invalid bindee when trying to bind the QML WebApps component')
            return;
        }

        if (internal.instance) {
            console.debug('__bind: ERROR Instance already set')
            return;
        }

        if (!__isValidBindee(bindee)) {
            console.debug('__bind: ERROR not a valid bindee')
            return;
        }

        // Get an instance of the bridging interface that
        //  the bindee is supposed to provide.

        var bindeeProxies = bindee.getUnityWebappsProxies();
        if (!__areValidBindeeProxies(bindeeProxies)) {
            console.debug('__bind: ERROR bindee proxies not valid')
            return;
        }
        var instance =
            new UnityWebAppsJs.UnityWebApps(
                    webapps,
                    bindeeProxies,
                    __getPolicyForContent(settings),
                    customClientApiFileUrl && customClientApiFileUrl.length !== 0
                      ? customClientApiFileUrl
                      : 'unity-webapps-api.js',
                    function(info) {
                        apiCallDispatched(info.type, info.name)
                    });

        internal.instance = instance;

        if (internal.backends)
            internal.instance.setBackends(internal.backends)

        userScriptsInjected();
    }

    /*!
      \internal

     */
    function __createBackendsIfNeeded() {
        var backends;
        if (customBackendProxies != null)
            backends = customBackendProxies;
        else {
            backends = __makeBackendProxies();
        }
        return backends;
    }

    /*!
      \internal

     */
    function __initBackends() {
        if (customBackendProxies || __isValidWebAppName(webapps.name) || injectExtraUbuntuApis) {
            internal.backends = __createBackendsIfNeeded();
            if (internal.backends && internal.instance)
                internal.instance.setBackends(internal.backends);
        }
    }

    /*!
      \internal

      PRIVATE FUNCTION: __isValidBindee
     */
    function __isValidBindee(bindee) {
        var properties = [{'name': 'getUnityWebappsProxies', 'type': 'function'}];
        var validator = UnityWebAppsJsUtils.makePropertyValidator(properties);
        return validator(bindee);
    }

    /*!
      \internal

      PRIVATE FUNCTION: __areValidBindeeProxies

      Validates the bindeed proxies as exported by getUnityWebappsProxies
     */
    function __areValidBindeeProxies(proxies) {
        var properties = [{'name': 'sendToPage', 'type': 'function'},
                {'name': 'loadingStartedConnect', 'type': 'function'},
                {'name': 'messageReceivedConnect', 'type': 'function'},
                {'name': 'injectUserScripts', 'type': 'function'},
                {'name': 'navigateTo', 'type': 'function'}];

        var validator = UnityWebAppsJsUtils.makePropertyValidator(properties);
        return validator(proxies);
    }

    /*!
      \internal

      PRIVATE FUNCTION: __unbind
     */
    function __unbind() {
        if (internal.instance)
            internal.instance.cleanup();
        internal.instance = null;
    }

    /*!
      \internal

      Validates that an installed webapp has been found in the current model (if any) given the
       webapp name.
     */
    function __isValidWebAppForModel(webappName) {
        return __isValidWebAppName(webappName) && model != null && model.exists && model.exists(webappName);
    }

    /*!
      \internal
      Gathers the webapps userscript associated with the webapp whose
      name is passed as param.

      Returns the list of URIs for the associated scripts to be injected
    */
    function __gatherWebAppUserscriptsIfAny(webappName) {
        var userscripts = [];
        if (__isValidWebAppForModel(webappName)) {
            var idx = model.getWebappIndex(webappName);
            userscripts = model.data(idx, UbuntuUnityWebApps.UnityWebappsAppModel.Scripts);

            // FIXME: hack
            userscripts = userscripts.map(function (script) { return 'file://' + script; });
        }
        return userscripts;
    }

    /*!
      \internal

      If the component has been binded to a proper bindee (exposes proper interface)
      and the webapps bridge has been initialized, this make sure that the bindee
      is requested to navigate to a given 'homepage' url for the associated
      webapp.
    */
    function __navigateToWebappHomepageInBindee(webappName) {
        if (__isValidWebAppForModel(webappName) && internal.instance) {
            var idx = model.getWebappIndex(webappName);
            var homepage = model.data(idx, UbuntuUnityWebApps.UnityWebappsAppModel.Homepage);

            if (!homepage || homepage.length === 0) {
                homepage = _opt_homepage;
            }
            console.debug('Requesting the bindee to navigate to homepage: ' + homepage);

            // We recreate a bindee object, but we call any function that requires
            //  come custom cleanup (signals), so we are ok.
            var bindeeProxies = bindee.getUnityWebappsProxies();
            bindeeProxies.navigateTo(homepage);
        }
    }

    /*!
      \internal

      If running as a known webapp, setup the scripts are that to be injected
      (and provided by the model), and navigate to the proper homepage.
     */
    function __setupNamedWebappEnvironment() {
        if (__isValidWebAppForModel(name)) {
            if (internal.instance) {
                var userScripts = __gatherWebAppUserscriptsIfAny(name);
                internal.instance.injectWebappUserScripts(userScripts);
            }
            __navigateToWebappHomepageInBindee(name);
        }
    }

    Component.onCompleted: {
        if (model) {
            if (model.providesSingleInlineWebapp() && webapps.name.length === 0) {
                webapps.name = model.getSingleInlineWebappName();
            }
            __setupNamedWebappEnvironment();
        }
    }

    onCustomBackendProxiesChanged: __initBackends()

    /*!
      \internal

     */
    onModelChanged: {
        if (model) {
            model.modelContentChanged.connect(__setupNamedWebappEnvironment)
        }
    }

    /*!
      \internal

     */
    onBindeeChanged: {
        // cleanup old refs & go
        webapps.__unbind();

        if (bindee != null) {
            webapps.__bind(bindee);
            webapps.__initBackends();

            // if we are running as a named webapp
            __setupNamedWebappEnvironment();
        }
    }

    /*!
      \internal

     */
    onNameChanged: {
        __initBackends();

        // if we are running as a proper named webapp
        __setupNamedWebappEnvironment();
    }

    /*!
      \internal

     */
    QtObject {
        id: internal
        property var instance: null
        property var backends: null
    }


    /*!
      \internal

     */
    function __isValidWebAppName(name) {
        return name != null && typeof(name) === 'string' && name != "";
    }


    /*!
      \internal

     */
    function __injectResourceIfExtraApisAreEnabled(getResourceFunc) {
        if (getResourceFunc && typeof getResourceFunc === 'function' && injectExtraUbuntuApis) {
            return getResourceFunc();
        }
        return null;
    }

    /*!
      \internal

     */
    function __getPolicyForContent(settings) {
        function PassthroughPolicy() {};
        PassthroughPolicy.prototype.allowed = function(signature) {
            return true;
        };

        var BASIC_WEBAPPS_ALLOWED_APIS = ["init"];
        function RestrictedPolicy(restrictions) {
            this.restrictions = restrictions || BASIC_WEBAPPS_ALLOWED_APIS;
        };
        RestrictedPolicy.prototype.allowed = function(signature) {
            return this.restrictions.some(function(e) { return signature.match(e); });
        };
        RestrictedPolicy.prototype.add = function(signature) {
            if (! this.restrictions.some(function(e) { return e === signature; })) {
                this.restrictions.push(signature);
            }
        };

        if (settings.injectExtraUbuntuApis)
            return new PassthroughPolicy();

        var policy = new RestrictedPolicy(['init',
                                           'addAction',
                                           'clearAction',
                                           'clearActions',
                                           'acceptData',
                                           'Launcher.*',
                                           'Notification.*',
                                           'Launcher.*',
                                           'MediaPlayer.*',
                                           'MessagingIndicator.*']);
        if (settings.injectExtraContentShareCapabilities) {
            policy.add("launchEmbeddedUI");
            policy.add("ContentHub.onShareRequested");
            policy.add("ToolsApi.getHmacHash");
            policy.add("ToolsApi.sendHttpRequest");
        }
        return policy;
    }

    /*!
      \internal

      PRIVATE FUNCTION: __makeBackendProxies

      Binds the API dispatched calls to the Unity backends.

      TODO move elsewhere (in js file)
     */
    function __makeBackendProxies () {
        var initialized = settings.requiresInit ? false : true;

        function getWrappedJsCallback(jscallback) {
            var callback = Qt.createQmlObject('import Ubuntu.UnityWebApps 0.1 as Backends; Backends.UnityWebappsCallback { }', bindee);
            callback.onTriggered.connect(jscallback);
            return callback;
        };

        function isValidInitCall(params) {
            if (! params)
                return false;

            if (params.__unity_webapps_hidden && params.__unity_webapps_hidden.local)
                return true;

            if (! params.__unity_webapps_hidden || ! params.__unity_webapps_hidden.hostname) {
                console.debug('Cannot find hidden initialization param');
                return false;
            }
            if ( ! params.domain || typeof(params.domain) !== 'string' || params.domain.length === 0) {
                console.debug('Cannot find a "domain" property');
                return false;
            }

            return params.__unity_webapps_hidden.hostname.indexOf(params.domain) !== -1;
        };

        UnityBackends.clearAll();
        UnityBackends.createBackendDelegate(webapps);

        return {
            init: function (params) {
                if (! isValidInitCall(params)) {
                    return;
                }

                function callOnInitScriptFunc() {
                    if (params.onInit && typeof(params.onInit) === 'function') {
                        params.onInit();
                    }
                }

                if ( ! initialized) {
                    // The 'name' property takes over the params.name property
                    //  if any is set.
                    var webappName = name ? name : params.name;

                    // We should be all set & ready for the backends
                    UnityBackends.clearAll();
                    UnityBackends.createAllWithAsync(webapps,
                                                     {name: webappName, displayName: params.name},
                                                     internal.instance ? internal.instance.proxies() : null);

                    UnityBackends.signalOnBackendReady("base", function () {

                        var base = UnityBackends.get("base");
                        function onInitCompleted(success) {
                            console.debug('Received initCompleted signal, status: ' + success);

                            base.initCompleted.disconnect(onInitCompleted);
                            if (success) {
                                initialized = true;
                                callOnInitScriptFunc();
                            }
                        };

                        base.initCompleted.connect(onInitCompleted);

                        var isLocal = params.__unity_webapps_hidden && params.__unity_webapps_hidden.local;
                        var url = params.__unity_webapps_hidden && params.__unity_webapps_hidden.url
                                ? params.__unity_webapps_hidden.url : "";
                        base.init(webappName, url, isLocal, params);
                    });
                }
                else {
                    callOnInitScriptFunc();
                }
            },

            addAction: function(actionName, onActionInvoked) {
                if (!initialized)
                    return;
                // hud add action
                UnityBackends.get("hud").addAction(actionName, onActionInvoked);
            },

            clearAction: function(actionName) {
                if (!initialized)
                    return;
                // hud remove action
                UnityBackends.get("hud").clearAction(actionName);
            },

            clearActions: function() {
                if (!initialized)
                    return;
                // hud remove all action
                UnityBackends.get("hud").clearActions();
            },

            launchEmbeddedUI: function(name, callback, params) {
                if (!model || !webapps || !webapps.name) {
                    console.error("launchEmbeddedUI: could not find a valid webapp model or webapp name");
                    return;
                }

                var path = model.path(webapps.name);
                if (!path || path.length === 0) {
                    console.error("launchEmbeddedUI: Invalid or empty webapp path name");
                    return;
                }

                var backendDelegate = UnityBackends.backendDelegate;

                var parentItem = backendDelegate.parentView();
                if (!parentItem || !parentItem.visible || !parentItem.height || !parentItem.width) {
                    console.error("launchEmbeddedUI: Cannot launch the embedded UI, invalid or malformed parent item: " + parentItem);
                    callback({result: "cancelled"});
                    return;
                }

                var p = parentItem.parent ? parentItem.parent : parentItem

                var uicomponent;
                function onCreated() {
                    var args = {}
                    for (var k in params) {
                        if (params.hasOwnProperty(k)) {
                            args[k] = params[k]
                        }
                    }

                    // For backward compatibility
                    if (params.hasOwnProperty("fileToShare") &&
                            typeof(params.fileToShare) === 'object' &&
                            params.fileToShare.hasOwnProperty("url")) {
                        args.fileToShare = params.fileToShare.url
                    }

                    args.visible = true
                    var uiobject = uicomponent.createObject(p, args);
                    if ( ! uiobject.onCompleted) {
                        console.error("launchEmbeddedUI: The local UI component to be launched does not expose a mandatory 'completed' signal");
                        uiobject.destroy();
                        return;
                    }
                    function _onCompleted(data, onResourceUploadedCallback) {
                        p.visible = true;
                        uiobject.onCompleted.disconnect(_onCompleted);
                        callback(data, onResourceUploadedCallback);
                    }
                    uiobject.onCompleted.connect(_onCompleted);
                };

                var uicomponent = Qt.createComponent(path + "/" + name + ".qml");
                if (uicomponent.status === Component.Ready)
                    onCreated()
                else
                    uicomponent.statusChanged.connect(onCreated)
            },

            Notification: {
                showNotification: function (summary, body, iconUrl) {
                    if (!initialized)
                        return;
                    //TODO: fix that underterministic crap ("notify" being badly independantly
                    // checked from the others)
                    UnityBackends.signalOnBackendReady("notify", function () {
                        UnityBackends.get("notify").show(summary, body, iconUrl);
                    });
                }
            },

            MessagingIndicator: {
                showIndicator: function (name, properties) {
                    if (!initialized)
                        return;

                    UnityBackends.get("messaging").showIndicator(String(name));

                    for (var i in properties) {
                        if (i === "time") {
                            UnityBackends.get("messaging").setProperty(String(name), i, UnityWebAppsJsUtils.toISODate(properties[i]));
                        }
                        else if (i === "count") {
                            UnityBackends.get("messaging").setProperty(String(name), i, String(Number(properties[i])));
                        }
                        else if (i === "callback") {
                            UnityBackends.get("messaging").setProperty(String(name), i, getWrappedJsCallback (properties[i]));
                        }
                        else {
                            UnityBackends.get("messaging").setProperty(String(name), i, properties[i]);
                        }
                    }
                },
                clearIndicator: function (name) {
                    if (!initialized)
                        return;
                    UnityBackends.get("messaging").clearIndicator(name);
                },
                clearIndicators: function () {
                    if (!initialized)
                        return;
                    UnityBackends.get("messaging").clearIndicators();
                },
                addAction: function (name, onActionInvoked) {
                    if (!initialized)
                        return;

                    var id = UnityBackends.get("base").addIndicatorAction(name);
                    UnityBackends.get("indicator-actions").addAction(name, onActionInvoked, id);
                },
            },

            MediaPlayer: {
                init: function () {
                    console.debug('MediaPlayer.init is deprecated');
                },
                setTrack: function (infos) {
                    if (!initialized)
                        return;

                    var album = infos.album || '';
                    var artist = infos.artist || '';
                    var title = infos.title || '';
                    var artLocation = "";

                    UnityBackends.get("mediaplayer").setTrack(artist, album, title, artLocation);
                },
                onPrevious: function (callback) {
                    UnityBackends.get("mediaplayer").onPrevious(getWrappedJsCallback (callback));
                },
                onNext: function (callback) {
                    UnityBackends.get("mediaplayer").onNext(getWrappedJsCallback (callback));
                },
                onPlayPause: function (callback) {
                    UnityBackends.get("mediaplayer").onPlayPause(getWrappedJsCallback (callback));
                },
                getPlaybackCtate: function (callback) {
                    callback (UnityBackends.get("mediaplayer").getPlaybackState());
                },
                setPlaybackState: function (state) {
                    UnityBackends.get("mediaplayer").setPlaybackState(state);
                },
                setCanGoNext: function (cango) {
                    UnityBackends.get("mediaplayer").setCanGoNext(cango);
                },
                setCanGoPrevious: function (cango) {
                    UnityBackends.get("mediaplayer").setCanGoPrevious(cango);
                },
                setCanPlay: function (canplay) {
                    UnityBackends.get("mediaplayer").setCanPlay(canplay);
                },
                setCanPause: function (canpause) {
                    UnityBackends.get("mediaplayer").setCanPause(canpause);
                },
                __get: function (prop, callback) {
                    if (!initialized)
                        return;

                    if (prop === "can-go-previous") {
                        callback(UnityBackends.get("mediaplayer").getCanGoPrevious());
                    }
                    else if (prop === "can-go-next") {
                        callback(UnityBackends.get("mediaplayer").getCanGoNext());
                    }
                    else if (prop === "can-play") {
                        callback(UnityBackends.get("mediaplayer").getCanPlay());
                    }
                    else if (prop === "can-pause") {
                        callback(UnityBackends.get("mediaplayer").getCanPause());
                    }
                    else if (prop === "track") {
                        callback(UnityBackends.get("mediaplayer").getTrack());
                    }
                }
            },

            OnlineAccounts: OnlineAccountsApiBackend.createOnlineAccountsApi(UnityBackends.backendDelegate),

            Alarm: __injectResourceIfExtraApisAreEnabled(function() {
                return AlarmApiBackend.createAlarmApi(UnityBackends.backendDelegate)
            }),

            ContentHub: ContentHubApiBackend.createContentHubApi(
                            UnityBackends.backendDelegate, webapps),

            RuntimeApi:  __injectResourceIfExtraApisAreEnabled(function() {
                return RuntimeApiBackend.createRuntimeApi(UnityBackends.backendDelegate)
            }),

            DownloadApi:  __injectResourceIfExtraApisAreEnabled(function() {
                return DownloadApiBackend.createDownloadApi(UnityBackends.backendDelegate)
            }),

            ToolsApi: ToolsApiBackend.createToolsApi(UnityBackends.backendDelegate),

            Launcher: {
                setCount: function (count) {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").setCount(count);
                },
                clearCount: function () {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").clearCount();
                },
                setProgress: function (progress) {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").setProgress(progress);
                },
                clearProgress: function () {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").clearProgress();
                },
                setUrgent: function () {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").setUrgent();
                },
                addStaticAction: function (name, url) {
                    if (!initialized)
                        return;

                    if (this.__actionNames[name])
                        this.removeAction(name);
                    var id = UnityBackends.get("base").addStaticAction(name, url);
                    this.__actionNames[name] = id;
                },
                addAction: function (name, ontriggered) {
                    if (!initialized)
                        return;

                    if (this.__actionNames[name])
                        this.removeAction(name);

                    var id = UnityBackends.get("base").addLauncherAction(name);
                    UnityBackends.get("indicator-actions").addAction(name,
                                                                     function () {
                                                                         console.debug(name + " triggered");
                                                                         ontriggered();
                                                                     },
                                                                     id);
                    this.__actionNames[name] = id;
                },
                removeAction: function (name) {
                    if (!initialized)
                        return;

                    if ( ! (name in this.__actionNames))
                        return;

                    UnityBackends.get("base").removeLauncherAction(name, this.__actionNames[name]);
                    UnityBackends.get("indicator-actions").clearAction(name);

                    delete this.__actionNames[name];
                },
                removeActions: function () {
                    if (!initialized)
                        return;

                    UnityBackends.get("base").removeLauncherActions();
                    for (var name in this.__actionNames)
                    {
                        this.removeActions(name);
                    }
                },
                __get: function (prop, callback) {
                    if (!initialized)
                        return;

                    if (prop === "progress") {
                        callback(UnityBackends.get("launcher").getProgress());
                    }
                    else if (prop === "count") {
                        callback(UnityBackends.get("launcher").getCount());
                    }
                },
                __actionNames: {}
            }
        };
    }
}

