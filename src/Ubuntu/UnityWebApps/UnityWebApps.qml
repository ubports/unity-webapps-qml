import QtQuick 2.0
import Ubuntu.UnityWebApps 0.1 as UbuntuUnityWebApps
import "UnityWebApps.js" as UnityWebAppsJs
import "UnityWebAppsUtils.js" as UnityWebAppsJsUtils
import "UnityWebAppsBackendComponents.js" as UnityBackends

//
// TODO:
//  -monitor bindee changed
//  -extract webview specific elements (postMessage)

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
      Holds the name of the application that is run as a WebApp.

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
            }
        \endcode

      */
    property var bindee


    /*!
      \qmlproperty UnityWebappsAppModel UnityWebApps::model

      \preliminary

     */
    property var model: null


    /*!
      \qmlproperty HUD.Context UnityWebApps::actionsContext

      The actions context that this element can reach out to for
      additional actions.

     */
    property var actionsContext: null


    /*!
      \qmlproperty string UnityWebApps::_opt_backendProxies

      Used only for testing.
      Allows optional (not the default ones) backends to be used.

     */
    property var _opt_backendProxies: null


    /*!
      \internal

      PRIVATE FUNCTION: __bind

      Binds a given webapp object with something that
      is expected to support the following calls:
     */
    function __bind(bindee, webappUserscripts) {
        if (!bindee)
            return;

        // FIXME: bad design
        if (internal.instance) {
            console.debug('__bind: ERROR Instance already set')
            return;
        }

        if (!__isValidBindee(bindee)) {
            // FIXME: error handling
            console.debug('__bind: ERROR not a valid bindee')
            return;
        }

        var bindeeProxies = bindee.getUnityWebappsProxies();
        if (!__areValidBindeeProxies(bindeeProxies)) {
            // FIXME: error handling
            console.debug('__bind: ERROR bindee proxies not valid')
            return;
        }

        var backends = _opt_backendProxies || __makeBackendProxies();
        var instance = new UnityWebAppsJs.UnityWebApps(webapps,
                                                     bindeeProxies,
                                                     backends,
                                                     webappUserscripts);
        internal.backends = backends;
        internal.instance = instance;
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
        UnityBackends.clearAll();
    }

    /*!
      \internal

      PRIVATE FUNCTION: __unbind
     */
    function __unbind() {
        //TODO: make sure that now leaks here
        internal.instance = null;
        internal.backends = null;
    }

    /*!
      \internal

      Validates that an installed webapp has been found in the current model (if any)
     */
    function __isValidWebAppForModel(webappName) {
        return model != null && model.exists && model.exists(webappName);
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

            console.debug('Requesting the bindee to navigate to: ' + homepage);

            var bindeeProxies = bindee.getUnityWebappsProxies();
            bindeeProxies.navigateTo(homepage);
        }
    }

    Component.onCompleted: {
        webapps.__unbind();
        webapps.__bind(bindee, __gatherWebAppUserscriptsIfAny(name));

        if (name != "") {
            UnityBackends.clearAll();
            UnityBackends.createAllWithAsync(webapps, {name: name});

            __navigateToWebappHomepageInBindee(name);
        }
    }

    /*!
      \internal

     */
    onBindeeChanged: {
        __unbind();
        __bind(bindee, __gatherWebAppUserscriptsIfAny(name));
    }

    /*!
      \internal

     */
    onNameChanged: {
        //FIXME: we shouldn't allow webapp names to change
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

      PRIVATE FUNCTION: __makeBackendProxies

      TODO lazily create the 'backends' on a getUnityObject
      TODO the backends should prop be on the qml side and provided to here
      TODO move elsewhere (in js file)
     */
    function __makeBackendProxies () {
        var initialized = false;
        return {
            init: function (params) {
                UnityBackends.signalOnBackendReady("base", function () {
                    initialized = true;
                    // base.init(params);
                    params.onInit();
                });
            },

            addAction: function(actionName, onActionInvoked) {
                if (!initialized)
                    return;
                // hud add action
                UnityBackends.get("hud").addAction(actionName, onActionInvoked);
            },

            removeAction: function(actionName) {
                if (!initialized)
                    return;
                // hud remove action
                UnityBackends.get("hud").removeAction(actionName);
            },

            removeActions: function() {
                if (!initialized)
                    return;
                // hud remove all action
                UnityBackends.get("hud").removeActions();
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

                    for (i in properties) {
                        if (i == "time") {
                            UnityBackends.get("messaging").setProperty(String(name), i, UnityWebAppsJsUtils.toISODate(properties[i]));
                        }
                        else if (i == "count") {
                            UnityBackends.get("messaging").setProperty(String(name), i, String(Number(properties[i])));
                        }
                        else {
                            UnityBackends.get("messaging").setProperty(String(name), i, String(properties[i]));
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
                removeAction: function (name) {
                    console.debug('MessagingIndicator.removeAction not implemented yet');
                },
                removeActions: function () {
                    console.debug('MessagingIndicator.removeActions not implemented yet');
                }
            },

            MediaPlayer: {
                setTrack: function (infos) {
                    console.debug('MediaPlayer.setTrack not implemented yet');
                },
                onPrevious: function (callback) {
                    console.debug('MediaPlayer.onPrevious not implemented yet');
                },
                onNext: function (callback) {
                    console.debug('MediaPlayer.onNext not implemented yet');
                },
                onPlayPause: function (callback) {
                    console.debug('MediaPlayer.onPlayPause not implemented yet');
                },
                onPrevious: function (callback) {
                    console.debug('MediaPlayer.onPrevious not implemented yet');
                },
                onNext: function (callback) {
                    console.debug('MediaPlayer.onNext not implemented yet');
                },
                onPlayPause: function (callback) {
                    console.debug('MediaPlayer.onPlayPause not implemented yet');
                },
                getPlaybackstate: function () {
                    console.debug('MediaPlayer.getPlaybackstate not implemented yet');
                },
                setPlaybackstate: function (state) {
                    console.debug('MediaPlayer.setPlaybackstate not implemented yet');
                },
                setCanGoNext: function (cango) {
                    console.debug('MediaPlayer.setCanGoNext not implemented yet');
                },
                setCanGoPrev: function (cango) {
                    console.debug('MediaPlayer.setCanGoPrev not implemented yet');
                },
                setCanPlay: function (cango) {
                    console.debug('MediaPlayer.setCanPlay not implemented yet');
                },
                setCanPause: function (cango) {
                    console.debug('MediaPlayer.setCanPause not implemented yet');
                },
            },

            Launcher: {
                setCount: function (count) {
                    console.debug('Launcher.setCount not implemented yet');
                },
                clearCount: function () {
                    console.debug('Launcher.clearCount not implemented yet');
                },
                setProgress: function (progress) {
                    console.debug('Launcher.setProgress not implemented yet');
                },
                clearProgress: function () {
                    console.debug('Launcher.clearProgress not implemented yet');
                },
                setUrgent: function (urgent) {
                    console.debug('Launcher.setUrgent not implemented yet');
                },
                addAction: function (name, onInvoked) {
                    console.debug('Launcher.addAction not implemented yet');
                },
                removeAction: function (name) {
                    console.debug('Launcher.removeAction not implemented yet');
                },
                removeActions: function () {
                    console.debug('Launcher.removeActions not implemented yet');
                },
            }
        };
    }
}

