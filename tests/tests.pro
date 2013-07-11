TEMPLATE=subdirs

SUBDIRS = unit

OTHER_FILES += \
    $$system(ls ./integration/autopilot/qml/*) \
    $$system(ls ./integration/autopilot/html/*) \
    $$system(ls ./integration/autopilot/data/installed-webapps/*) \
    $$system(ls ./integration/autopilot/unity_webapps_qml/emulators/*.py) \
    $$system(ls ./integration/autopilot/unity_webapps_qml/tests/*.py)
