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
import Ubuntu.Unity.Action 1.0 as UnityActions
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
        console.log(DomIntrospectionUtils.wrapJsCommands(expr))
        webView.experimental.evaluateJavaScript(DomIntrospectionUtils.wrapJsCommands(expr),
            function(result) { console.log('Result: ' + result); root.resultUpdated(DomIntrospectionUtils.createResult(result)); });
    }

    property alias url: webView.url
    property string webappName: ""
    property string webappSearchPath: ""

    UnityActions.ActionManager {
        localContexts: [webappsActionsContext]
    }
    UnityActions.ActionContext {
        id: webappsActionsContext
        active: true
    }

    WebView {
        id: webView
        objectName: "webview"

        anchors.fill: parent
        width: parent.width
        height: parent.height

        experimental.userScripts: []
        experimental.preferences.navigatorQtObjectEnabled: true
        experimental.preferences.developerExtrasEnabled: true

        onLoadingChanged: console.debug('onLoadingChanged: loading changed: ' + loadRequest.url + ', status: ' + loadRequest.status)

        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webView);
        }

        UnityWebApps {
            id: webapps
            objectName: "webappsContainer"
            actionsContext: webappsActionsContext
            name: root.webappName
            bindee: webView
            //searchPath: '/home/alex/dev/work/webapps/branches/webapps-qml/latest/examples/data/userscripts'
            model: UnityWebappsAppModel { }
        }
    }
}
