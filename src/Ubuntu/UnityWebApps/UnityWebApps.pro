include(../../../common-project-config.pri)
include(../../../common-vars.pri)

TEMPLATE = subdirs
SUBDIRS += plugin

UNITY_API_JS_FILE = $$system($$PWD/../../../tools/inject-js-utils.py unity-webapps-api.js.in unity-webapps-api.js)

inject_dependancies.target = unity-webapps-api.js
inject_dependancies.depends = unity-webapps-api.js.in
inject_dependancies.commands = $$PWD/../../../tools/inject-js-utils.py $< $@

QMAKE_EXTRA_TARGETS += inject_dependancies

PRE_TARGETDEPS += \
    unity-webapps-api.js

#
# deployment directives
#
PLUGIN_JS_FILES = \
    $$system(ls *.js) \
    $${UNITY_API_JS_FILE}

CLIENT_JS_FILES = \
    $$system(ls ./common/*/*.js) \
    $$system(ls ./bindings/*/client/*.js)

QML_FILES = $$system(ls *.qml)

QMLDIR_FILE = qmldir
QMAKE_SUBSTITUTES += qmldir.in

OTHER_FILES += $$QML_FILES \
    $$PLUGIN_JS_FILES \
    $$CLIENT_JS_FILES \
    $$system(ls ./bindings/*/backend/*.js) \
    qmldir.in \
    unity-webapps-api.js.in \
    $${UNITY_API_JS_FILE}

#
# Installs
#
installPath = $$[QT_INSTALL_QML]/$$replace(API_URI, \\., /)

qmldir_file.path = $$installPath
qmldir_file.files = $$QMLDIR_FILE

qml_files.path = $$installPath
qml_files.files = $$QML_FILES

js_files.path = $$installPath
js_files.files = $$PLUGIN_JS_FILES

content_hub_binding_backend_js_files.path = $$installPath/bindings/content-hub/backend/
content_hub_binding_backend_js_files.files = ./bindings/content-hub/backend/content-hub.js

alarm_binding_backend_js_files.path = $$installPath/bindings/alarm-api/backend/
alarm_binding_backend_js_files.files = ./bindings/alarm-api/backend/alarm-api.js

online_accounts_binding_backend_js_files.path = $$installPath/bindings/online-accounts/backend/
online_accounts_binding_backend_js_files.files = \
    ./bindings/online-accounts/backend/online-accounts.js \
    ./bindings/online-accounts/backend/online-accounts-client.js

runtime_api_binding_backend_js_files.path = $$installPath/bindings/runtime-api/backend/
runtime_api_binding_backend_js_files.files = ./bindings/runtime-api/backend/runtime-api.js

download_api_binding_backend_js_files.path = $$installPath/bindings/download-manager/backend/
download_api_binding_backend_js_files.files = ./bindings/download-manager/backend/download-api.js

tools_api_binding_backend_js_files.path = $$installPath/bindings/tools/backend/
tools_api_binding_backend_js_files.files = ./bindings/tools/backend/tools.js

INSTALLS += qmldir_file \
    qml_files \
    js_files \
    content_hub_binding_backend_js_files \
    alarm_binding_backend_js_files \
    online_accounts_binding_backend_js_files \
    runtime_api_binding_backend_js_files \
    download_api_binding_backend_js_files \
    tools_api_binding_backend_js_files
