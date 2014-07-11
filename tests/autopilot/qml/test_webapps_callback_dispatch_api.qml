import QtQuick 2.0

Item {
    function buildapi() {
        return {
            withCallback: function(clientCallback) {
                function callbackLoop(callback) {
                    callback(callbackLoop);
                }
                clientCallback(callbackLoop);
            }
        };
    }
}
