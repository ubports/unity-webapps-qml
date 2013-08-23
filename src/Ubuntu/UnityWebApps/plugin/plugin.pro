include(../../../../common-project-config.pri)
include(../../../../common-vars.pri)

CONFIG += qt plugin no_keywords

unix {
    CONFIG += link_pkgconfig
    PKGCONFIG += libnotify \
                messaging-menu \
                glib-2.0 \
                gio-2.0 \
                unity
}

TEMPLATE = lib
TARGET = UnityWebApps

DESTDIR = ../

CONFIG += \
    link_pkgconfig \
    plugin \
    qt

QT += core qml


SOURCES += \
    qml-plugin.cpp \
    unity-webapps-api.cpp \
    unity-webapps-api-notifications.cpp \
    unity-webapps-api-messaging-menu.cpp \
    unity-webapps-api-launcher.cpp \
    unity-webapps-app-model.cpp \
    unity-webapps-app-manifest-parser.cpp \
    unity-webapps-app-model-filter-proxy.cpp \
    unity-webapps-desktop-infos.cpp \
    callback.cpp

HEADERS += \
    qml-plugin.h \
    unity-webapps-api.h \
    unity-webapps-api-notifications.h \
    unity-webapps-api-messaging-menu.h \
    unity-webapps-api-launcher.h \
    unity-webapps-app-model.h \
    unity-webapps-app-manifest-parser.h \
    unity-webapps-common-priv.h \
    unity-webapps-app-model-filter-proxy.h \
    unity-webapps-desktop-infos.h \
    callback.h

DEFINES += \
    API_URI=\\\"$${API_URI}\\\"

# plugin deployment
PLUGIN_INSTALL_PATH = $$[QT_INSTALL_QML]/$$replace(API_URI, \\., /)
target.path = $${PLUGIN_INSTALL_PATH}

INSTALLS += target

