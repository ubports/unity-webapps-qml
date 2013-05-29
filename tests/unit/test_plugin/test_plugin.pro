include(../../../common-project-config.pri)

TARGET = tst_plugin

CONFIG += \
    debug \
    link_pkgconfig

QT += \
    core \
    qml \
    testlib

LIBS += $$system(ls ../../src/Ubuntu/UnityWebApps/*.so)

SOURCES += \
    tst_plugin.cpp

HEADERS += \
    tst_plugin.h

INCLUDEPATH += \
    $$TOP_SRC_DIR/src/Ubuntu/UnityWebApps

# manually add the 'check' target
check.commands = "set -e;"
check.depends = $${TARGET}
QMAKE_EXTRA_TARGETS += check

