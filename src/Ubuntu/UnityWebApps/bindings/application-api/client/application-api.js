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
 * ApplicationApi gives access to Application runtime information.

 * @module ApplicationApi
 */
function createApplicationApi(backendBridge) {
    var PLUGIN_URI = 'ApplicationApi';

/**
 * The ApplicationApi object

 * @class ApplicationApi
 * @constructor
 * @example

       var api = external.getUnityObject('1.0');
       api.ApplicationApi.applicationName(function(name) {
         console.log('Application name: ' + name);
       });
 */
    return {
        /**
           Enumeration of the available types of ScreenOrientation.

             Values:

               Landscape: The application screen is in landscape mode

               Portrait: The application screen is in portrait mode

               Unknown: The application screen is in an unknown mode

           @static
           @property ScreenOrientation {Object}

           @example

               var api = external.getUnityObject('1.0');
               var orientation = api.ApplicationApi.ScreenOrientation;
               // use orientation.Landscape or orientation.Portrait
         */
        ScreenOrientation: {
            Landscape: "Landscape",

            Portrait: "Portrait",

            Unknwon: "Unknown",
        },

        /**
         * Retrieves the disk location where the application is allowed to write its data in.
         *
         * @method getApplicationWritableLocation
         * @param callback {Function(String)} Function called with the location.
         */
        getApplicationWritableLocation: function(callback) {
            backendBridge.call('ApplicationApi.getApplicationWritableLocation'
                               , []
                               , callback);
        },

        /**
         * Retrieves the disk location where the application name.
         *
         * @method applicationName
         * @param callback {Function(String)} Function called with the application name.
         */
        applicationName: function(callback) {
            backendBridge.call('ApplicationApi.applicationName'
                               , []
                               , callback);
        },

        /**
         * Retrieves current platform information.
         *
         * @method getPlatformInfos
         * @param callback {Function(Object)} Function called with the platform information name.
         */
        getPlatformInfos: function(callback) {
            backendBridge.call('ApplicationApi.getPlatformInfos'
                               , []
                               , callback);
        },

        /**
         * Sets up a callback that is to be called when the application is about to quit.
         *
         * @method onAboutToQuit
         * @param callback {Function()} Function to be called when the application is about to quit.
         */
        onAboutToQuit: function(callback) {
            backendBridge.call('ApplicationApi.onAboutToQuit'
                               , [callback]);
        },

        /**
         * Sets up a callback that is to be called when the application has been deactivated (background).
         *
         * @method onDeactivated
         * @param callback {Function()} Function to be called when the application has been deactivated.
         */
        onDeactivated: function(callback) {
            backendBridge.call('ApplicationApi.onDeactivated'
                               , [callback]);
        },

        /**
         * Sets up a callback that is to be called when the application has been activated (from background).
         *
         * @method onActivated
         * @param callback {Function()} Function to be called when the application has been activated.
         */
        onActivated: function(callback) {
            backendBridge.call('ApplicationApi.onActivated'
                               , [callback]);
        },

        /**
         * Retrieves the current screen orientation.
         *
         * @method getScreenOrientation
         * @param callback {Function(ScreenOrientation)} Function to be called with the current screen orientation.
         */
        getScreenOrientation: function(callback) {
            backendBridge.call('ApplicationApi.getScreenOrientation'
                               , []
                               , callback);
        },

        /**
         * Sets up a callback that is to be called when the application's screen has changed its orientation.
         *
         * @method onScreenOrientationChanged
         * @param callback {Function(ScreenOrientation)} Function to be called when the application's screen orientation has changed.
         */
        onScreenOrientationChanged: function(callback) {
            backendBridge.call('ApplicationApi.onScreenOrientationChanged'
                               , [callback]);
        },

        /**
         * Sets up a URI handler. The application can be sent URIs to open.
         *
         * @method setupUriHandler
         * @param callback {Function([String])} Function to be called with the current list of uris to open
         */
        setupUriHandler: function(callback) {
            backendBridge.call('ApplicationApi.setupUriHandler'
                               , [callback]);
        },

        /**
         * Retrieves the current input method.
         *
         * @method getScreenOrientation
         * @param callback {Function(String)} Function to be called with the current input method
         */
        getInputMethod: function(callback) {
            backendBridge.call('ApplicationApi.getInputMethod'
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
            backendBridge.call('ApplicationApi.onInputMethodVisibilityChanged'
                               , [callback]);
        }
    };
};


