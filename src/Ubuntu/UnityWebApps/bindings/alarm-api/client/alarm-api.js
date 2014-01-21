function createAlarmApi(backendBridge) {
    var PLUGIN_URI = 'Alarm';

    function Alarm(id) {
        this._proxy = backendBridge.createRemoteObject(
            PLUGIN_URI, 'Alarm', id);
    };
    Alarm.prototype = {
        // properties
        error: function() {
            this._proxy.call('error', [], callback);
        },

        date: function() {
            this._proxy.call('date', [], callback);
        },
        setDate: function(date, callback) {
            this._proxy.call('setDate', [date.getTime(), callback]);
        },

        enabled: function() {
            this._proxy.call('enabled', [], callback);
        },
        setEnabled: function(enabled, callback) {
            this._proxy.call('setEnabled', [enabled, callback]);
        },

        message: function() {
            this._proxy.call('message', [], callback);
        },
        setMessage: function(message, callback) {
            this._proxy.call('setMessage', [message, callback]);
        },

        sound: function() {
            this._proxy.call('sound', [], callback);
        },
        setSound: function(sound, callback) {
            this._proxy.call('setSound', [sound, callback]);
        },

        status: function() {
            this._proxy.call('status', [], callback);
        },
        setStatus: function(status, callback) {
            this._proxy.call('setStatus', [status, callback]);
        },

        type: function(callback) {
            this._proxy.call('type', [], callback);
        },
        setType: function(type, callback) {
            this._proxy.call('setType', [type, callback]);
        },


        // methods

        /**
         *
         * @method cancel
         */
        cancel: function() {
            this._proxy.call('cancel', []);
        },

        /**
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

    return {
        /**
         * Creates a Alarm object.
         * 
         * @method createAlarm
         * @param callback {Function ({Alarm})} Function called with the created Alarm.
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
             * @method createAndSaveAlarmFor
             * @param date {Date} date at which the alarm is to be triggered.
             * @param message {String} Message to be displayed when the alarm is triggered.
             */
            createAndSaveAlarmFor: function(date, message) {
                backendBridge.call('Alarm.createAndSaveAlarmFor'
                                   , [date.getTime(), message]);
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


