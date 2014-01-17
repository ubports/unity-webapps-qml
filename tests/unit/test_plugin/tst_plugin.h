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

#ifndef TST_PLUGIN_H
#define TST_PLUGIN_H

#include <QTest>

class PluginTest: public QObject
{
    Q_OBJECT

public:
    PluginTest();

private Q_SLOTS:
    void initTestCase();

    // tests
    void testLoadPlugin();
    void testInit();
    void testAbstractItemModelAdaptor();
};

#endif // TST_PLUGIN_H
