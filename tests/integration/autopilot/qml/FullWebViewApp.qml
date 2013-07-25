/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * webbrowser-app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import QtQuick 2.0
import QtQuick.Window 2.0
import QtWebKit 3.0
import QtWebKit.experimental 1.0
import Ubuntu.HUD 1.0 as HUD
import Ubuntu.UnityWebApps 0.1

import "dom-introspection-utils.js" as DomIntrospectionUtils


Window {
    id: root
    objectName: "webviewContainer"

    width: 640
    height: 640

    signal resultUpdated(string message)

    function evalInPageUnsafe(expr) {
        var tid = DomIntrospectionUtils.gentid();
        webView.experimental.evaluateJavaScript(DomIntrospectionUtils.wrapJsCommands(expr),
            function(result) { console.log('Result: ' + result); root.resultUpdated(DomIntrospectionUtils.createResult(result)); });
    }

    property alias url: webView.url
    property string webappName: ""
    property string webappSearchPath: ""
    property string testUserScript: ""

    HUD.HUD {        
        applicationIdentifier: "unity-webapps-qml-launcher"
        HUD.Context {
            id: hudContext
        }
    }

    WebView {
        id: webView
        objectName: "webview"

        url: parent.url
        anchors.fill: parent
        width: parent.width
        height: parent.height

        experimental.userScripts: [Qt.resolvedUrl("injected-script.js")]
        experimental.preferences.navigatorQtObjectEnabled: true
        experimental.preferences.developerExtrasEnabled: true

        experimental.userAgent: {
            return "Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
        }

        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webView);
        }

        UnityWebApps {
            id: webapps
            objectName: "webappsContainer"
            actionsContext: hudContext
            name: "FullWebViewApp"
            bindee: webView
            model: UnityWebappsAppModel { searchPath: root.webappSearchPath }
        }
    }
}
