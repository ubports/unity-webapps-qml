function checkString(str, allowUndef) {
    if (allowUndef && str == undefined) {
        return;
    }
    if (!str || typeof(str) !== 'string') {
        throw new TypeError("incorrect argument");
    }
}

function stringify(obj) {
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

function stringifyArgs(obj) {
    var args = [];
    for (var i = 0; i < obj.length; i++) {
        args.push(stringify(obj[i]));
    }
    var res = JSON.stringify(args);
    return res.substr(1, res.length - 2);
};

function createArgumentsSanitizer(backend, argsDesc, function_name) {
    var callback = function() {
        var args = [];
        args.push(function_name);
        args.push([].slice.call(arguments));
        backend.call.apply(backend, args);
    };

    return function () {
        var realArgs = arguments;

        var k = 0;
        function argumentSanitizer(desc, arg) {
            if (!desc) {
                throw new Error("argument description is null");
            }
            if (desc.dummy) {
                k--;
                return null;
            }
            if (desc.array) {
                if (!(desc.array instanceof Object)
                    || !(desc.array.element instanceof Object)) {
                    throw new Error("invalid argument description");
                }
                try {
                    for (var j = 0; j < arg.length; j++) {
                        argumentSanitizer(desc.array.element, arg[j]);
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
                        res[i] = argumentSanitizer(desc.obj[i], arg[i]);
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
                throw new Error("argument description miss required parameter");
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
            throw new Error("unreacheable");
        }
        var args = [], i;
        for (i = 0; i < argsDesc.length; i++) {
            if (k >= realArgs.length && k > 0 && !argsDesc[i].dummy) {
                throw new Error("not enough arguments");
            }
            var value = argumentSanitizer(argsDesc[i], realArgs[k]);
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

        callback.apply(null, args);

        return null;
    };
};
