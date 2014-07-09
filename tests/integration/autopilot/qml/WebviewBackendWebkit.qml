import QtQuick 2.0
import QtWebKit 3.0
import QtWebKit.experimental 1.0
import Ubuntu.UnityWebApps 0.1

WebView {
    id: webView
    objectName: "webview"

    property string localUserAgentOverride: ""

    experimental.userScripts: []
    experimental.preferences.navigatorQtObjectEnabled: true
    experimental.preferences.developerExtrasEnabled: true

    function getUnityWebappsProxies() {
        return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webView);
    }
}
