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
 * The AlarmApi object

 * @class AlarmApi
 * @constructor
 * @example

       var date = new Date();
       <set a valid date in the future>

       var api = external.getUnityObject('1.0');
       api.AlarmApi.api.createAndSaveAlarmFor(
          date,
          api.AlarmApi.AlarmType.OneTime,
          api.AlarmApi.AlarmDayOfWeek.AutoDetect,
          "alarm triggered",
          function(errorid) {
              console.log(api.AlarmApi.api.errorToMessage(errorid));
          });
 */
    return {
        /**
           Enumeration of the available types of Alarm.

             Values:

               OneTime: The alarm occurs only once

               Repeating: The alarm is a repeating one,
                   either daily, weekly on a given day
                   or on selected days

           @static
           @property AlarmType {Object}

           @example

               var api = external.getUnityObject('1.0');
               var alarmtype = api.AlarmApi.AlarmType;
               // use alarmtype.OneTime or alarmtype.Repeating
         */
        ScreenOrientation: {
            // The alarm occurs only once.
            Landscape: "Landscape",

            // The alarm is a repeating one, either daily, weekly on a given day or on selected days.
            Portrait: "Portrait",
        },

        /**
         * Creates a Alarm object.
         *
         * @method createAlarm
         * @param callback {Function(Alarm)} Function called with the created Alarm.
         */
        getApplicationWritableLocation: function(callback) {
            backendBridge.call('ApplicationApi.getApplicationWritableLocation'
                               , []
                               , callback);
        },

        /**
         * Creates a Alarm object.
         *
         * @method createAlarm
         * @param callback {Function(Alarm)} Function called with the created Alarm.
         */
        applicationName: function(callback) {
            backendBridge.call('ApplicationApi.applicationName'
                               , []
                               , callback);
        },

        getPlatformInfos: function(callback) {
            backendBridge.call('ApplicationApi.getPlatformInfos'
                               , []
                               , callback);
        },

        onAboutToQuit: function(callback) {
            backendBridge.call('ApplicationApi.onAboutToQuit'
                               , [callback]);
        },

        onDeactivated: function(callback) {
            backendBridge.call('ApplicationApi.onDeactivated'
                               , [callback]);
        },

        onActivated: function(callback) {
            backendBridge.call('ApplicationApi.onActivated'
                               , [callback]);
        },

        getScreenOrientation: function(callback) {
            backendBridge.call('ApplicationApi.getScreenOrientation'
                               , []
                               , callback);
        },

        onScreenOrientationChanged: function(callback) {
            backendBridge.call('ApplicationApi.onScreenOrientationChanged'
                               , [callback]);
        },

        setInputMethodVisible: function(visible) {
            backendBridge.call('ApplicationApi.setInputMethodVisible'
                               , [visible]
                               , callback);
        },

        getInputMethod: function(callback) {
            backendBridge.call('ApplicationApi.getInputMethod'
                               , []
                               , callback);
        }
    };
};


