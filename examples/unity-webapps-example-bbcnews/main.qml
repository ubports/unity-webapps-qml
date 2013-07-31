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

    WebView {
        id: webView

        anchors.fill: parent
        width: parent.width
        height: parent.height

        experimental.userScripts: []
        experimental.preferences.navigatorQtObjectEnabled: true
        experimental.preferences.developerExtrasEnabled: true

        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webView);
        }

        UnityWebApps {
            id: webapps
            name: "BBCNews"
            bindee: webView
            model: UnityWebappsAppModel { searchPath: '/usr/share/unity-webapps-qml/examples/data/userscripts'}
        }
    }
}
