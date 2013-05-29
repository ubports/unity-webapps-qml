include(../../../../common-project-config.pri)
include(../../../../common-vars.pri)

CONFIG += qt plugin no_keywords

unix {
    CONFIG += link_pkgconfig
#    PKGCONFIG += libunity_webapps-0.2
    PKGCONFIG += libnotify
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
    callback.cpp \
    UnityWebappsApi.cpp \
    UnityWebappsApiNotifications.cpp

HEADERS += \
    qml-plugin.h \
    callback.h \
    UnityWebappsApi.h \
    UnityWebappsApiNotifications.h

DEFINES += API_URI=\\\"$${API_URI}\\\"

# plugin deployment
PLUGIN_INSTALL_PATH = $$[QT_INSTALL_QML]/$$replace(API_URI, \\., /)
target.path = $${PLUGIN_INSTALL_PATH}

INSTALLS += target

