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

.import Ubuntu.Components 0.1 as ComponentsBridge

/**
 *
 * Alarm API backend binding
 *
 */
function createAlarmApi(backendDelegate) {
    var PLUGIN_URI = 'Ubuntu.Components';
    var VERSION = 0.1;

    function _nameToAlarmType(name) {
        var alarmTypePerName = {
            "OneTime": ComponentsBridge.Alarm.OneTime,
            "Repeating": ComponentsBridge.Alarm.Repeating,
        };
        return name in alarmTypePerName ?
                    alarmTypePerName[name]
                  : ComponentsBridge.Alarm.OneTime;
    };
    function _alarmTypeToName(type) {
        if (type === ComponentsBridge.Alarm.OneTime)
            return "OneTime";
        else if (type === ComponentsBridge.Alarm.Repeating)
            return "Repeating";
        return ;
    };

    function Alarm(alarm, objectid) {
        var id = objectid;
        if ( ! alarm) {
            var result = backendDelegate.createQmlObject(
                        PLUGIN_URI, VERSION, 'Alarm');
            id = result.id;
            alarm = result.object;
        }
        if ( ! id) {
            id = backendDelegate.storeQmlObject(alarm,
                    PLUGIN_URI, VERSION, 'Account');
        }

        this._id = id;
        this._object = alarm;
    };
    Alarm.prototype = {
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
            return {
                type: 'object-proxy',
                apiid: 'Alarm',
                objecttype: 'Alarm',
                objectid: this._id,
            }
        },

        // methods
        cancel: function() {
            this._validate();
            this._object.cancel();
        },
        reset: function() {
            this._validate();
            this._object.reset();
        },
        save: function() {
            this._validate();
            this._object.save();
        },


        // properties
        error: function(callback) {
            this._validate();
            callback(this._object.error);
        },

        date: function(callback) {
            this._validate();
            callback(this._object.date.getTime());
        },
        setDate: function(date, callback) {
            this._validate();
            var _date = new Date();
            _date.setTime(parseInt(date));
            this._object.date = _date;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        daysOfWeek: function(callback) {
            this._validate();
            callback(this._object.daysOfWeek);
        },
        setDaysOfWeek: function(daysOfWeek, callback) {
            this._validate();
            this._object.daysOfWeek = daysOfWeek;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        enabled: function(callback) {
            this._validate();
            callback(this._object.enabled);
        },
        setEnabled: function(enabled, callback) {
            this._validate();
            this._object.enabled = enabled;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        message: function(callback) {
            this._validate();
            callback(this._object.message);
        },
        setMessage: function(message, callback) {
            this._validate();
            this._object.message = message;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        sound: function(callback) {
            this._validate();
            callback(this._object.sound);
        },
        setSound: function(sound, callback) {
            this._validate();
            this._object.sound = sound;
            if (callback && typeof(callback) === 'function')
                callback();
        },

        status: function(callback) {
            this._validate();
            callback(this._object.status.toString());
        },

        type: function(callback) {
            this._validate();
            callback(_alarmTypeToName(this._object.type));
        },
        setType: function(type, callback) {
            this._validate();
            this._object.type = _nameToAlarmType(type);
            if (callback && typeof(callback) === 'function')
                callback();
        },

        // internal

        internal: {
            error: function(self) {
                return self._object.error;
            }
        }
    };

    function _constructorFromName(className) {
        var constructorPerName = {
            "Alarm": Alarm,
        };
        return className in constructorPerName
                ? constructorPerName[className]
                : null;
    }

    return {
        createAlarm: function(callback) {
            console.log('createAlarm')
            var alarm = new Alarm();
            callback(alarm.serialize());
        },

        createAndSaveAlarmFor: function(date, type, daysOfWeek, message, callback) {
            var alarm = new Alarm();

            alarm.setDate(date);
            alarm.setMessage(message);
            alarm.setType(_nameToAlarmType(type));
            alarm.setDaysOfWeek(daysOfWeek);
            alarm.save();

            if (callback && typeof(callback) === 'function')
                callback(alarm.internal.error(alarm));

            alarm.destroy();
        },


        // Internal

        dispatchToObject: function(infos) {
            var args = infos.args;
            var callback = infos.callback;
            var method_name = infos.method_name;
            var objectid = infos.objectid;
            var class_name = infos.class_name;

            if (callback)
                args.push(callback);

            var o = backendDelegate.objectFromId(objectid);
            if (o == null) {
                console.debug('Cannot dispatch to unknown object: ' + objectid);
                return;
            }

            var Constructor = _constructorFromName(class_name);

            var instance = new Constructor(o, objectid);

            instance[method_name].apply(instance, args);
        }
    };
}
