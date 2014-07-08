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
import Ubuntu.Unity.Action 1.0 as UnityActions
import Ubuntu.UnityWebApps 0.1
import "."

import "dom-introspection-utils.js" as DomIntrospectionUtils


Window {
    id: root
    objectName: "webviewContainer"

    width: 640
    height: 640

    signal resultUpdated(string message)

    function evalInPageUnsafe(expr) {
        if (webView && webView.experimental) {
            webView.experimental.evaluateJavaScript(DomIntrospectionUtils.wrapJsCommands(expr),
                function(result) {
                    console.log('Result: ' + result);
                    root.resultUpdated(DomIntrospectionUtils.createResult(result));
                });
        }
        else {
            root.resultUpdated(DomIntrospectionUtils.createResult(webView.evaluateCode("return navigator.userAgent", true)))
        }
    }

    property var webView: null

    property bool useOxide: false
    property string url: ""
    property string webappName: ""
    property string webappSearchPath: ""
    property string webappHomepage: ""

    UnityActions.ActionManager {
        localContexts: [webappsActionsContext]
    }
    UnityActions.ActionContext {
        id: webappsActionsContext
        active: true
    }

    Loader {
        id: webviewLoader
        onLoaded: {
            webView = webviewLoader.item
        }
    }

    Component.onCompleted: {
        var webviewSource = useOxide ?
                    Qt.resolvedUrl("WebviewBackendOxide.qml")
                  : Qt.resolvedUrl("WebviewBackendWebkit.qml");
        var override =  webappName && webappModel.exists(webappName) ?
                    webappModel.userAgentOverrideFor(webappName) : ""
        webviewLoader.setSource(webviewSource,
            { url: root.url,
            localUserAgentOverride: override})
    }

    Loader {
        id: unityWebappsComponentLoader
        anchors.fill: parent
        sourceComponent: webView !== null && webappName.length !== 0 ? unityWebappsComponent : null
    }

    UnityWebappsAppModel {
        id: webappModel
        searchPath: root.webappSearchPath
    }

    Component {
        id: unityWebappsComponent

        UnityWebApps {
            id: webapps
            objectName: "webappsContainer"
            actionsContext: webappsActionsContext
            name: root.webappName
            bindee: webView
            _opt_homepage: root.webappHomepage
            model: webappModel
        }
    }
}
