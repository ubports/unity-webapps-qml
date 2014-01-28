include(../../../common-project-config.pri)

TESTS += $$system(ls tst_*.qml)

TEMPLATE = app

TARGET = test_js

QT += qml \
    testlib \
    qmltest

CONFIG += no_keywords \
    debug \
    link_pkgconfig

SOURCES += \
    test_js.cpp

OTHER_FILES += $$system(ls *.qml) \
    $$system(ls *.js) \
    $$system(ls *.sh)

# make check target
check.target = check
check.commands = "set -e;"
for(TEST, TESTS) {
  check.commands += ./runtest.sh $${TARGET} $${TEST} ../../../src;
}

QMAKE_EXTRA_TARGETS += check

