QDOC = /usr/lib/*/qt5/bin/qdoc
system($$QDOC $$PWD/unity-webapps-qml.qdocconf)

install_docs.files = $$PWD/html
install_docs.path = /usr/share/unity-webapps-qml/doc

INSTALLS += install_docs

OTHER_FILES += \
    $$system(ls ./html/*)
