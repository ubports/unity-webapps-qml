TEMPLATE = subdirs

SUBDIRS = tools


# make check target
check.target = check
check.commands = "set -e;"
for(TEST, TESTS) {
  check.commands += ./runtest.sh $${TARGET} $${TEST} ../../../src;
}

OTHER_FILES += \
    $$system(ls ./autopilot/qml/*) \
    $$system(ls ./autopilot/data/*) \
    $$system(ls ./autopilot/webapps_qml/emulators/*.py) \
    $$system(ls ./autopilot/webapps_qml/tests/*.py)
