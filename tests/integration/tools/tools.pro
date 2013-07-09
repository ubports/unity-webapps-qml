TEMPLATE = subdirs

SUBDIRS = qml-launcher

OTHER_FILES += \
    $$system(ls ./js/*.js)
