/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of UnityWebappsQML.
 *
 * UnityWebappsQML is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * UnityWebappsQML is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef __UNITY_WEBAPPS_MESSAGING_MENU_H__
#define __UNITY_WEBAPPS_MESSAGING_MENU_H__

#include <QObject>
#include <QQmlParserStatus>

#include "unity-webapps-app-infos.h"


class UnityWebappsMessagingMenuPrivate;

class UnityWebappsMessagingMenu: public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)


public:
    UnityWebappsMessagingMenu(QObject * parent = 0);
    virtual ~UnityWebappsMessagingMenu();

    // Supported WebApps APIs
    Q_INVOKABLE void showIndicator(const QString& indicatorName);
    Q_INVOKABLE void setProperty(const QString& indicatorName,
                                 const QString& propertyName,
                                 const QVariant& value);
    Q_INVOKABLE void clearIndicator(const QString& indicatorName);
    Q_INVOKABLE void clearIndicators();


    // Class functions
    void classBegin();
    void componentComplete();



public Q_SLOTS:

    void onAppInfosChanged(UnityWebappsAppInfos *appInfos);


private:

    UnityWebappsMessagingMenuPrivate *d_ptr;
    Q_DECLARE_PRIVATE(UnityWebappsMessagingMenu)
};

#endif // __UNITY_WEBAPPS_MESSAGING_MENU_H__


