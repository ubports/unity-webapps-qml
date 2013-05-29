include(../../../common-project-config.pri)

TESTS += $$system(ls tst_*.qml)

TEMPLATE = app

QT += qml \
    quick \
    qmltest

CONFIG += no_keywords


# build main test
TARGET = test_qml

SOURCES += \
    test_qml.cpp

OTHER_FILES += $$system(ls *.qml) $$system(ls *.sh)


# make check target
check.target = check
check.commands = "set -e;"
for(TEST, TESTS) {
  check.commands += ./runtest.sh $${TARGET} $${TEST} ../../../src;
}
