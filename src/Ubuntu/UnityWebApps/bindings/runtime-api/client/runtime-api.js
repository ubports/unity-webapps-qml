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
 * RuntimeApi gives access to the application runtime information and management.

 * @module RuntimeApi
 */
function createRuntimeApi(backendBridge) {
    var PLUGIN_URI = 'RuntimeApi';

    function Application(id, content) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'Application', id);

        this._name = content.name;
        this._platform = content.platform;
        this._writableLocation = content.writableLocation;
        this._screenOrientation = content.screenOrientation;
    };
    Application.prototype = {

        /**
         * Retrieves the application name.
         *
         * @method getApplicationName
         * @return {String} application name
         */
        getApplicationName: function() {
            return this._name;
        },

        /**
         * Sets up a callback that is to be called when the application's name changed.
         *
         * @method onApplicationNameChanged
         * @param callback {Function(String)} Function to be called when the application's name has changed.
         */
        onApplicationNameChanged: function(callback) {
            var self = this;
            this._proxy.call('onApplicationNameChanged'
                               , [function(name) {self._name = name; callback(name); }]);
        },

        /**
         * Retrieves the fileystem location where the application is allowed to write its data in.
         *
         * @method getApplicationWritableLocation
         * @return {String} application writable location path
         */
        getApplicationWritableLocation: function() {
            return this._writableLocation;
        },

        /**
         * Retrieves current platform information.
         *
         * @method getPlatformInfos
         * @return {Object} platform information as a dictionary with the following keys:
         *  - name: the platform name
         */
        getPlatformInfo: function() {
            return this._platform;
        },

        /**
         * Sets up a callback that is to be called when the application is about to quit.
         *
         * @method onAboutToQuit
         * @param callback {Function()} Function to be called when the application is about to quit.
         */
        onAboutToQuit: function(callback) {
            this._proxy.call('onAboutToQuit'
                               , [callback]);
        },

        /**
         * Sets up a callback that is to be called when the application has been deactivated (background).
         *
         * @method onDeactivated
         * @param callback {Function()} Function to be called when the application has been deactivated.
         */
        onDeactivated: function(callback) {
            this._proxy.call('onDeactivated'
                               , [callback]);
        },

        /**
         * Sets up a callback that is to be called when the application has been activated (from background).
         *
         * @method onActivated
         * @param callback {Function()} Function to be called when the application has been activated.
         */
        onActivated: function(callback) {
            this._proxy.call('onActivated'
                               , [callback]);
        },

        /**
         * Retrieves the current screen orientation.
         *
         * @method getScreenOrientation
         * @return {ScreenOrientation} current screen orientation.
         */
        getScreenOrientation: function() {
            return this._screenOrientation;
        },

        /**
         * Sets up a callback that is to be called when the application's screen has changed its orientation.
         *
         * @method onScreenOrientationChanged
         * @param callback {Function(ScreenOrientation)} Function to be called when the application's screen orientation has changed.
         */
        onScreenOrientationChanged: function(callback) {
            var self = this;
            this._proxy.call('onScreenOrientationChanged'
                               , [function(orientation) {self._screenOrientation = orientation; callback(orientation); }]);
        },

        /**
         * Sets up a URI handler. The application can be sent URIs to open.
         *
         * @method setupUriHandler
         * @param callback {Function([String])} Function to be called with the current list of uris to open
         */
        setupUriHandler: function(callback) {
            this._proxy.call('setupUriHandler'
                               , [callback]);
        },

        /**
         * Retrieves the current input method's name. The name varies depending on the platform
         * e.g. maliit can be part of the name for a maliit based Virtual Keyboard (possibly mangled
         * with e.g. 'phablet'), when a keyboard is there the name can be empty, ...
         *
         * @method getInputMethodName
         * @param callback {Function(String)} Function to be called with the current input method name
         */
        getInputMethodName: function(callback) {
            this._proxy.call('getInputMethodName'
                               , []
                               , callback);
        },

        /**
         * Sets up a callback that is to be called when the On Screen Keyboard visibility has changed.
         *
         * @method onInputMethodVisibilityChanged
         * @param callback {Function(Bool)} Function to be called when the On Screen Keyboard visibility has changed (received the visibility as an arg).
         */
        onInputMethodVisibilityChanged: function(callback) {
            this._proxy.call('onInputMethodVisibilityChanged'
                               , [callback]);
        }
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "Application": Application,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    };


/**
 * The RuntimeApi object

 * @class RuntimeApi
 * @constructor
 * @example

       var api = external.getUnityObject('1.0');
       api.RuntimeApi.getApplication(function(application) {
         console.log('Application name: ' + application.getApplicationName());
       });
 */
    return {
        /**
           Enumeration of the available types of ScreenOrientation.

             Values:

               Landscape: The application screen is in landscape mode

               InvertedLandscape: The application screen is in inverted landscape mode

               Portrait: The application screen is in portrait mode

               InvertedPortrait: The application screen is in inverted portrait mode

               Unknown: The application screen is in an unknown mode

           @static
           @property ScreenOrientation {Object}

           @example

               var api = external.getUnityObject('1.0');
               var orientation = api.RuntimeApi.ScreenOrientation;
               // use orientation.Landscape or orientation.Portrait
         */
        ScreenOrientation: {
            Landscape: "Landscape",

            InvertedLandscape: "InvertedLandscape",

            Portrait: "Portrait",

            InvertedPortrait: "InvertedPortrait",

            Unknwon: "Unknown",
        },

        /**
         * Creates an Application object.
         *
         * @method getApplication
         * @param callback {Function (Application)}
         */
        getApplication: function(callback) {
            backendBridge.call('RuntimeApi.getApplication'
                               , []
                               , callback);
        },

        /**
         * @private
         *
         */
        createObjectWrapper: function(objectType, objectId, content) {
            var Constructor = _constructorFromName(objectType);
            return new Constructor(objectId, content);
        },
    };
};


