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

    name: "ContentHubApiTest"

    signal messageReceived()

    SignalSpy {
      id: spyMessageReceived
      target: testcase
      signalName: "messageReceived"
    }

    function setup() {
        callbacks = []
        objects = {}
        lastReceivedMethod = ""
        webview.url = "empty.html"
        spyMessageReceived.clear()
    }

    property var callbacks: []
    property var objects: null
    property var backends: getContentHubBackend()
    property string lastReceivedMethod

    function serializeContentTransferObject(id, content, selection, handlerFuncs) {
        if (!objects) {
            objects = {}
        }

        objects[id] = {
            content: content,
            selection: selection,
            items: {text: "blabla"},
            handlerFuncs: handlerFuncs
        };
        return {
            type: 'object-proxy',
            apiid: 'ContentHub',
            objecttype: 'ContentTransfer',
            objectid: id,

            content: {
                store: "store",
                state: "state",
                selectionType: selection,
                contentType: content,
                direction: "direction"
            }
        }
    }

    function getContentHubBackend() {
        return  {
            ContentHub: {
                onShareRequested: function(callback) {
                    callbacks.push(callback)
                    lastReceivedMethod = 'onShareRequested'
                    testcase.messageReceived()
                },
                dispatchToObject: function(infos) {
                    var args = infos.args;
                    var callback = infos.callback;
                    var method_name = infos.method_name;

                    verify(objects != null && objects[infos.objectid] != null)

                    verify(objects[infos.objectid].handlerFuncs[method_name] != null)
                    testcase.messageReceived()

                    var r
                    try {
                        r = objects[infos.objectid].handlerFuncs[method_name].apply(objects[infos.objectid], args)
                    } catch(e) {
                        verify(0 && "Exception " + e.toString())
                    }

                    if (callback) {
                        verify (typeof(callback) === 'function')
                        callback(r)
                    }
                }
            }
        }
    }

    function test_call_shareRequested() {
        setup();

        webview.url = "tst_api_contenthub.html"

        spyMessageReceived.wait()
        compare(spyMessageReceived.count, 1, "Should have had 1 apiCallDispatched signal");
        compare(lastReceivedMethod, 'onShareRequested', "Should have had 2 apiCallDispatched signal");
        compare(callbacks.length, 1, "Should have had 1 callback object");
    }

    function test_invoke_shareRequestedCallback() {
        setup();

        var transferObject = { contentType: function() { return "Pictures"; }, items: function() { return [{ text: "blabla" }] } }

        webview.url = "tst_api_contenthub.html"

        spyMessageReceived.wait()
        compare(spyMessageReceived.count, 1, "Should have had 2 apiCallDispatched signal");
        compare(lastReceivedMethod, 'onShareRequested', "Should have had 2 apiCallDispatched signal");
        compare(callbacks.length, 1, "Should have had 1 callback object");

        evaluateCode("document.addEventListener('onsharerequest', function(e) { \
oxide.sendMessage('share-request-received', { type: e.detail.type }); \
})")

        evaluateCode("document.addEventListener('received-object-value', function(e) { \
oxide.sendMessage('share-request-received', { type: e.detail.type }); \
})")

        callbacks[0](
            serializeContentTransferObject(
                "1", "", "", transferObject))

        spyMessageReceived.wait()
        compare(spyMessageReceived.count, 3, "Should have had 1 messageReceived signal");
    }

    UnityWebApps {
        id: webapps
        bindee: webview
        injectExtraUbuntuApis: true
        injectExtraContentShareCapabilities: true
        customBackendProxies: backends
    }

    function evaluateCode(code, wrap) {
      webview.rootFrame.sendMessageNoReply(
        "oxide://test-msg-handler/",
        "evalcode",
        { code: code,
          wrap: wrap === undefined ? false : wrap });
    }

    WebView {
        id: webview

        anchors.fill: parent

        messageHandlers: [
            Oxide.ScriptMessageHandler {
                msgId: "share-request-received"
                contexts: [ "oxide://test-msg-handler/" ]
                callback: function(msg) {
                    testcase.lastReceivedMethod = msg.args;
                    testcase.messageReceived()
                }
            }
        ]

        context: WebContext {
            userScripts: [
              Oxide.UserScript {
                context: "oxide://test-msg-handler/"
                url: Qt.resolvedUrl("tst_api_contenthub.js")
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
