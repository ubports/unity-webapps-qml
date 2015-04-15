/*
 * Copyright 2013 Canonical Ltd.
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
import Ubuntu.UnityWebApps 0.1


TestCase {
    name: "WebAppsDispatchCleanupTest"

    function setup() {
    }

    function createWebViewMock() {
        var messageReceivedCallbacks = [];
        var loadingChangedCallbacks = [];
        return {
            url: '',

            loadingChanged: {
                connect: function (callback) {
                    loadingChangedCallbacks.push(callback);
                },
                disconnect: function(callback) {
                    loadingChangedCallbacks = loadingChangedCallbacks.filter(function (e) { return e !== callback; });
                }
            },

            experimental: {
                messageReceived: {
                    connect: function (callback) {
                        messageReceivedCallbacks.push(callback);
                    },
                    disconnect: function(callback) {
                        messageReceivedCallbacks = messageReceivedCallbacks.filter(function (e) { return e !== callback; });
                    }
                },
                userScripts: [],
                postMessage: function(msg) {}
            },

            callMessageReceivedCallbacks: function(msg) {
                var wrapped = {data: JSON.stringify(msg)};
                messageReceivedCallbacks.forEach(function(f) { f(wrapped); });
            }
        };
    }

    function createWebAppsDispatcherWithSimpleBackend(mockedwebview) {
        var simple_backend = {This: { Is: { A: {Backend: function (args) { mockedWebView.called(args) } } } } };

        var bindeeProxies = UnityWebAppsUtils.makeProxiesForWebViewBindee(mockedwebview);
        var bridge = new UnityWebAppsJs.UnityWebApps(null, bindeeProxies);
        bridge.setBackends(simple_backend);
        return bridge;
    }

    function test_cleanupOnce() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "called";

        var mwv = createWebViewMock();
        var dispatcher = createWebAppsDispatcherWithSimpleBackend(mwv);

        mwv.callMessageReceivedCallbacks (UnityWebAppsUtils.formatUnityWebappsCall ('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));
        compare(spy.count, 1, "This.Is.A.Backend backend called");

        dispatcher.cleanup();

        mwv.callMessageReceivedCallbacks (UnityWebAppsUtils.formatUnityWebappsCall ('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));
        compare(spy.count, 1, "This.Is.A.Backend backend called");
    }


    function test_multipleCleanup() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "called";

        var mwv = createWebViewMock();
        var dispatcher = createWebAppsDispatcherWithSimpleBackend(mwv);
        var dispatcher1 = createWebAppsDispatcherWithSimpleBackend(mwv);
        var dispatcher2 = createWebAppsDispatcherWithSimpleBackend(mwv);

        mwv.callMessageReceivedCallbacks (UnityWebAppsUtils.formatUnityWebappsCall ('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));
        compare(spy.count, 3, "This.Is.A.Backend backend called");

        dispatcher.cleanup();

        mwv.callMessageReceivedCallbacks (UnityWebAppsUtils.formatUnityWebappsCall ('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));
        compare(spy.count, 5, "This.Is.A.Backend backend called");

        dispatcher1.cleanup();

        mwv.callMessageReceivedCallbacks (UnityWebAppsUtils.formatUnityWebappsCall ('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));
        compare(spy.count, 6, "This.Is.A.Backend backend called");

        dispatcher2.cleanup();

        mwv.callMessageReceivedCallbacks (UnityWebAppsUtils.formatUnityWebappsCall ('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));
        compare(spy.count, 6, "This.Is.A.Backend backend called");
    }

    SignalSpy {
        id: spy
    }

    // 'mocks' the 'bindee'
    Item {
        id: mockedWebView

        // back to webapps element
        signal loadingStarted()
        signal messageReceived(var message)

        // called
        signal called()
        signal injected(string src)
        signal loadingStartedConnected()
        signal messageReceivedConnected()
    }
}
