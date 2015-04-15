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
import Ubuntu.Web 2.0
import Ubuntu.UnityWebApps 0.1


TestCase {
    name: "ContentHubApiTest"

    function setup() { }

    property var objects: null
    property var backends

    function serializeContentTransferObject(id, content, selection, handlerFuncs) {
        objects[id] = {
            content: content,
            selection: selection,
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
                    callback(serializeContentTransferObject("1", "", ""))
                },
                dispatchToObject: function(infos) {
                    var args = infos.args;
                    var callback = infos.callback;
                    var method_name = infos.method_name;

                    verify(objects != null &&
                           objects[infos.objectid] != null)

                    verify(objects[infos.objectid].handlerFuncs[method_name] != null)

                    var r = objects[infos.objectid].handlerFuncs[method_name](args)
                    if (callback) {
                        callback(args)
                    }
                }
            }
        }
    }

    function test_contentHubShare() {
        setup();

        var transferObject = { contentType: function(callback) { callback("Pictures"); } }
        var backend = getContentHubBackend()

        webapps.customBackendProxies = backend;

        webview.url = "tst_api_contenthub.html"

        compare(spy.count, 1, "This.Is.A.Backend backend called");
    }

    UnityWebApps {
        id: webapps
        bindee: webview
        injectExtraUbuntuApis: true
        injectExtraContentShareCapabilities: true
        customBackendProxies: backends
    }

    // 'mocks' the 'bindee'
    WebView {
        id: webview

        anchors.fill: parent

        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForWebViewBindee(webview);
        }
    }
}
