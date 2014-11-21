import QtQuick 2.0
import QtTest 1.0
import com.canonical.Oxide 1.0 as Oxide
import Ubuntu.UnityWebApps 0.1

Oxide.WebView {
    id: webView
    objectName: "webview"

    property string localUserAgentOverride: ""

    preferences.localStorageEnabled: true
    preferences.appCacheEnabled: true

    function _waitForResult(req, timeout) {
      var result;
      var error;
      req.onreply = function(response) {
          result = response;
          error = 0;
      };
      req.onerror = function(error_code, msg) {
          result = msg;
          error = error_code;
      };
      webView._waitFor(function() { return error !== undefined; },
                            timeout);

      if (error > 0) {
          console.error('Error:' + error + ', result:' + result)
      } else if (error === 0) {
          return result;
      } else {
          throw new Error("Message call timed out");
      }
    }

    function _waitFor(predicate, timeout) {
      timeout = timeout || 5000000;
      var end = Date.now() + timeout;
      var i = Date.now();
      while (i < end && !predicate()) {
          qtest_testResult.wait(50);
          i = Date.now();
      }
      return predicate();
    }

    function evaluateCode(code, wrap) {
      var value = webView._waitForResult(
          webView.rootFrame.sendMessage(
            "oxide://main-world",
            "EVALUATE-CODE",
            { code: code,
              wrap: wrap === undefined ? false : wrap }));
        return value ? value.result : undefined;
    }

    context: Oxide.WebContext {
        userAgent: webView.localUserAgentOverride.length === 0
                   ? "" : webView.localUserAgentOverride
        userScripts: [
            Oxide.UserScript {
                context: "oxide://main-world"
                emulateGreasemonkey: true
                url: Qt.resolvedUrl("message-server.js")
                matchAllFrames: true
            }
        ]
    }

    function getUnityWebappsProxies() {
        return UnityWebAppsUtils.makeProxiesForWebViewBindee(webView);
    }

    onJavaScriptConsoleMessage: {
        var msg = "[JS] (%1:%2) %3".arg(sourceId).arg(lineNumber).arg(message)
        if (level === Oxide.WebView.LogSeverityVerbose) {
            console.log(msg)
        } else if (level === Oxide.WebView.LogSeverityInfo) {
            console.info(msg)
        } else if (level === Oxide.WebView.LogSeverityWarning) {
            console.warn(msg)
        } else if ((level === Oxide.WebView.LogSeverityError) ||
                   (level === Oxide.WebView.LogSeverityErrorReport) ||
                   (level === Oxide.WebView.LogSeverityFatal)) {
            console.error(msg)
        }
    }

    TestResult { id: qtest_testResult }
}
