TEMPLATE=aux

OTHER_FILES += \
    $$system(ls ./qml/*) \
    $$system(ls ./html/*) \
    $$system(ls ./unity_webapps_qml/emulators/*.py) \
    $$system(ls ./unity_webapps_qml/tests/*.py) \
    $$system(ls ./data/installed-webapps/*)

