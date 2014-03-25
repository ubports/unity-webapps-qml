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

.import Ubuntu.UnityWebApps 0.1 as UnityWebAppsBridge


/**
 *
 * Application API backend binding
 *
 */
function createApplicationApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.UnityWebApps';
    var VERSION = 0.1;

    var applicationApiInstance = UnityWebAppsBridge.ApplicationApi;

    return {
        getApplicationWritableLocation: function(callback) {
            if (callback && typeof(callback) === 'function')
                callback(applicationApiInstance.applicationDataPath);
        },

        getPlatformInfos: function(callback) {
            if (callback && typeof(callback) === 'function')
                callback(applicationApiInstance.applicationPlatform);
        },

        setInputMethodVisible: function(visible, callback) {
            applicationApiInstance.setInputMethodVisible(visible);
            if (callback && typeof(callback) === 'function')
                callback();
        },
        getInputMethod: function(callback) {
            if (callback && typeof(callback) === 'function')
                callback(applicationApiInstance.getInputMethod());
        },
        onInputMethodVisibilityChanged: function(callback) {
            if (callback && typeof(callback) === 'function')
                    Qt.inputMethod.onVisibleChanged.connect(function() {
                        callback(Qt.inputMethod.visible)
                    });
        },

        applicationName: function(callback) {
            if (callback && typeof(callback) === 'function')
                callback(applicationApiInstance.applicationName);
        },

        onAboutToQuit: function(callback) {
            if (callback && typeof(callback) === 'function')
                applicationApiInstance.applicationAboutToQuit.connect(function(killed) {
                    callback(killed);
                });
        },

        onDeactivated: function(callback) {
            if (callback && typeof(callback) === 'function')
                applicationApiInstance.applicationDeactivated.connect(callback);
        },

        onActivated: function(callback) {
            if (callback && typeof(callback) === 'function')
                applicationApiInstance.applicationActivated.connect(callback);
        },

        getScreenOrientation: function(callback) {
            if (callback && typeof(callback) === 'function')
                callback(applicationApiInstance.screenOrientation);
        },
        onScreenOrientationChanged: function(callback) {
            if (callback && typeof(callback) === 'function')
                applicationApiInstance.applicationScreenOrientationChanged.connect(callback);
        },

        // Internal

        dispatchToObject: function(infos) {
        }
    };
}
