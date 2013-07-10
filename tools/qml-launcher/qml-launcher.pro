include(../../common-project-config.pri)
include(../../common-vars.pri)

TEMPLATE = app
TARGET = unity-webapps-qml-launcher

CONFIG += \
    debug

QT += \
    core \
    qml \
    testlib \
    quick

SOURCES += \
    qml-launcher.cpp

include(../../common-installs-config.pri)
