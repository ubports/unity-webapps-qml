#include "qml-plugin.h"
#include "unity-webapps-api.h"
#include "unity-webapps-api-notifications.h"
#include "unity-webapps-api-messaging-menu.h"
#include "unity-webapps-app-model-filter-proxy.h"
#include "unity-webapps-app-model.h"

#include <qqml.h>


void WebappsQmlPlugin::registerTypes(const char *uri)
{
    qmlRegisterType<UnityWebapps> (uri, 0, 1, "UnityWebappsBase");
    qmlRegisterType<UnityWebappsNotification> (uri, 0, 1, "UnityWebappsNotificationsBinding");
    qmlRegisterType<UnityWebappsMessagingMenu> (uri, 0, 1, "UnityWebappsMessagingBinding");
    qmlRegisterType<UnityWebappsAppModel> (uri, 0, 1, "UnityWebappsAppModel");
    qmlRegisterType<UnityWebappsAppModelFilterProxy> (uri, 0, 1, "UnityWebappsAppModelFilterProxy");
}

