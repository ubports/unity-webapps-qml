import QtQuick 2.0
import Ubuntu.UnityWebApps 0.1 as UbuntuUnityWebApps
import "UnityWebApps.js" as UnityWebAppsJs
import "UnityWebAppsUtils.js" as UnityWebAppsJsUtils
import "UnityWebAppsBackendComponents.js" as UnityBackends

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
      \qmlproperty UnityActions.Context UnityWebApps::actionsContext

      The actions context that this element can reach out to for
      additional actions.

     */
    property var actionsContext: null


    /*!
      \qmlproperty string UnityWebApps::_opt_backendProxies

      Used only for testing.
      Allows optional (not the default ones) mocked backends to be used.

     */
    property var _opt_backendProxies: null


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

        var backends = __createBackendsIfNeeded();

        var instance = new UnityWebAppsJs.UnityWebApps(webapps,
                                                     bindeeProxies,
                                                     backends,
                                                     webappUserscripts);

        internal.backends = backends;
        internal.instance = instance;
    }

    function __createBackendsIfNeeded() {
        var backends;
        if (_opt_backendProxies != null)
            backends = _opt_backendProxies;
        else {
            backends = __makeBackendProxies();
        }
        return backends;
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

      PRIVATE FUNCTION: __reset
     */
    function __reset() {
        __unbind();

        if (typeof(name) === 'string' && name !== "")
            UnityBackends.clearAll();
    }

    /*!
      \internal

      PRIVATE FUNCTION: __unbind
     */
    function __unbind() {
        //TODO: make sure that now leaks here
        if (internal.instance)
            internal.instance.cleanup();
        internal.instance = null;
        internal.backends = null;
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

            console.debug('Requesting the bindee to navigate to homepage: ' + homepage);

            // We recreate a bindee object, but we call any function that requires
            //  come custom cleanup (signals), so we are ok.
            var bindeeProxies = bindee.getUnityWebappsProxies();
            bindeeProxies.navigateTo(homepage);
        }
    }

    function __initWebappForName(name) {
        webapps.__unbind();

        if (bindee != null)
            webapps.__bind(bindee, __isValidWebAppForModel(name) ? __gatherWebAppUserscriptsIfAny(name) : null);

        if (__isValidWebAppName(name)) {
            __navigateToWebappHomepageInBindee(name);
        }

    }

    Component.onCompleted: {
        function oncompleted() {
            __initWebappForName(name);
        }
        if ( ! internal.instance)
            oncompleted();

        if (model) {
            model.modelChanged.connect(oncompleted);
        }

        internal.componentComplete = true;
    }

    /*!
      \internal

     */
    onBindeeChanged: {
        //FIXME: we shouldn't allow bindee to change
    }

    /*!
      \internal

     */
    onNameChanged: {
        //FIXME: we shouldn't allow webapp names to change
        if (internal.componentComplete)
            __initWebappForName(name);
    }

    /*!
      \internal

     */
    QtObject {
        id: internal
        property var instance: null
        property var backends: null
        property bool componentComplete: false
    }


    function __isValidWebAppName(name) {
        return name != null && typeof(name) === 'string' && name != "";
    }


    /*!
      \internal

      PRIVATE FUNCTION: __makeBackendProxies

      Binds the API dispatched calls to the Unity backends.

      TODO move elsewhere (in js file)
     */
    function __makeBackendProxies () {
        var initialized = false;

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

        return {
            init: function (params) {

                if (! isValidInitCall(params)) {
                    console.debug('Invalid init call');
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
                    UnityBackends.createAllWithAsync(webapps, {name: webappName, displayName: params.name});

                    UnityBackends.signalOnBackendReady("base", function () {

                        var base = UnityBackends.get("base");
                        function onInitCompleted(success) {
                            console.debug('Received initCompleted signal, status: ' + success);

                            base.initCompleted.disconnect(onInitCompleted);
                            if (success) {
                                initialized = true;

                                console.debug(JSON.stringify(params));

                                callOnInitScriptFunc();
                            }
                        };

                        base.initCompleted.connect(onInitCompleted);

                        base.init(webappName, params);
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
                    console.debug('MessagingIndicator.addAction not implemented yet');
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
                addAction: function (name, ontriggered) {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").addAction(name, ontriggered);
                },
                removeAction: function (name) {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").removeAction(name);
                },
                removeActions: function () {
                    if (!initialized)
                        return;

                    UnityBackends.get("launcher").removeActions();
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
                }
            }
        };
    }
}

