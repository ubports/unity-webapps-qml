#include "qml-plugin.h"
#include "unity-webapps-api.h"
#include "unity-webapps-api-notifications.h"
#include "unity-webapps-api-messaging-menu.h"
#include "unity-webapps-api-launcher.h"
#include "unity-webapps-api-mediaplayer.h"
#include "unity-webapps-app-model-filter-proxy.h"
#include "unity-webapps-app-model.h"
#include "unity-webapps-app-infos.h"
#include "callback.h"

#include <qqml.h>


void WebappsQmlPlugin::registerTypes(const char *uri)
{
    // bindings
    qmlRegisterType<UnityWebapps> (uri, 0, 1, "UnityWebappsBase");
    qmlRegisterType<UnityWebappsNotification> (uri, 0, 1, "UnityWebappsNotificationsBinding");
    qmlRegisterType<UnityWebappsMessagingMenu> (uri, 0, 1, "UnityWebappsMessagingBinding");
    qmlRegisterType<UnityWebappsLauncher> (uri, 0, 1, "UnityWebappsLauncherBinding");
    qmlRegisterType<UnityWebappsMediaPlayer> (uri, 0, 1, "UnityWebappsMediaPlayerBinding");

    // misc
    qmlRegisterType<UnityWebappsAppModel> (uri, 0, 1, "UnityWebappsAppModel");
    qmlRegisterType<UnityWebappsAppModelFilterProxy> (uri, 0, 1, "UnityWebappsAppModelFilterProxy");
    qmlRegisterType<UnityWebappsCallback> (uri, 0, 1, "UnityWebappsCallback");
    qmlRegisterType<UnityWebappsAppInfos> (uri, 0, 1, "UnityWebappsAppInfos");
}

