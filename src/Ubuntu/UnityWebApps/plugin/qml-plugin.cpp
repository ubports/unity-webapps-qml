#include "qml-plugin.h"
#include "unity-webapps-api.h"
#include "unity-webapps-api-notifications.h"
#include "unity-webapps-app-model.h"

#include <qqml.h>

void WebappsQmlPlugin::registerTypes(const char *uri)
{
    qmlRegisterType<UnityWebapps>(uri, 0, 1, "UnityWebappsBase");
    qmlRegisterType<UnityWebappsNotification>(uri, 0, 1, "UnityWebappsNotificationsBinding");
    qmlRegisterType<UnityWebappsAppModel>(uri, 0, 1, "UnityWebappsAppModel");
}

