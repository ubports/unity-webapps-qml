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

#ifndef __UNITY_WEBAPPS_LAUNCHER_H__
#define __UNITY_WEBAPPS_LAUNCHER_H__

#include <QObject>
#include <QQmlParserStatus>

#include "unity-webapps-app-model.h"


class UnityWebappsLauncherPrivate;

class UnityWebappsLauncher: public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)

    Q_PROPERTY(QString name READ name WRITE setName NOTIFY nameChanged)
    Q_PROPERTY(QString displayName READ displayName WRITE setDisplayName NOTIFY displayNameChanged)
    Q_PROPERTY(UnityWebappsAppModel* model READ model WRITE setModel NOTIFY modelChanged)


public:
    UnityWebappsLauncher(QObject * parent = 0);
    virtual ~UnityWebappsLauncher();

    Q_INVOKABLE void setCount(int count);
    Q_INVOKABLE int getCount();
    Q_INVOKABLE void clearCount();

    Q_INVOKABLE void setProgress(double progress);
    Q_INVOKABLE double getProgress();
    Q_INVOKABLE void clearProgress();

    Q_INVOKABLE void setUrgent();

    Q_INVOKABLE void addAction(const QString & actionName, const QString & action);
    Q_INVOKABLE void removeAction(const QString & actionName);
    Q_INVOKABLE void removeActions();

    void setName(const QString& name);
    QString name() const;

    void setDisplayName(const QString& name);
    QString displayName() const;

    UnityWebappsAppModel* model() const;
    void setModel(UnityWebappsAppModel *);

    void classBegin();
    void componentComplete();


Q_SIGNALS:

    void nameChanged(const QString& name);
    void displayNameChanged(const QString& name);
    void modelChanged(UnityWebappsAppModel * model);


private:

    UnityWebappsLauncherPrivate *d_ptr;
    Q_DECLARE_PRIVATE(UnityWebappsLauncher)
};

#endif // __UNITY_WEBAPPS_LAUNCHER_H__

