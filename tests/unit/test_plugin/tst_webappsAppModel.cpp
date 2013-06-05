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

#include "tst_webappsAppModel.h"

#include <QDebug>
#include <QQmlComponent>
#include <QQmlContext>
#include <QQmlEngine>
#include <QSignalSpy>
#include <QJsonDocument>
#include <QTest>
#include <QDir>

#include "plugin/unity-webapps-app-model.h"


class TestEnvironment: public UnityWebappsAppModel::Environment
{
public:
    virtual QString getWebAppsSearchPath () const
    {
        return "./data/installed-webapps";
    }
};

class EmptyTestEnvironment: public UnityWebappsAppModel::Environment
{
public:
    virtual QString getWebAppsSearchPath () const
    {
        return "./data/no-installed-webapps";
    }
};


WebappsAppModelTest::WebappsAppModelTest()
    :QObject(0)
{}

void WebappsAppModelTest::initTestCase()
{
//    qputenv("QML2_IMPORT_PATH", "../../../bin");
}

void WebappsAppModelTest::testEmptyWebappsModel()
{
    UnityWebappsAppModel
            model(QSharedPointer<UnityWebappsAppModel::Environment>(new EmptyTestEnvironment()));

    QVERIFY(model.rowCount() == 0);
}

void WebappsAppModelTest::testWebappsModel()
{
    QSharedPointer<UnityWebappsAppModel::Environment>
            environment(new TestEnvironment());

    const int VALID_INSTALLED_WEBAPPS_COUNT =
            QDir(environment->getWebAppsSearchPath())
             .entryInfoList (QStringList("*-valid"), QDir::Dirs)
             .count();

    UnityWebappsAppModel
            model(environment);

    const int FOUND_COUNT = model.rowCount();
    QCOMPARE(FOUND_COUNT, VALID_INSTALLED_WEBAPPS_COUNT);

    for (int i = 0; i < FOUND_COUNT; ++i)
    {
        QVariant d = model.data(model.index(i), UnityWebappsAppModel::Name);
        QVERIFY(d.canConvert(QVariant::String));
        QVERIFY(d.toString().endsWith("-valid"));

        QVariant content = model.data(model.index(i), UnityWebappsAppModel::Content);
        QVERIFY(content.canConvert(QVariant::String));
        QVERIFY(!content.toString().isEmpty());
    }
}

void WebappsAppModelTest::testWebappsContentWithRequiresModel()
{
    QSharedPointer<UnityWebappsAppModel::Environment>
            environment(new TestEnvironment());

    const int VALID_INSTALLED_WEBAPPS_COUNT =
            QDir(environment->getWebAppsSearchPath())
             .entryInfoList (QStringList("*-valid"), QDir::Dirs)
             .count();

    UnityWebappsAppModel
            model(environment);

    const int FOUND_COUNT = model.rowCount();
    QCOMPARE(FOUND_COUNT, VALID_INSTALLED_WEBAPPS_COUNT);
    bool requiresFound = false;

    for (int i = 0; i < FOUND_COUNT; ++i)
    {
        QVariant d = model.data(model.index(i), UnityWebappsAppModel::Name);
        QVERIFY(d.canConvert(QVariant::String));
        QVERIFY(d.toString().endsWith("-valid"));

        if (d.toString() == "with-requires-valid")
        {
            QVariant content = model.data(model.index(i), UnityWebappsAppModel::Content);
            QVERIFY(content.canConvert(QVariant::String));
            QVERIFY(!content.toString().isEmpty());

            QVERIFY(content.toString().contains("var trim = function (s) { return s; };"));
            requiresFound = true;
            break;
        }
    }

    QVERIFY(requiresFound);
}
