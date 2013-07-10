TEMPLATE=subdirs

# make check target
check.target = check
check.commands = "set -e;"
for(TEST, TESTS) {
  check.commands += ./runtest.sh $${TARGET} $${TEST} ../../../src;
}

OTHER_FILES += \
    $$system(ls ./autopilot/qml/*) \
    $$system(ls ./autopilot/html/*) \
    $$system(ls ./autopilot/webapps_qml/emulators/*.py) \
    $$system(ls ./autopilot/webapps_qml/tests/*.py)

