include(../../../common-project-config.pri)

TARGET = tst_plugin

CONFIG += \
    debug \
    link_pkgconfig

PKGCONFIG += glib-2.0 \
        gio-2.0

QT += \
    core \
    qml \
    testlib

PLUGIN_SRC_DIR = \
    $$TOP_SRC_DIR/src/Ubuntu/UnityWebApps/plugin

SOURCES += \
    tst_plugin.cpp \
    tst_manifestParser.cpp \
    tst_webappsAppModel.cpp \
    $${PLUGIN_SRC_DIR}/unity-webapps-app-model.cpp \
    $${PLUGIN_SRC_DIR}/unity-webapps-app-manifest-parser.cpp \
    $${PLUGIN_SRC_DIR}/unity-webapps-desktop-infos.cpp \
    $${PLUGIN_SRC_DIR}/abstract-item-model-adaptor.cpp \
    main.cpp

HEADERS += \
    tst_plugin.h \
    tst_manifestParser.h \
    tst_webappsAppModel.h \
    $${PLUGIN_SRC_DIR}/unity-webapps-app-model.h \
    $${PLUGIN_SRC_DIR}/unity-webapps-desktop-infos.h \
    $${PLUGIN_SRC_DIR}/abstract-item-model-adaptor.h \
    $${PLUGIN_SRC_DIR}/unity-webapps-app-manifest-parser.h

INCLUDEPATH += \
    $$TOP_SRC_DIR/src/Ubuntu/UnityWebApps

OTHER_FILES += \
    $$system(ls ./data/*/*) \
    $$system(ls ./data/*/*/*) \
    $$system(ls *.sh) \
    data/manifests/valid-with-ua-override.json \
    data/manifests/valid-simplified-manifest.json \
    data/manifests/valid-embedded-in-click-manifest.json

# manually add the 'check' target
check.depends = $${TARGET}
check.commands = "set -e; ./runtests.sh $${TARGET}"

QMAKE_EXTRA_TARGETS += check


