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
import QtWebKit 3.0
import QtWebKit.experimental 1.0
import Ubuntu.UnityWebApps 0.1

Rectangle {
    width: 640
    height: 640
    
    property string url: ""

    WebView {
        id: webView

        url: parent.url
        anchors.fill: parent
        width: parent.width
        height: parent.height

        experimental.userScripts: []
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
            name: "FullWebViewApp"
            bindee: webView
            model: UnityWebappsAppModel { }
        }
    }
}
