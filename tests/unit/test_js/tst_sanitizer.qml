import QtQuick 2.0
import QtTest 1.0

import "../../../src/Ubuntu/UnityWebApps/common/js/api-sanitizer.js" as SanitizerJs


TestCase {
    name: "JavascriptApiCallSanitizerTests"

    function setup() {
    }

    function test_checkString() {
        setup();

        var threw = false;

        threw = false;
        try { SanitizerJs.checkString(); } catch(e) { threw = true; };
        compare(threw, true, "Null string type");

        threw = false;
        try { SanitizerJs.checkString(1); } catch(e) { threw = true; };
        compare(threw, true, "Invalid string type");

        threw = false;
        try { SanitizerJs.checkString("blabla"); } catch(e) { threw = true; };
        compare(threw, false, "Valid string");

        threw = false;
        try { SanitizerJs.checkString(null, true); } catch(e) { threw = true; };
        compare(threw, false, "Valid null string");
    }

    function test_findName() {
        setup();

    }

    function test_stringify() {
        setup();

        compare(SanitizerJs.stringify(null), null, "Stringify null");

        compare(SanitizerJs.stringify(undefined), undefined, "Stringify undefined");

        compare(SanitizerJs.stringify("blabla"), "blabla", "Stringify string");

        compare(SanitizerJs.stringify(1), 1, "Stringify number");
    }

    function test_sanitizer() {
        setup();

        var called = false;
        var actualArgs = null;
        var actualFuncName = null;
        var backend = {
            call: function(func_name, args) {
                called = true;
                actualArgs = args;
                actualFuncName = func_name;
            },
        };

        var sanitizer = null;

        called = false;
        sanitizer = SanitizerJs.createArgumentsSanitizer (backend, [], 'myfunc');
        sanitizer();
        compare(called, true, "Simple sanitizer func call")

        called = false;
        var args = [1, 2, "blabla"];
        actualArgs = null;
        sanitizer = SanitizerJs.createArgumentsSanitizer (backend, [{ number: true }, { number: true }, { str: true }], 'myfunc');
        sanitizer.apply(null, args);
        compare(called, true, "With args sanitizer func call");
        expectFail(actualArgs == null, "Non null args");
        compare(actualArgs.length, 3, "Invalid number of args received");
        for (var i = 0; i < actualArgs.length; ++i) {
            compare(actualArgs[i], args[i], "Invalid arg value");
        }
        compare(actualFuncName, "myfunc", "Invalid function name");

        var threw = false;
        try {
            sanitizer.apply(null, []);
        }
        catch(e) { threw = true; }
        verify(threw, "Invalid call args count threw");

        threw = false;
        try {
            sanitizer.apply(null, [1, 2, 3]);
        }
        catch(e) { threw = true; }
        verify(threw, "Invalid call args type threw");
    }
}


