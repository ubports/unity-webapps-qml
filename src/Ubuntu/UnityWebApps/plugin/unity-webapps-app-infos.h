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

#ifndef __UNITY_WEBAPPS_APP_INFOS_H__
#define __UNITY_WEBAPPS_APP_INFOS_H__

#include <QObject>
#include <QVariant>

class UnityWebappsAppModel;

class UnityWebappsAppInfos : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString appName READ appName WRITE setAppName NOTIFY appNameChanged)
    Q_PROPERTY(QString displayName READ displayName WRITE setDisplayName NOTIFY displayNameChanged)
    Q_PROPERTY(QString desktopId READ desktopId WRITE setDesktopId NOTIFY desktopIdChanged)
    Q_PROPERTY(UnityWebappsAppModel* model READ model WRITE setModel NOTIFY modelChanged)


public:

    UnityWebappsAppInfos(QObject *parent = 0);
    ~UnityWebappsAppInfos();

    void setAppName(const QString& name);
    QString appName() const;

    void setDisplayName(const QString& name);
    QString displayName() const;

    void setDesktopId(const QString& desktopId);
    QString desktopId() const;

    UnityWebappsAppModel* model() const;
    void setModel(UnityWebappsAppModel *);


Q_SIGNALS:

    void appNameChanged(const QString& name);
    void desktopIdChanged(const QString& name);
    void displayNameChanged(const QString& name);
    void modelChanged(UnityWebappsAppModel * model);


private:

    QString _appName;
    QString _displayName;
    QString _desktopId;
    UnityWebappsAppModel * _model;
};

#endif // __UNITY_WEBAPPS_APP_INFOS_H__

