TEMPLATE=aux

UNITY_API_JS_FILE = $$system($$PWD/../../tools/inject-js-utils.py ./html/test_webapps_callback_dispatch_api.js.in ./html/test_webapps_callback_dispatch_api.js)

inject_dependancies.target = ./html/test_webapps_callback_dispatch_api.js
inject_dependancies.depends = ./html/test_webapps_callback_dispatch_api.js.in
inject_dependancies.commands = $$PWD/../../tools/inject-js-utils.py $< $@

QMAKE_EXTRA_TARGETS += inject_dependancies

PRE_TARGETDEPS += \
    ./html/test_webapps_callback_dispatch_api.js

OTHER_FILES += \
    $$system(ls ./qml/*) \
    $$system(ls ./html/*) \
    $$system(ls ./unity_webapps_qml/emulators/*.py) \
    $$system(ls ./unity_webapps_qml/tests/*.py) \
    $$system(ls ./unity_webapps_qml/*.py) \
    $$system(ls ./data/*/*) \
    unity_webapps_qml/tests/test_installedWebapp.py \
    unity_webapps_qml/tests/fake_servers.py \
    qml/WebviewBackendOxide.qml \
    qml/message-server.js \
    $$system(ls ./data/installed-webapps/*) \
    unity_webapps_qml/tests/test_callbackDispatch.py \
    html/test_webapps_callback_dispatch.html \
    html/test_webapps_callback_dispatch_api.js \
    html/test_webapps_callback_dispatch_api.js.in \
    qml/test_webapps_callback_dispatch_api.qml

