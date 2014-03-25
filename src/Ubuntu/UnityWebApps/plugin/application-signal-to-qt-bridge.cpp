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

#include "application-signal-to-qt-bridge.h"

#include <QDebug>
#include <QSocketNotifier>

#include <sys/socket.h>
#include <signal.h>
#include <unistd.h>

/**
 * @brief The ApplicationSignalToQtBridgePrivate class
 *
 * It does the job described here:
 *
 * https://qt-project.org/doc/qt-5.0/qtdoc/unix-signals.html
 *
 * and bridges Unix signal handlers & qt objects in a proper
 * way.
 *
 */

class ApplicationSignalToQtBridgePrivate: public QObject
{
    Q_OBJECT

public:
    ApplicationSignalToQtBridgePrivate(QObject * parent)
        : QObject(parent),
          _signalSocketNotifier(NULL)
    {}
    ~ApplicationSignalToQtBridgePrivate()
    {
        delete _signalSocketNotifier;
    }

    QSocketNotifier * _signalSocketNotifier;
};


int ApplicationSignalToQtBridge::signalSocketPair[2];

ApplicationSignalToQtBridge::ApplicationSignalToQtBridge(QObject *parent)
    : QObject(parent)
    , d_ptr(new ApplicationSignalToQtBridgePrivate(this))
{}

ApplicationSignalToQtBridge::~ApplicationSignalToQtBridge()
{
    delete d_ptr;
}

void ApplicationSignalToQtBridge::setupQtSignalListener()
{
    Q_D(ApplicationSignalToQtBridge);

    if (0 != ::socketpair(AF_UNIX, SOCK_STREAM, 0, signalSocketPair))
    {
       qFatal("Couldn't create HUP socketpair");
    }

    d->_signalSocketNotifier =
            new QSocketNotifier (signalSocketPair[1],
                                QSocketNotifier::Read,
                                this);

    connect(d->_signalSocketNotifier,
            SIGNAL(activated(int)),
            this,
            SLOT(handleSignal(int)));
}

bool ApplicationSignalToQtBridge::addSignalHandlerFor(int type)
{
    Q_D(ApplicationSignalToQtBridge);

    if ( ! d->_signalSocketNotifier)
        setupQtSignalListener();

    struct sigaction sa;

    sa.sa_handler = ApplicationSignalToQtBridge::signalHandler;
    sigemptyset (&sa.sa_mask);
    sa.sa_flags = 0;
    sa.sa_flags |= SA_RESTART;

    return sigaction (type, &sa, 0) > 0;
}

void ApplicationSignalToQtBridge::signalHandler(int type)
{
    if (0 != signalSocketPair[0])
    {
        size_t size =
            ::write (signalSocketPair[0],
                     &type,
                     sizeof(type));
        Q_UNUSED(size);
    }
}

void ApplicationSignalToQtBridge::handleSignal(int socket)
{
    Q_D(ApplicationSignalToQtBridge);

    Q_UNUSED(socket);

    d->_signalSocketNotifier->setEnabled(false);

    int type = 0;
    size_t size =
        ::read (signalSocketPair[1], &type, sizeof(type));
    Q_UNUSED(size);

    Q_EMIT onSignalRaised(type);

    d->_signalSocketNotifier->setEnabled(true);
}


#include "application-signal-to-qt-bridge.moc"

