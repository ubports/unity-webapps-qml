TEMPLATE=subdirs

SUBDIRS = unit

OTHER_FILES += \
    $$system(ls ./integration/autopilot/qml/*) \
    $$system(ls ./integration/autopilot/html/*) \
    $$system(ls ./integration/autopilot/webapps_qml/emulators/*.py) \
    $$system(ls ./integration/autopilot/webapps_qml/tests/*.py)
