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

#ifndef __UNITY_WEBAPPS_CALLBACK_H__
#define __UNITY_WEBAPPS_CALLBACK_H__

#include <QObject>
#include <QVariant>


class UnityWebappsCallback : public QObject
{
    Q_OBJECT


public:
    UnityWebappsCallback(QObject *parent = 0);
    ~UnityWebappsCallback();


public Q_SLOTS:

    Q_INVOKABLE void trigger (QVariant user_data = QVariant());


Q_SIGNALS:

    void triggered(QVariant user_data = QVariant());
};

#endif // __UNITY_WEBAPPS_CALLBACK_H__

