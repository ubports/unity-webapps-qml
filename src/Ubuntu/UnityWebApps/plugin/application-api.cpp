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

#include "application-api.h"

#include <QDebug>
#include <QGuiApplication>
#include <QScreen>
#include <QDir>
#include <QtCore/QCoreApplication>
#include <QtCore/QStandardPaths>


namespace
{

QString
nameFromScreenOrientation (Qt::ScreenOrientation orientation)
{
    switch (orientation)
    {
    case Qt::InvertedLandscapeOrientation:
    case Qt::LandscapeOrientation:
        return QString("Landscape");

    case Qt::PortraitOrientation:
    case Qt::InvertedPortraitOrientation:
        return QString("Portrait");

    case Qt::PrimaryOrientation:
        return QString("Primary");

    default:
        break;
    }

    return QString("Unknown");
}

}


class ApplicationApiEventListener : public QObject
{
    Q_OBJECT

public:
    ApplicationApiEventListener(QObject * parent)
        : QObject(parent)
    {
        if (QGuiApplication::instance())
            QGuiApplication::instance()->installEventFilter(this);
    }

    bool eventFilter(QObject *obj,
                     QEvent *event)
    {
        switch (event->type())
        {
        case QEvent::ApplicationActivate:
            Q_EMIT activated();
            break;
        case QEvent::ApplicationDeactivate:
            Q_EMIT deactivated();
            break;
        default:
            break;
        }
        return QObject::eventFilter(obj, event);
    }

Q_SIGNALS:

    void activated();
    void deactivated();
};

ApplicationApi::ApplicationApi(QObject *parent) :
    QObject(parent),
    _applicationEventListener(new ApplicationApiEventListener(parent))

{
    QObject::connect(QCoreApplication::instance(),
                     &QCoreApplication::aboutToQuit,
                     this,
                     &ApplicationApi::aboutToQuit);

    QObject::connect(_applicationEventListener,
                     &ApplicationApiEventListener::activated,
                     this,
                     &ApplicationApi::activated);

    QObject::connect(_applicationEventListener,
                     &ApplicationApiEventListener::deactivated,
                     this,
                     &ApplicationApi::deactivated);

    QScreen * screen = QGuiApplication::primaryScreen();
    QObject::connect(screen,
                     &QScreen::orientationChanged,
                     this,
                     &ApplicationApi::screenOrientationChanged);

}

QString ApplicationApi::applicationName() const
{
    if ( ! qgetenv("APP_ID").isEmpty())
        return qgetenv("APP_ID");

    return QCoreApplication::applicationName();
}

QString ApplicationApi::getApplicationDataPath() const
{
    QDir dataLocation(
        QStandardPaths::writableLocation(
            QStandardPaths::DataLocation));

    if (!dataLocation.exists()) {
        QDir::root().mkpath(dataLocation.absolutePath());
    }

    return dataLocation.absolutePath();
}

QString ApplicationApi::getApplicationScreenOrientation() const
{
    QScreen * screen = QGuiApplication::primaryScreen();

    return nameFromScreenOrientation(screen->primaryOrientation());
}

QString ApplicationApi::getInputMethod() const
{
    return QString(getenv("QT_IM_MODULE"));
}

void ApplicationApi::setInputMethodVisible(bool visible)
{
    QGuiApplication::inputMethod()->setVisible(visible);
    if (visible)
        QGuiApplication::inputMethod()->show();
    else
        QGuiApplication::inputMethod()->hide();
}

QString ApplicationApi::getApplicationPlatform() const
{
    return QGuiApplication::platformName();
}

void ApplicationApi::aboutToQuit()
{
    Q_EMIT applicationAboutToQuit();
}

void ApplicationApi::activated()
{
    Q_EMIT applicationActivated();
}

void ApplicationApi::deactivated()
{
    Q_EMIT applicationDeactivated();
}

void ApplicationApi::screenOrientationChanged(Qt::ScreenOrientation orientation)
{
    Q_EMIT applicationScreenOrientationChanged(
                nameFromScreenOrientation(
                    orientation));
}


#include "application-api.moc"

