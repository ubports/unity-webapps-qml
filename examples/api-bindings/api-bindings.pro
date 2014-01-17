TEMPLATE = subdirs
SUBDIRS=

QML_IN_FILES = $$system(ls ./*/*.qml.in)

OTHER_FILES += \
    $$QML_IN_FILES \
    $$system(ls ./*/www/*.html) \
    $$system(ls ./*/www/js/*.js)

QMAKE_SUBSTITUTES += $$QML_IN_FILES

OTHER_FILES += \
    $$system(ls ./*/*.qml)
