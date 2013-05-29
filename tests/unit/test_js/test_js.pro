TEMPLATE = app

TARGET = test_js

CONFIG += \
    debug \
    link_pkgconfig

QT += \
    core \
    qml \
    testlib \
    qmltest

# LIBS += $$system(ls ../../src/Ubuntu/UnityWebApps/*.so)

SOURCES = test_js.cpp
