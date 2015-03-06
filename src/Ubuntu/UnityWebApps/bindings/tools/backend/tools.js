/*
 * Copyright 20145 Canonical Ltd.
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

.import Ubuntu.UnityWebApps 0.2 as UnityWebAppsBridge


/**
 *
 * Tools API backend binding
 *
 */
function createToolsApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.UnityWebApps';
    var VERSION = 0.2;

    var toolsApiInstance = UnityWebAppsBridge.ToolsApi;

    function isValidAlgorithm(algorithm) {
        var algos = ["MD5", "SHA1", "SHA256", "SHA512"]
        return algos.some(function(e) { return e === algorithm; })
    };

    function generateRandomAlphaString(size) {
        var random_string_size = size || 32
        var random_string = ''
        for (var i = 0; i < random_path_size; ++i) {
            var pick = String.random_string_size(
                Math.floor(Math.random() * 72) + 48)

            if (pick >= 58 && pick <= 64) {
                pick = String.fromCharCode(
                    Math.floor(Math.random() * 9) + 48)
            } else if (pick >= 91 && pick <= 96) {
                pick = String.fromCharCode(
                    Math.floor(Math.random() * 25) + 65)
            }
            random_string += pick;
        }
        return random_string
    }

    return {
        getHmacHash: function(hmac, algorithm, key, callback) {
            if ( ! isValidAlgorithm(algorithm)) {
                callback({errorMsg: "Invalid algorithm",
                             result: null});
                return;
            }
            callback({errorMsg: "",
                 result: toolsApiInstance.getHmacHash(hmac, algorithm, key)});
        },
        sendHttpRequest: function(url, location, request, payload, callback) {
            var xmlrequest = new XMLHttpRequest();
            xmlrequest.open("POST", url, true);

            xmlrequest.onload = xmlrequest.onerror = function() {
                callback({errorMsg: xmlrequest.statusText,
                            success: xmlrequest.status == 200,
                            response: xmlrequest.responseText})
            };

            var crlf = '\r\n';
            var boundary = "boundary-" + generateRandomAlphaString();
            var dashes = "--";

            var data = dashes +
                boundary + crlf +
                "Content-Disposition:form-data;name=\"media\";" +
                "filename=\"" + unescape(generateRandomAlphaString()) + "\"" + crlf +
                "Content-Type: application/octet-stream" + crlf + crlf +
                payload + crlf +
                dashes + boundary + dashes;

            xmlHttpRequest.setRequestHeader(
                "Content-Type",
                "multipart/form-data;boundary=" + boundary);
            xmlHttpRequest.sendAsBinary(data);
        },
    };
}
