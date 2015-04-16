/*
 * Copyright 2015 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * unity-webapps-qml is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import QtQuick 2.0
import QtTest 1.0
import Ubuntu.Web 0.2
import com.canonical.Oxide 1.0 as Oxide
import Ubuntu.UnityWebApps 0.1


TestCase {
    id: testcase

    name: "LaunchEmbeddedUIApiTest"

    SignalSpy {
      id: spy
      target: webview
      signalName: "visibleChanged"
    }

    function setup() {
        spy.clear()
    }

    function test_invoke_shareRequestedCallback() {
        setup();

        webview.url = "tst_api_launchEmbeddedUI.html"

        evaluateCode("var e = new CustomEvent('launchEmbeddedUI', { bubbles: true }); document.dispatchEvent(e);")

//        spy.wait()
//        compare(spy.count, 1, "Should have had 1 messageReceived signal");
    }

    UnityWebApps {
        id: webapps
        bindee: webview
        injectExtraUbuntuApis: true
        injectExtraContentShareCapabilities: true
    }

    function evaluateCode(code, wrap) {
      webview.rootFrame.sendMessageNoReply(
        "oxide://test-ui/",
        "evalcode",
        { code: code,
          wrap: wrap === undefined ? false : wrap });
    }
    visible: true

    WebView {
        id: webview

        width: 200
        height: 200

        visible: true

        context: WebContext {
            userScripts: [
              Oxide.UserScript {
                context: "oxide://test-ui/"
                url: Qt.resolvedUrl("tst_api_launchEmbeddedUI.js")
                incognitoEnabled: true
                matchAllFrames: true
              }
            ]
        }

        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForWebViewBindee(webview);
        }
    }
}
