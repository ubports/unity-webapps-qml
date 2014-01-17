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
        setDate: function(date) {
            this._proxy.call('setDate', [date.getTime()]);
        },

        enabled: function() {
            this._proxy.call('enabled', [], callback);
        },
        setEnabled: function(enabled) {
            this._proxy.call('setEnabled', [enabled]);
        },

        message: function() {
            this._proxy.call('message', [], callback);
        },
        setMessage: function(message) {
            this._proxy.call('setMessage', [message]);
        },

        sound: function() {
            this._proxy.call('sound', [], callback);
        },
        setSound: function(sound) {
            this._proxy.call('setSound', [sound]);
        },

        status: function() {
            this._proxy.call('status', [], callback);
        },
        setStatus: function(status) {
            this._proxy.call('setStatus', [status]);
        },

        type: function(callback) {
            this._proxy.call('type', [], callback);
        },
        setType: function(type) {
            this._proxy.call('setType', [type]);
        },


        // methods

        cancel: function() {
            this._proxy.call('cancel', []);
        },
        reset: function() {
            this._proxy.call('reset', []);
        },
        save: function() {
            this._proxy.call('save', []);
        },
    };

    return {
        /**
         * Calls a plain raw API function.
         * 
         * @method call
         * @param
         */
        createAlarm: function(callback) {
            backendBridge.call('Alarm.createAlarm'
                               , []
                               , callback);
        },

        api: {
            createAndSaveAlarmFor: function(date, message) {
                backendBridge.call('Alarm.createAndSaveAlarmFor'
                                   , [date.getUTCMilliseconds()
                                      , message]);
            },
        },


        // Internal

        /**
         * @private
         *
         */
        createObjectWrapper: function(objectType, objectId) {
            var Constructor = _constructorFromName(objectType);
            return new Constructor(objectId);
        },
    };
};


