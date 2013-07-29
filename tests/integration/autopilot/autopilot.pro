TEMPLATE=aux

OTHER_FILES += \
    $$system(ls ./qml/*) \
    $$system(ls ./html/*) \
    $$system(ls ./webapps_qml/emulators/*.py) \
    $$system(ls ./webapps_qml/tests/*.py) \
    $$system(ls ./data/installed-webapps/*)

