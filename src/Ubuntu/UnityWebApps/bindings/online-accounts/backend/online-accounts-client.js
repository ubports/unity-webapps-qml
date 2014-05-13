/*
 * Copyright 2014 Canonical Ltd.
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
 *
 * Online Accounts client API backend binding
 *
 */
function createOnlineAccountsClientApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.OnlineAccounts.Client';
    var VERSION = 0.1;

    function Setup(params) {
        var result = backendDelegate.createQmlObject(
                    PLUGIN_URI, VERSION, 'Setup', params);
        this._id = result.id;
        this._object = result.object;
    };
    Setup.prototype = {
        _validate: function() {
            if (! this._object)
                throw new TypeError("Invalid object null");
        },

        destroy: function() {
            if (! this._object)
                return;
            this._object.destroy();
            backendDelegate.deleteId(this._id);
        },

        // object methods
        serialize: function() {
            this._validate();
            return {
                type: 'object-proxy',
                apiid: 'OnlineAccounts.Client',
                objecttype: 'Setup',
                objectid: this._id,
            }
        },

        // methods
        exec: function(callback) {
            this._validate();

            var self = this;

            var onFinished = function() {
                self._object.onFinished.disconnect(onFinished);
                callback();
            }

            this._object.onFinished.connect(onFinished);
            this._object.exec();
        }
    };

    return {
        requestAccount: function(applicationId, providerId, callback) {
            var setup = new Setup({
                'applicationId': applicationId,
                'providerId': providerId,
            });
            var onFinished = function() {
                setup.destroy();
                callback();
            };
            setup.exec(onFinished);
        },
    };
}
