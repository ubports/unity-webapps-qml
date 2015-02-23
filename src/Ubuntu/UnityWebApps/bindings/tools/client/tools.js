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


/**
 * Tools gives access to various helpers/tools.

 * @module Tools
 */
function createToolsApi(backendBridge) {
    var PLUGIN_URI = 'Tools';

/**
 * The Tools object

 * @class Tools
 * @constructor
 * @example

       var api = external.getUnityObject('1.0');
       api.Tools.getHmacHash(hmac, algorithm, key, function(result) {
         console.log('Application name: ' + result);
       });
 */
    return {
        /**
           Enumeration of the available types of CryptographicAlgorithm.

             Values:

               MD5: MD5 hash function

               SHA1: SHA1 hash function

               SHA256: SHA-256 hash function

               SHA512: SHA-512 hash function

           @static
           @property CryptographicAlgorithm {Object}

           @example

               var api = external.getUnityObject('1.0');
               var algorithm = api.Tools.CryptographicAlgorithm;
               // use algorithm.MD5, algorithm.SHA-1, ...
         */
        CryptographicAlgorithm: {
            MD5: "MD5",

            SHA1: "SHA1",

            SHA256: "SHA256",

            SHA512: "SHA512",
        },

        /**
         * Generates a .
         *
         * @method getHmacHash
         * @param hmac {Function (Application)}
         * @param algorithm {CryptographicAlgorithm}
         * @param key {Function (Application)}
         * @param callback {Function (Application)}
         */
        getHmacHash: function(hmac, algorithm, key, callback) {
            if (! callback || typeof(callback) !== 'function') {
                return;
            }
            backendBridge.call('Tools.getHmacHash'
                               , [hmac, algorithm, key]
                               , callback);
        },
    };
};


