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


namespace {

QString VALID_INSTALLED_WEBAPPS_SEARCH_PATH = "./data/installed-webapps";

}

WebappsAppModelTest::WebappsAppModelTest()
    :QObject(0)
{}

void WebappsAppModelTest::initTestCase()
{
}

void WebappsAppModelTest::testEmptyWebappsModel()
{
    UnityWebappsAppModel
            model;
    model.setSearchPath("./data/no-installed-webapps");
    QVERIFY(model.rowCount() == 0);
}

void WebappsAppModelTest::testWebappsModel()
{
    const int VALID_INSTALLED_WEBAPPS_COUNT =
            QDir(VALID_INSTALLED_WEBAPPS_SEARCH_PATH)
             .entryInfoList (QStringList("*-valid"), QDir::Dirs)
             .count();

    UnityWebappsAppModel
            model;
    model.setSearchPath(VALID_INSTALLED_WEBAPPS_SEARCH_PATH);

    const int FOUND_COUNT = model.rowCount();
    QCOMPARE(FOUND_COUNT, VALID_INSTALLED_WEBAPPS_COUNT);

    for (int i = 0; i < FOUND_COUNT; ++i)
    {
        QVariant d = model.data(model.index(i), UnityWebappsAppModel::Name);
        QVERIFY(d.canConvert(QVariant::String));
        QVERIFY(d.toString().endsWith("-valid"));

        QVariant content = model.data(model.index(i), UnityWebappsAppModel::ScriptsContent);
        QVERIFY(content.canConvert(QVariant::String));
        QVERIFY(!content.toString().isEmpty());

        QVERIFY(!model.getDomainFor(d.toString()).isEmpty());
    }
}

void WebappsAppModelTest::testWebappsContentWithRequiresModel()
{
    const int VALID_INSTALLED_WEBAPPS_COUNT =
            QDir(VALID_INSTALLED_WEBAPPS_SEARCH_PATH)
             .entryInfoList (QStringList("*-valid"), QDir::Dirs)
             .count();

    UnityWebappsAppModel
            model;
    model.setSearchPath(VALID_INSTALLED_WEBAPPS_SEARCH_PATH);

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
            QVariant content = model.data(model.index(i), UnityWebappsAppModel::ScriptsContent);
            QVERIFY(content.canConvert(QVariant::String));
            QVERIFY(!content.toString().isEmpty());

            QVERIFY(content.toString().contains("var trim = function (s) { return s; };"));
            requiresFound = true;
            break;
        }
    }

    QVERIFY(requiresFound);
}

void WebappsAppModelTest::testWebappsModelUrlMatch()
{
    const int VALID_INSTALLED_WEBAPPS_COUNT =
            QDir(VALID_INSTALLED_WEBAPPS_SEARCH_PATH)
             .entryInfoList (QStringList("*-valid"), QDir::Dirs)
             .count();

    UnityWebappsAppModel
            model;
    model.setSearchPath(VALID_INSTALLED_WEBAPPS_SEARCH_PATH);

    const int FOUND_COUNT = model.rowCount();
    QCOMPARE(FOUND_COUNT, VALID_INSTALLED_WEBAPPS_COUNT);

    int i = 0;
    for (; i < FOUND_COUNT; ++i)
    {
        QString name = model.data(model.index(i), UnityWebappsAppModel::Name).toString();

        if (name.compare("BBCNews-valid") != 0)
            continue;

        QVERIFY(model.doesUrlMatchesWebapp(name, "http://www.bbc.co.uk/news"));
        QVERIFY(model.doesUrlMatchesWebapp(name, "http://www.bbc.co.uk/news/extra/e"));
        QVERIFY(model.doesUrlMatchesWebapp(name, "http://www.bbc.com/news/extra/e"));
        QVERIFY( ! model.doesUrlMatchesWebapp(name, "http://www.bbc.com/sports/extra/e"));

        break;
    }

    QVERIFY(i != FOUND_COUNT);
}

void WebappsAppModelTest::testSimplifiedManifestInstall()
{
    QStringList paths =
            QStringList() << QString("./data/simple-install")
                          << QString("./data/simple-install-embedded");

    Q_FOREACH(QString path, paths)
    {
        UnityWebappsAppModel
                model;
        model.setSearchPath(path);

        const int FOUND_COUNT = model.rowCount();
        QCOMPARE(FOUND_COUNT, 1);

        QString name = model.data(model.index(0), UnityWebappsAppModel::Name).toString();
        QVERIFY(name == "MyWebApp");

        QVERIFY(model.data(model.index(0), UnityWebappsAppModel::Homepage).toString() == "http://www.bbc.co.uk/news/");
        QCOMPARE(model.data(model.index(0), UnityWebappsAppModel::Urls).toStringList().count(), 0);
        QVERIFY(model.data(model.index(0), UnityWebappsAppModel::UserAgentOverride).toString() == "");
        QVERIFY(model.data(model.index(0), UnityWebappsAppModel::Domain).toString() == "bbc.co.uk");
        QCOMPARE(model.data(model.index(0), UnityWebappsAppModel::Scripts).toStringList().count(), 0);
        QVERIFY(model.data(model.index(0), UnityWebappsAppModel::ScriptsContent).toString() == "");
    }
}
