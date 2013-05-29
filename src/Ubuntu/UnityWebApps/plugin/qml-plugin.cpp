#include "qml-plugin.h"
#include "UnityWebappsApi.h"
#include "UnityWebappsApiNotifications.h"

#include <qqml.h>

void WebappsQmlPlugin::registerTypes(const char *uri)
{
    qmlRegisterType<UnityWebapps>(uri, 0, 1, "UnityWebappsBase");
    qmlRegisterType<UnityWebappsNotification>(uri, 0, 1, "UnityWebappsNotificationsBinding");
    qmlRegisterType<UnityWebappsNotification>(uri, 0, 1, "UnityWebappsMessagingMenuBinding");
}

