/**
 * AlarmApi gives access to Alarm management.

 * @module AlarmApi
 */
function createAlarmApi(backendBridge) {
    var PLUGIN_URI = 'Alarm';

/**
 * An Alarm.

 * @class Alarm
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
    function Alarm(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'Alarm', id);
    };
    Alarm.prototype = {

        // properties

        /**
         * The property holds the error code occurred during the last performed operation.
         *
         * @method error
         * @param callback {Function(Error)}
         */
        error: function(callback) {
            this._proxy.call('error', [], callback);
        },

        /**
         * Retrieves the alarm date.
         *
         * The date property holds the date the alarm will be triggered.
         * The default value is the current date and time the alarm object was created.
         * Further reset calls will bring the value back to the time the reset was called.
         *
         * @method error
         * @param callback {Function(Date)}
         */
        date: function(callback) {
            this._proxy.call('date', []
                             , function(datems) {
                                 var d = new Date(); d.setTime(datems); return d;
                             });
        },
        /**
         * Sets the alarm date.
         *
         * @method setDate
         * @param date {Date}
         * @param callback (optional) {Function()} To be called after the date is set.
         */
        setDate: function(date, callback) {
            this._proxy.call('setDate', [date.getTime(), callback]);
        },

        /**
         * Retrieves the alarm's enabled state.
         *
         * The property specifies whether the alarm is enabled or not.
         * Disable dalarms are not scheduled. The default value is true
         *
         * @method enabled
         * @param callback {Function(Boolean)}
         */
        enabled: function(callback) {
            this._proxy.call('enabled', [], callback);
        },
        /**
         * Sets the alarm's enabled state.
         *
         * @method setEnabled
         * @param enabled {Boolean}
         * @param callback (optional) {Function()} To be called after the enabled state is set.
         */
        setEnabled: function(enabled, callback) {
            this._proxy.call('setEnabled', [enabled, callback]);
        },

        /**
         * Retrieves the alarm message.
         *
         * The property holds the message string which will be displayed when the alarm is triggered.
         * The default value is the localized "Alarm" text
         *
         * @method message
         * @param callback {Function(String)}
         */
        message: function(callback) {
            this._proxy.call('message', [], callback);
        },
        /**
         * Sets the alarm message.
         *
         * @method setMessage
         * @param message {String}
         * @param callback (optional) {Function()} To be called after the message is set.
         */
        setMessage: function(message, callback) {
            this._proxy.call('setMessage', [message, callback]);
        },

        /**
         * Retrieves the alarm sound.
         *
         * The property holds the alarm's sound to be played when the alarm is triggered.
         * An empty url will mean to play the default sound.
         *
         * The default value is an empty url.
         *
         * @method sound
         * @param callback {Function(String)}
         */
        sound: function(callback) {
            this._proxy.call('sound', [], callback);
        },
        /**
         * Sets the alarm sound.
         *
         * @method setSound
         * @param sound {String}
         * @param callback (optional) {Function()} To be called after the sound is set.
         */
        setSound: function(sound, callback) {
            this._proxy.call('setSound', [sound, callback]);
        },

        /**
         * Retrieves the alarm status.
         *
         * The property holds the status of the last performed operation
         *
         * @method status
         * @param callback {Function(String)}
         */
        status: function(callback) {
            this._proxy.call('status', [], callback);
        },

        /**
         * Retrieves the alarm type.
         *
         * The property holds the type of the alarm.
         * The default value is AlarmType.OneTime
         *
         * @method type
         * @param callback {Function(AlarmType)}
         */
        type: function(callback) {
            this._proxy.call('type', [], callback);
        },
        /**
         * Sets the alarm type.
         *
         * @method setType
         * @param type {AlarmType}
         * @param callback (optional) {Function()} To be called after the type is set.
         */
        setType: function(type, callback) {
            this._proxy.call('setType', [type, callback]);
        },

        /**
         * Retrieves the alarm day of the week.
         *
         * The property holds the days of the week the alarm is scheduled.
         * This property can have only one day set for one time alarms and multiple days for repeating alarms.
         *
         * @method daysOfWeek
         * @param callback {Function(AlarmType)}
         */
        daysOfWeek: function(callback) {
            this._proxy.call('daysOfWeek', [], callback);
        },
        /**
         * Sets the alarm day of the week.
         *
         * @method setDaysOfWeek
         * @param daysOfWeek {AlarmDayOfWeek}
         * @param callback (optional) {Function()} To be called after the day of the week is set.
         */
        setDaysOfWeek: function(daysOfWeek, callback) {
            this._proxy.call('setDaysOfWeek', [daysOfWeek, callback]);
        },


        // methods

        /**
         * Cancels a given Alarm.
         * 
         * @method cancel
         */
        cancel: function() {
            this._proxy.call('cancel', []);
        },

        /**
         * Resets a given Alarm.
         * 
         * @method reset
         */
        reset: function() {
            this._proxy.call('reset', []);
        },

        /**
         * Saves the alarm as a system wide alarm with the parameters previously set.
         *
         * @method save
         */
        save: function() {
            this._proxy.call('save', []);
        },

        // extras

        /**
         * Destroys the remote object. This proxy object is not valid anymore.
         *
         * @method destroy
         */
        destroy: function() {
            this._proxy.call('destroy', []);
        },
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "Alarm": Alarm,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    };

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
        AlarmType: {
            // The alarm occurs only once.
            OneTime: "OneTime",

            // The alarm is a repeating one, either daily, weekly on a given day or on selected days.
            Repeating: "Repeating",
        },

        /**
           Flags for the week days an Alarm should be triggered.
           
             Values:

               Monday: The alarm will kick on Mondays

               Tuesday: The alarm will kick on Tuesdays

               Wednesday: The alarm will kick on Wednesday

               Thursday: The alarm will kick on Thursday

               Friday: The alarm will kick on Friday

               Saturday: The alarm will kick on Saturday

               Sunday: The alarm will kick on Sunday

               AutoDetect: The alarm day will be detected
                 from the alarm date.
           
           @static
           @property AlarmDayOfWeek {Integer}
           
           @example

               var api = external.getUnityObject('1.0');
               var dayofweek = api.AlarmApi.AlarmDayOfWeek;
               // use dayofweek.Monday or/and dayofweek.Tuesday, etc.
         */
        AlarmDayOfWeek: {
            // The alarm will kick on Mondays.
            Monday: 1,

            // The alarm will kick on Tuesdays.
            Tuesday: 2,

            // The alarm will kick on Wednesdays.
            Wednesday: 4,

            // The alarm will kick on Thursdays.
            Thursday: 8,

            // The alarm will kick on Fridays.
            Friday: 16,

            // The alarm will kick on Saturdays.
            Saturday: 32,

            // The alarm will kick on Sundays.
            Sunday: 64,

            // The alarm day will be detected from the alarm date.
            AutoDetect: 128,
        },

        /**
         Error ids returned during AlarmApi calls.
         
           Values:

             NoError: Successful operation completion
             
             InvalidDate: The date specified for the alarm was invalid
             
             EarlyDate: The date specified for the alarm is an earlier
                 date than the current one

             NbDaysOfWeek: The daysOfWeek parameter of the alarm was not specified
             
             OneTimeOnMoreDays: The one-time alarm was set to be kicked in several days
             
             InvalidEvent: The alarm event is invalid
             
             AdaptationError: The error occurred in alarm adaptation layer.
                 Adaptations may define additional behind this value
         
          
         @static
         @property AlarmError {Integer}
         
         @example
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
        AlarmError: {
            // Successful operation completion
            NoError: 0,

            // The date specified for the alarm was invalid
            InvalidDate: 1,

            // The date specified for the alarm is an earlier date than the current one
            EarlyDate: 2,

            // The daysOfWeek parameter of the alarm was not specified
            NoDaysOfWeek: 3,

            // The one-time alarm was set to be kicked in several days
            OneTimeOnMoreDays: 4,

            // The alarm event is invalid
            InvalidEvent: 5,

            // The error occurred in alarm adaptation layer. Adaptations may define additional behind this value
            AdaptationError: 6,
        },

        /**
         * Creates a Alarm object.
         * 
         * @method createAlarm
         * @param callback {Function(Alarm)} Function called with the created Alarm.
         */
        createAlarm: function(callback) {
            backendBridge.call('Alarm.createAlarm'
                               , []
                               , callback);
        },

        api: {
            /**
             * Creates and saves a new alarm.
             *
             * @method api.createAndSaveAlarmFor
             * @param date {Date} date at which the alarm is to be triggered.
             * @param type {AlarmType} type of the alarm.
             * @param daysOfWeek {AlarmDayOfWeek} days of the week the alarm is scheduled.
             * @param message {String} Message to be displayed when the alarm is triggered.
             * @param callback (optional) {Function(AlarmError)} Function to be called when the alarm has been saved.
             */
            createAndSaveAlarmFor: function(date, type, daysOfWeek, message, callback) {
                backendBridge.call('Alarm.createAndSaveAlarmFor'
                                   , [date.getTime(), type, daysOfWeek, message, callback]);
            },

            /**
             * Returns a message adapted to the given error id.
             *
             * @method api.errorToMessage
             * @param error {AlarmError} error id.
             */
            errorToMessage: function(error) {
                var messagePerError = [
                    "Successful operation completion",
                    "The date specified for the alarm was invalid",
                    "The date specified for the alarm is an earlier date than the current one",
                    "The daysOfWeek parameter of the alarm was not specified",
                    "The one-time alarm was set to be kicked in several days",
                    "The alarm event is invalid",
                    "The error occurred in alarm adaptation layer"
                  ];
                return error < messagePerError.length
                        ? messagePerError[error]
                        : "Invalid error id";
            },
        },


        // Internal

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


