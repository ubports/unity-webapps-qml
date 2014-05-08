/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * unity-webapps-qml is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#include "qml-plugin.h"

#include <QtQml/QQmlEngine>
#include <QtQml/QQmlContext>

#include "unity-webapps-api.h"
#include "unity-webapps-api-notifications.h"
#include "unity-webapps-api-messaging-menu.h"
#include "unity-webapps-api-launcher.h"
#include "unity-webapps-api-mediaplayer.h"
#include "unity-webapps-app-model-filter-proxy.h"
#include "unity-webapps-app-model.h"
#include "unity-webapps-app-infos.h"

#include "application-api.h"
#include "abstract-item-model-adaptor.h"
#include "callback.h"

#include <qqml.h>

static QObject *createApplicationApi(QQmlEngine *engine, QJSEngine *scriptEngine)
{
    Q_UNUSED(engine);
    Q_UNUSED(scriptEngine);

    return new ApplicationApi();
}

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

    // TODO bump version
    qmlRegisterType<AbstractItemModelAdaptor> (uri, 0, 1, "AbstractItemModelAdaptor");

    //
    qmlRegisterSingletonType<ApplicationApi>(uri, 0, 1, "ApplicationApi", createApplicationApi);
}

