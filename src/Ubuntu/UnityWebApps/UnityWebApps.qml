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

        method getUnityWebappsProxies()

        that should return a BindeeExports:

        interface BindeeExports {
            method injectUserScripts(string userScriptUrls);
            method sendToPage(string message);
            method loadingStartedConnect(Callback onLoadingStarted);
            method messageReceivedConnect(Callback onMessageReceived);
        }

      */
    property var bindee


    /*!
      \qmlproperty

     */
    property var model: null


    /*!
      \qmlproperty string UnityWebApps::_opt_backendProxies

      Used only for testing.
      Allows optional (not the default ones) backends to be used.

     */
    property var _opt_backendProxies: null


    // PRIVATE FUNCTION: __bind
    //
    // Binds a given webapp object with something that
    //  is expected to support the following calls:
    //
    function __bind(bindee, webappUserscripts) {
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

        var backends = webapps._opt_backendProxies || __makeBackendProxies();
        var instance = new UnityWebAppsJs.UnityWebApps(webapps,
                                                     bindeeProxies,
                                                     backends,
                                                     webappUserscripts);
        internal.backends = backends;
        internal.instance = instance;
    }

    // PRIVATE FUNCTION: __isValidBindee
    //
    function __isValidBindee(bindee) {
        var properties = [{'name': 'getUnityWebappsProxies', 'type': 'function'}];
        var validator = UnityWebAppsJsUtils.makePropertyValidator(properties);
        return validator(bindee);
    }

    // PRIVATE FUNCTION: __areValidBindeeProxies
    //
    // Validates the bindeed proxies as exported by getUnityWebappsProxies
    function __areValidBindeeProxies(proxies) {
        var properties = [{'name': 'sendToPage', 'type': 'function'},
                {'name': 'loadingStartedConnect', 'type': 'function'},
                {'name': 'messageReceivedConnect', 'type': 'function'},
                {'name': 'injectUserScripts', 'type': 'function'}];

        var validator = UnityWebAppsJsUtils.makePropertyValidator(properties);
        return validator(proxies);
    }

    // PRIVATE FUNCTION: __reset
    //
    function __reset() {
        __unbind();
        UnityBackends.clearAll();
    }

    // PRIVATE FUNCTION: __unbind
    //
    function __unbind() {
        //TODO: make sure that now leaks here
        internal.instance = null;
        internal.backends = null;
    }

    Component.onCompleted: {
        if (bindee == null || name == "") {
            console.log("Invalid component");
            return;
        }

        webapps.__unbind();

        UnityBackends.clearAll();
        UnityBackends.createAllWithAsync(webapps, {name: name});

        var userscripts = [];
        if (model != null && model.exists && model.exists(name)) {
            var idx = model.getWebappIndex(name);
            userscripts = model.data(idx, UbuntuUnityWebApps.UnityWebappsAppModel.Scripts);

            // FIXME: hack
            userscripts = userscripts.map(function (script) { return 'file://' + script; });
            console.log(userscripts)
        }

        webapps.__bind(bindee, userscripts);
    }

    onBindeeChanged: {
        //TODO?
    }

    // TODO: review this (multiple name changes), make sure that depends & syncs
    //  between unitywebapps & backends is ok (when backends are destroyed)
    //  move this kind of deferred stuff into a more centralized sync point like QQmlParserStatus?
    //
    onNameChanged: {
        //TODO?
    }

    // PRIVATE DATA
    //
    QtObject {
        id: internal
        property var instance: null
        property var backends: null
    }


    // PRIVATE FUNCTION: __makeBackendProxies
    //
    // TODO lazily create the 'backends' on a getUnityObject
    // TODO the backends should prop be on the qml side and provided to here
    function __makeBackendProxies () {
        return {
            init: function (params) {console.debug('calls init')
                UnityBackends.signalOnBackendReady("base", function () {
                    // base.init(params);
                    params.onInit();
                });
            },

            addAction: function(actionName, onActionInvoked) {

                // hud add action
                // internal.backends.hud.addAction(actionName, onActionInvoked);
                console.debug('addAction not implemented yet');
            },

            removeAction: function(actionName) {

                // hud remove action
                // internal.backends.hud.removeAction(actionName);
                console.debug('removeAction not implemented yet');
            },

            removeActions: function() {

                // hud remove all action
                console.debug('removeActions not implemented yet');
            },

            Notification: {
                showNotification: function (summary, body, iconUrl) {
                    //TODO: fix that underterministic crap ("notify" being badly independantly
                    // checked from the others)
                    UnityBackends.signalOnBackendReady("notify", function () {
                        UnityBackends.get("notify").show(summary, body, iconUrl);
                    });
                }
            },

            MessagingIndicator: {
                showIndicator: function (name, properties) {
                    console.debug('MessagingIndicator.showIndicator not implemented yet');
                },
                clearIndicator: function (name) {
                    console.debug('MessagingIndicator.clearIndicator not implemented yet');
                },
                clearIndicators: function () {
                    console.debug('MessagingIndicator.clearIndicators not implemented yet');
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

