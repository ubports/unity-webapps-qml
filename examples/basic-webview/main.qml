import QtQuick 2.0
import QtQuick.Window 2.0
import com.canonical.Oxide 1.0
import Ubuntu.UnityWebApps 0.1

Window {
    width: 640
    height: 640

    WebView {
        id: webView

        // test url
        url: "file:///usr/share/unity-webapps-qml/examples/data/html/big-test.html"
        anchors.fill: parent

        context: WebContext { }

        function getUnityWebappsProxies() {
            var proxies = UnityWebAppsUtils.makeProxiesForWebViewBindee(webView);

            // override the default navigate to request
            proxies.navigateTo = function(url) {};
            return proxies;
        }
    }

    UnityWebApps {
        id: webapps
        name: "BBCNews"
        bindee: webView
        model: UnityWebappsAppModel { }
    }
}
