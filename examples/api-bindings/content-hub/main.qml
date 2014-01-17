import QtQuick 2.0
import QtWebKit 3.0 
import QtWebKit.experimental 1.0
import Ubuntu.UnityWebApps 0.1

Item {
  id: webView
  focus: true
  width: 800
  height: 800

  WebView {
    id: webview
    anchors.fill: parent

    url: "file:///home/alex/dev/work/webapps/branches/webapps-qml/automatic-generation-of-bindings/examples/api-bindings/content-hub/www/index.html"

    experimental.preferences.navigatorQtObjectEnabled: true
    experimental.preferences.developerExtrasEnabled: true

    function getUnityWebappsProxies() {
        return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webview);
    }
    UnityWebApps {
        id: webapps
        bindee: webview
    }
  }
}
