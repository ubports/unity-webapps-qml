import QtQuick 2.0
import QtTest 1.0
import Ubuntu.UnityWebApps 0.1

TestCase {
    name: "WebAppsComponentInitTests"

    function setup() {
        webapps.__reset();
        mockedWebView.disconnectAll();
    }

    function test_nullInit() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "injected";

        webapps.name = "test_nullInit";
        webapps.__bind(webapps.bindee, []);

        compare(spy.count, 0, "Invalid (null) init call");
    }

    function test_initAndInjected() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "injected";

        webapps.name = "test_initAndInjected";
        webapps.bindee = mockedWebView;
        webapps.__bind(webapps.bindee, []);

        mockedWebView.loadingStarted();

        compare(spy.count, 1, "Script has been injected");
    }

    function test_initAndMessageHandlerAdded() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "loadingStartedConnected";

        webapps.name = "test_initAndMessageHandlerAdded";
        webapps.bindee = mockedWebView;
        webapps.__bind(webapps.bindee, []);

        compare(spy.count, 1, "WebApp message connected on load started");
    }

    function test_initWithNoName() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "messageReceivedConnected";

        webapps.name = "test_initWithNoName";
        webapps.bindee = mockedWebView;
        webapps.__bind(webapps.bindee, []);

        compare(spy.count, 1, "WebApp message received connected");
    }

    SignalSpy {
        id: spy
    }

    UnityWebApps {
        id: webapps
        name: ""
        bindee: null
    }

    // 'mocks' the 'bindee'
    Item {
        id: mockedWebView

        property var connectedSlots: []

        function disconnectAll () {
            connectedSlots.forEach(function (slot) {
                slot.target.disconnect(slot.slot);
            });
            connectedSlots = [];
        }

        function getUnityWebappsProxies() {
            return  {
                injectUserScripts: function(userScriptUrls) {
                    injected(userScriptUrls);
                },
                sendToPage: function (message) {
                },
                navigateTo: function (url) {
                },
                loadingStartedConnect: function (onLoadingStarted) {
                    mockedWebView.loadingStarted.connect(onLoadingStarted);
                    loadingStartedConnected();

                    connectedSlots.push({'target': mockedWebView.loadingStarted, 'slot': onLoadingStarted});
                },
                messageReceivedConnect: function (onMessageReceived) {
                    mockedWebView.messageReceived.connect(onMessageReceived);
                    messageReceivedConnected();

                    connectedSlots.push({'target': mockedWebView.messageReceived, 'slot': onMessageReceived});
                }
            };
        }

        // back to webapps element
        signal loadingStarted()
        signal messageReceived()

        // called
        signal injected(string src)
        signal loadingStartedConnected()
        signal messageReceivedConnected()
    }
}
