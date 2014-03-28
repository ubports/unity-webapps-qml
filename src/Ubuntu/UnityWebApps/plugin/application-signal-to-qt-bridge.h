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

#ifndef APPLICATIONSIGNALTOQTBRIDGE_H
#define APPLICATIONSIGNALTOQTBRIDGE_H

#include <QObject>


class ApplicationSignalToQtBridgePrivate;

class ApplicationSignalToQtBridge : public QObject
{
    Q_OBJECT

public:

    explicit ApplicationSignalToQtBridge (QObject *parent = 0);
    ~ApplicationSignalToQtBridge ();

    bool addSignalHandlerFor(int type);


public Q_SLOTS:

    void handleSignal(int type);


Q_SIGNALS:

    void onSignalRaised(int type);


private:

    void setupQtSignalListener();

    // Unix signal handlers.
    static void signalHandler(int type);

    static int signalSocketPair[2];

    ApplicationSignalToQtBridgePrivate *d_ptr;
    Q_DECLARE_PRIVATE(ApplicationSignalToQtBridge)
};

#endif // APPLICATIONSIGNALTOQTBRIDGE_H
