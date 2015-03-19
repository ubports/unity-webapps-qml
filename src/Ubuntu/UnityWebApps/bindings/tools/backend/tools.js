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

    return {
        getHmacHash: function(message, algorithm, key, callback) {
            if ( ! isValidAlgorithm(algorithm)) {
                callback({errorMsg: "Invalid algorithm",
                             result: null});
                return;
            }
            callback({errorMsg: "",
                 result: toolsApiInstance.getHmacHash(
                             message, stringToCryptoAlgorithm(algorithm), key)});
        },
        sendHttpRequest: function(url, location, request, payload, callback) {
            if ( ! toolsApiInstance.areCompatibleCorsUrl(url, location)) {
                console.error('sendHttpRequest: incompatible CORS request urls')
                return;
            }

            var xmlrequest = new XMLHttpRequest();

            var verb = payload && payload.length !== 0
                    ? "POST" : "GET"

            xmlrequest.open(verb, url, true);

            xmlrequest.onreadystatechange = function() {
                if (xmlrequest.readyState === XMLHttpRequest.DONE) {
                    callback({
                        errorMsg: xmlrequest.statusText,
                        success: xmlrequest.status == 200,
                        response: xmlrequest.responseText
                    });
                }
            };

            for (var header in request.headers) {
                if (request.headers.hasOwnProperty(header)) {
                    xmlrequest.setRequestHeader(header, request.headers[header])
                }
            }

            xmlrequest.setRequestHeader(
                "Content-Length",
                String(payload.length));

            xmlrequest.send(payload);
        }
    };
}
