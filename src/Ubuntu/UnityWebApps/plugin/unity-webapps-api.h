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

#ifndef __UNITY_WEBAPPS_API_H__
#define __UNITY_WEBAPPS_API_H__

#include <QObject>
#include <QVariant>
#include <QQmlParserStatus>

class UnityWebapps : public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)

//    Q_PROPERTY(QString applicationName READ applicationName WRITE setApplicationName NOTIFY nameChanged)


public:
    UnityWebapps(QObject *parent = 0);
    ~UnityWebapps();

    // TODO: really need it?
    void classBegin();
    void componentComplete();

public Q_SLOTS:

    // API functions
    void init(const QVariant& args);
    void addAction(const QString& name, QVariant callback);
    void removeAction(const QString& name);
    void removeActions();

Q_SIGNALS:

    void initCompleted();


private:

    void _init(const QString& name, const QString& iconUrl);
};

#endif // __UNITY_WEBAPPS_API_H__

