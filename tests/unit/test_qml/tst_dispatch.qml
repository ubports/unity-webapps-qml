import QtQuick 2.0
import QtTest 1.0
import Ubuntu.UnityWebApps 0.1

TestCase {
    name: "WebAppsDispatchTest"

    function setup() {
        webapps.__unbind();
        mockedWebView.disconnectAll();
    }

    function test_properBackendDispatched() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "called";

        var simple_backend = {This: { Is: { A: {Backend: function (args) { mockedWebView.called(args) } } } } };

        webapps.customBackendProxies = simple_backend;
        webapps.name = "test_properBackendDispatched";
        webapps.bindee = mockedWebView;

        mockedWebView.messageReceived(UnityWebAppsUtils.formatUnityWebappsCall('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));

        compare(spy.count, 1, "This.Is.A.Backend backend called");
    }

    function test_backendDispatchedWithProperArguments() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "called";

        var params = [1, 2, 'AAU'];
        var action = function() {
            var args = arguments;
            mockedWebView.called(args);

            verify(null != args && args.length !== 0, "Non null args");
            verify(typeof(args) == 'object', "Proper args type: " + typeof(args));
            params.forEach(function (elt, idx) { compare(elt, args[idx], "Validate args index :" + idx); });
        };

        var simple_backend = {This: { Is: { A: {Backend: action } } } };

        webapps.customBackendProxies = simple_backend;
        webapps.name = "test_backendDispatchedWithProperArguments";
        webapps.bindee = mockedWebView;

        mockedWebView.messageReceived(UnityWebAppsUtils.formatUnityWebappsCall('This.Is.A.Backend', JSON.stringify(params)));

        compare(spy.count, 1, "This.Is.A.Backend backend called");
    }

    function test_invalidBackendNotDispatched() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "called";

        var invalid_backend = {This: { Is: { Not: { A: {Backend: function (args) { mockedWebView.called(args) } } } } } };

        webapps.customBackendProxies = invalid_backend;
        webapps.name = "test_invalidBackendNotDispatched";
        webapps.bindee = mockedWebView;

        mockedWebView.messageReceived(UnityWebAppsUtils.formatUnityWebappsCall('This.Is.A.Backend', JSON.stringify([1, 2, "AAU"])));

        compare(spy.count, 0, "This.Is.Not.A.Backend backend not called");
    }

    function test_callbacksAreWrapped() {
        setup();

        spy.clear();
        spy.target = mockedWebView;
        spy.signalName = "called";

        var action = function() {
            var args = Array.prototype.slice.call(arguments);
            mockedWebView.called(args);

            // make sure that we have a function that wraps the callbackid
            verify(null != args, "Non null args");
            verify(typeof(args) == 'object', "Proper args type");
            expectFail(args.some(function (arg) { return typeof(arg) == 'object' && 'callbackid' in arg; }), "");
            verify(args.some(function (arg) { return typeof(arg) == 'function'; }), "We have at least a wrapping function");
        };

        var backend = {This: { Is: { A: {Backend: action } } } };

        webapps.customBackendProxies = backend;
        webapps.name = "test_callbacksAreWrapped";
        webapps.bindee = mockedWebView;

        //We assume a bit about the implementation there ('callbackid')
        mockedWebView.messageReceived(UnityWebAppsUtils.formatUnityWebappsCall('This.Is.A.Backend', JSON.stringify([1, {'callbackid': 1}, "AAU"])));

        compare(spy.count, 1, "This.Is.A.Backend backend called");
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
                },
            };
        }

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
