import QtQuick 2.0
import com.canonical.Oxide 1.0
import Ubuntu.UnityWebApps 0.1

WebView {
    id: webView
    objectName: "webview"

    property string localUserAgentOverride: ""

    function getUnityWebappsProxies() {
        return UnityWebAppsUtils.makeProxiesForWebViewBindee(webView);
    }
}
