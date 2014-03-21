/*
 * Copyright 2014 Canonical Ltd.
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

#ifndef UNITY_WEBAPPS_APPLICATIONAPI_H
#define UNITY_WEBAPPS_APPLICATIONAPI_H

#include <QObject>

class ApplicationApiEventListener;

class ApplicationApi : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString applicationName READ applicationName NOTIFY applicationNameChanged)
    Q_PROPERTY(QString screenOrientation READ getApplicationScreenOrientation NOTIFY applicationScreenOrientationChanged)
    Q_PROPERTY(QString applicationDataPath READ getApplicationDataPath)
    Q_PROPERTY(QString applicationPlatform READ getApplicationPlatform)


public:
    explicit ApplicationApi(QObject *parent = 0);

    QString applicationName() const;

    QString getApplicationDataPath() const;

    QString getApplicationPlatform() const;

    QString getApplicationScreenOrientation() const;

    Q_INVOKABLE QString getInputMethod() const;
    Q_INVOKABLE void setInputMethodVisible(bool);


Q_SIGNALS:
    void applicationNameChanged();
    void applicationAboutToQuit();
    void applicationDeactivated();
    void applicationActivated();
    void applicationScreenOrientationChanged(QString);


public Q_SLOTS:

    void aboutToQuit();
    void deactivated();
    void activated();
    void screenOrientationChanged(Qt::ScreenOrientation);


private:

    ApplicationApiEventListener * _applicationEventListener;
};

#endif // UNITY_WEBAPPS_APPLICATIONAPI_H
