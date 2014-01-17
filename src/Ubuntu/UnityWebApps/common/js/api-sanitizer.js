var dummy = true;

function checkString(str, allowUndef) {
    if (allowUndef && str == undefined) {
        return;
    }
    if (!str || typeof(str) !== 'string') {
        throw new TypeError("incorrect argument");
    }
}

var findName = function(func, prefix, obj) {
    if (!prefix) {
        return findName(func, 'Unity.', api);
    }
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        if (typeof(keys[i]) !== 'string') {
            continue;
        }
        var descr = Object.getOwnPropertyDescriptor(obj, keys[i]);
        if (descr.value === func) {
            return prefix + keys[i];
        }
        if (descr.value instanceof Object) {
            var res = findName(func, prefix + keys[i] + '.', obj[keys[i]]);
            if (res)
                return res;
        }
        if (obj.__lookupGetter__(keys[i]) === func) {
            return prefix + keys[i];
        }
        if (obj.__lookupSetter__(keys[i]) === func) {
            return prefix + keys[i];
        }
    }
    return null;
};

var stringify = function (obj) {
    if (obj === undefined)
        return obj;
    if (obj === null)
        return obj;
    if (typeof(obj) == 'string')
        return obj;
    if (typeof(obj) == 'number')
        return obj;
    if (typeof(obj) == 'function')
        return String(obj);
    var dump = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            dump[i] = stringify(obj[i]);
    }
    return dump;
};

var stringifyArgs = function (obj) {
    var args = [];
    for (var i = 0; i < obj.length; i++) {
        args.push(stringify(obj[i]));
    }
    var res = JSON.stringify(args);
    return res.substr(1, res.length - 2);
};
var createArgumentsSanitizer = function (argsDesc, function_name) {
    var callback = function() {
        var args = [];
        args.push(function_name);
        args.push(Array.slice.call(arguments));
        backend.call.apply(backend, args);
    };
    return function () {
        var realArgs = arguments;
        var name = findName(arguments.callee);

        var k = 0;
        function argumentSanitaizer(desc, arg) {
            if (!desc) {
                throw new InternalError("argument description is null");
            }
            if (desc.dummy) {
                k--;
                return null;
            }
            if (desc.array) {
                if (!(desc.array instanceof Object)
                    || !(desc.array.element instanceof Object)) {
                    throw new InternalError("invalid argument description");
                }
                try {
                    for (var j = 0; j < arg.length; j++) {
                        argumentSanitaizer(desc.array.element, arg[j]);
                    }
                } catch (x) {
                    throw new TypeError("incorrect argument");
                }

                return arg;
            }
            if (desc.obj) {
                if (!(desc.obj instanceof Object)) {
                    throw new InternalError("invalid argument description");
                }
                var res = {}, i;
                for (i in desc.obj) {
                    if (desc.obj.hasOwnProperty(i)) {
                        res[i] = argumentSanitaizer(desc.obj[i], arg[i]);
                    }
                }
                return res;
            }
            if (desc.str) {
                if (desc.allowNull && !arg) {
                    return null;
                }
                checkString(arg, false);
                return arg;
            }
            if (desc.number) {
                if (typeof(arg) !== 'number' && typeof(arg) !== 'boolean')
                    throw new TypeError("incorrect argument");
                return arg;
            }
            if (!desc.type) {
                throw new InternalError("argument description miss required parameter");
            }
            if ((arg instanceof desc.type)
                || (desc.type === Function && ((typeof arg) === 'function'))
                || (arg === null && desc.allowNull)) {
                if (desc.type === Function) {
                    if (!arg) {
                        return null;
                    }

                    var id;
                    if (desc.argAsCallbackId !== undefined) {
                        id = realArgs[desc.argAsCallbackId];
                    }
                    return function (user_data) { arg(user_data); };
                }
                return arg;
            } else {
                throw new TypeError("incorrect argument");
            }
            throw new InternalError("unreacheable");
        }
        var args = [], i;
        for (i = 0; i < argsDesc.length; i++) {
            if (k >= realArgs.length && k > 0 && !argsDesc[i].dummy) {
                throw new Error("not enough arguments");
            }
            var value = argumentSanitaizer(argsDesc[i], realArgs[k]);
            k++;

            if (argsDesc[i].obj) {
                args = args.concat(value);
            } else {
                args.push(value);
            }
        }

        if (k < realArgs.length) {
            throw new Error("too much arguments");
        }
        if (callback)
            callback.apply(null, args);
        if (func)
            return Function.apply.apply([args]);

        return null;
    };
};
