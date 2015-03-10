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

    function stringToCryptoAlgorithm(algorithm) {
        var assoc = {
            "MD5": toolsApiInstance.MD5
            , "SHA1": toolsApiInstance.SHA1
            , "SHA256": toolsApiInstance.SHA256
            , "SHA512": toolsApiInstance.SHA512
        };
        return assoc[algorithm]
    };

    function generateRandomAlphaString(size) {
        var random_string_size = size || 32
        var random_string = ''
        for (var i = 0; i < random_string_size; ++i) {
            var pick = Math.floor(Math.random() * 72) + 48
            if (pick >= 58 && pick <= 64) {
                pick = Math.floor(Math.random() * 9) + 48
            } else if (pick >= 91 && pick <= 96) {
                pick = Math.floor(Math.random() * 25) + 65
            }
            random_string += String.fromCharCode(pick);
        }
        return random_string
    }

    return {
        getHmacHash: function(message, algorithm, key, callback) {
            if ( ! isValidAlgorithm(algorithm)) {
                callback({errorMsg: "Invalid algorithm",
                             result: null});
                return;
            }
            console.log(stringToCryptoAlgorithm(algorithm))
            callback({errorMsg: "",
                 result: toolsApiInstance.getHmacHash(
                             message, stringToCryptoAlgorithm(algorithm), key)});
        },
        sendHttpRequest: function(url, location, request, payload, callback) {
            var xmlrequest = new XMLHttpRequest();

            xmlrequest.open("POST", url, true);

            console.log(url)

            xmlrequest.onreadystatechange = function() {
                console.log('xmlrequest.readyState ' + xmlrequest.readyState)

                if (xmlrequest.readyState == XMLHttpRequest.DONE) {
                    console.log('DONE ' + xmlrequest.statusText + ', ' + xmlrequest.responseText)

                    callback({errorMsg: xmlrequest.statusText,
                                success: xmlrequest.status == 200,
                                response: xmlrequest.responseText})
                }
            };

            for (var header in request.headers) {
                if (request.headers.hasOwnProperty(header)) {
                    xmlrequest.setRequestHeader(header, request.headers[header])
                    console.log(request.headers[header])
                }
            }

            var crlf = '\r\n';
            var boundary = "boundary-" + generateRandomAlphaString();
            var boundary_prefix = "--";

            xmlrequest.setRequestHeader(
                "Content-Type", "multipart/form-data; boundary=" + boundary);

            console.log('boundary : ' + boundary)

            var request_data_head = boundary_prefix + boundary + crlf +
                "Content-Disposition: form-data; name=\"media\"; filename=\"" + generateRandomAlphaString() + "\"" + crlf +
                "Content-Transfer-Encoding: base64" + crlf +
                "Content-Type: application/octet-stream" + crlf +
                crlf;

            console.log('request_data_head ' + request_data_head);

            var request_data_tail = boundary_prefix + boundary + boundary_prefix;

            console.log('request_data_tail ' + request_data_tail);

            xmlrequest.send(request_data_head + payload + crlf + request_data_tail);
        },
    };
}
