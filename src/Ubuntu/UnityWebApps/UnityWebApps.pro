include(../../../common-project-config.pri)
include(../../../common-vars.pri)

TEMPLATE = subdirs
SUBDIRS += plugin

#
#
#
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

runtime_api_binding_backend_js_files.path = $$installPath/bindings/runtime-api/backend/
runtime_api_binding_backend_js_files.files = ./bindings/runtime-api/backend/runtime-api.js

INSTALLS += qmldir_file \
    qml_files \
    js_files \
    runtime_api_binding_backend_js_files \


