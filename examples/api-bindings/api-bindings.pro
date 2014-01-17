TEMPLATE = subdirs
SUBDIRS=

QML_IN_FILES = $$system(ls ./*/*.qml.in)

OTHER_FILES += \
    $$system(ls ./*/*.qml) \
    $$QML_IN_FILES \
    $$system(ls ./*/www/*.html) \
    $$system(ls ./*/www/js/*.html)

QMAKE_SUBSTITUTES += $$QML_IN_FILES

