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

#include "application-signal-to-qt-bridge.h"

#include <QDebug>
#include <QGuiApplication>
#include <QScreen>
#include <QDir>
#include <QtCore/QCoreApplication>
#include <QtCore/QStandardPaths>
#include <signal.h>


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
    ~ApplicationApiEventListener()
    {
        if (QGuiApplication::instance())
            QGuiApplication::instance()->removeEventFilter(this);
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


class ApplicationApiPrivate: public QObject
{
    Q_OBJECT

public:
    ApplicationApiPrivate(QObject * parent)
        : QObject(parent),
          _applicationEventListener(new ApplicationApiEventListener(this)),
          _applicationSignalBridge(new ApplicationSignalToQtBridge(this))
    {}
    ~ApplicationApiPrivate()
    {
        delete _applicationEventListener;
        delete _applicationSignalBridge;
    }

    ApplicationApiEventListener * _applicationEventListener;
    ApplicationSignalToQtBridge * _applicationSignalBridge;
};


ApplicationApi::ApplicationApi(QObject *parent) :
    QObject(parent),
    d_ptr(new ApplicationApiPrivate(this))

{
    Q_D(ApplicationApi);

    QObject::connect(QCoreApplication::instance(),
                     &QCoreApplication::aboutToQuit,
                     this,
                     &ApplicationApi::aboutToQuit);

    QObject::connect(d->_applicationEventListener,
                     &ApplicationApiEventListener::activated,
                     this,
                     &ApplicationApi::activated);

    QObject::connect(d->_applicationEventListener,
                     &ApplicationApiEventListener::deactivated,
                     this,
                     &ApplicationApi::deactivated);

    QObject::connect(d->_applicationSignalBridge,
                     &ApplicationSignalToQtBridge::onSignalRaised,
                     this,
                     &ApplicationApi::signalReceived);

    // We explictly handle the SIGTERM signal case that is being sent
    // on Touch to an application being killed by the platform.
    //
    d->_applicationSignalBridge->addSignalHandlerFor(SIGTERM);

    QScreen * screen = QGuiApplication::primaryScreen();
    if (screen)
    {
        QObject::connect(screen,
                         &QScreen::orientationChanged,
                         this,
                         &ApplicationApi::screenOrientationChanged);
    }
}

ApplicationApi::~ApplicationApi()
{
    Q_D(ApplicationApi);

    QObject::disconnect(QCoreApplication::instance(),
                       &QCoreApplication::aboutToQuit,
                       this,
                       &ApplicationApi::aboutToQuit);

    QObject::disconnect(d->_applicationEventListener,
                       &ApplicationApiEventListener::activated,
                       this,
                       &ApplicationApi::activated);

    QObject::disconnect(d->_applicationEventListener,
                       &ApplicationApiEventListener::deactivated,
                       this,
                       &ApplicationApi::deactivated);

    QObject::disconnect(d->_applicationSignalBridge,
                        &ApplicationSignalToQtBridge::onSignalRaised,
                        this,
                        &ApplicationApi::signalReceived);

    QScreen * screen = QGuiApplication::primaryScreen();
    if (screen)
    {
        QObject::disconnect(screen,
                           &QScreen::orientationChanged,
                           this,
                           &ApplicationApi::screenOrientationChanged);
    }

    delete d_ptr;
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
    Q_EMIT applicationAboutToQuit(false);
}

void ApplicationApi::activated()
{
    Q_EMIT applicationActivated();
}

void ApplicationApi::deactivated()
{
    Q_EMIT applicationDeactivated();
}

void ApplicationApi::signalReceived(int type)
{
    if (type != SIGTERM  && type != SIGINT)
        return;

    bool killed = (type == SIGTERM);

    // TODO sync emit?
    Q_EMIT applicationAboutToQuit(killed);

    QCoreApplication::quit();
}

void ApplicationApi::screenOrientationChanged(Qt::ScreenOrientation orientation)
{
    Q_EMIT applicationScreenOrientationChanged(
                nameFromScreenOrientation(
                    orientation));
}


#include "application-api.moc"

