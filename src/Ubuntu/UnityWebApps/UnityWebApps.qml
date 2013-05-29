import QtQuick 2.0
import "UnityWebApps.js" as UnityWebApps
import "UnityWebAppsUtils.js" as UnityWebAppsUtils
import "UnityWebAppsBackendComponents.js" as UnityBackends

//
// TODO:
//  -monitor bindee changed
//  -extract webview specific elements (postMessage)

Item {
    id: webapp

    /*!
      \preliminary
      Holds the name of the application that is run as a WebApp.

      The name should not change once it has been set. (?)
      */
    property string name: ""

    /*!
      \preliminary
      Holds a reference to the object that webapps are to be injected in.

      The component directly binds and expects an experimental.messageReceived signal
      to bind to.
      */
    property var bindee

    property var _opt_backendProxies: null

    //
    // Binds a given webapp object with something that
    //  is expected to support the following calls:
    //
    function __bind(bindee) {
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

        var backends = webapp._opt_backendProxies || __makeBackendProxies();
        var instance = new UnityWebApps.UnityWebApps(webapp,
                                                     bindeeProxies,
                                                     backends);
        internal.backends = backends;
        internal.instance = instance;
    }

    function __isValidBindee(bindee) {
        var properties = [{'name': 'getUnityWebappsProxies', 'type': 'function'}];
        var validator = UnityWebAppsUtils.makePropertyValidator(properties);
        return validator(bindee);
    }

    function __areValidBindeeProxies(proxies) {
        var properties = [{'name': 'sendToPage', 'type': 'function'},
                {'name': 'loadingStartedConnect', 'type': 'function'},
                {'name': 'messageReceivedConnect', 'type': 'function'},
                {'name': 'injectUserScript', 'type': 'function'}];

        var validator = UnityWebAppsUtils.makePropertyValidator(properties);
        return validator(proxies);
    }

    function __reset() {
        __unbind();
        UnityBackends.clearAll();
    }

    function __unbind() {
        //TODO: make sure that now leaks here
        internal.instance = null;
        internal.backends = null;
    }

    onBindeeChanged: {
        if (bindee != null) {
            webapps.__unbind();
            webapps.__bind(bindee);
        }
    }

    // TODO: review this (multiple name changes), make sure that depends & syncs
    //  between unitywebapps & backends is ok (when backends are destroyed)
    //  move this kind of deferred stuff into a more centralized sync point like QQmlParserStatus?
    //
    onNameChanged: {
        if (name !== "") {
            UnityBackends.clearAll();
            UnityBackends.createAllWithAsync(webapp, {name: name});
        }
    }

    QtObject {
        id: internal
        property var instance: null
        property var backends: null
    }

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

