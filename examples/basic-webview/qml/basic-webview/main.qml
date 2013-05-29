import QtQuick 2.0
import QtWebKit 3.0
import QtWebKit.experimental 1.0
import Ubuntu.UnityWebApps 0.1

Rectangle {
    width: 640
    height: 640

    WebView {
        id: webView

        // test url
        url: "http://localhost:8181/"
        anchors.fill: parent
        width: parent.width
        height: parent.height

        experimental.userScripts: []
        experimental.preferences.navigatorQtObjectEnabled: true
        experimental.preferences.developerExtrasEnabled: true

        experimental.userAgent: {
            return "Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
        }
        experimental.onMessageReceived: {
            var msg = null
            try {
                msg = JSON.parse(message.data)
            } catch (error) {
                console.debug('DEBUG:', message.data)
                return
            }
        }

        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webView);
        }

        UnityWebApps {
            id: webapps
            name: "basic-webapps-integration"
            bindee: webView
        }
    }
}
