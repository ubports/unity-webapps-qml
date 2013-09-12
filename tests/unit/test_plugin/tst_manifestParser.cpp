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

#include "tst_manifestParser.h"

#include <QDebug>
#include <QQmlComponent>
#include <QQmlContext>
#include <QQmlEngine>
#include <QSignalSpy>
#include <QJsonDocument>
#include <QDir>

#include "plugin/unity-webapps-app-manifest-parser.h"


namespace {

const QString manifestsDataPath = "./data/manifests";

void verifyChrome(const QString & filename,
                  const ManifestFileInfoOption & option)
{
    if (! filename.contains("chrome"))
    {
        // regular validation, should default to no-chrome
        QVERIFY(option.value().chromeOptions.contains("no-chrome") && option.value().chromeOptions.count() == 1);
        return;
    }

    bool noChromePresent = filename.contains("no-chrome");
    if (noChromePresent)
    {
        // no-chrome should override any other value
        QVERIFY(option.value().chromeOptions.contains("no-chrome") && option.value().chromeOptions.count() == 1);
        return;
    }

    if (filename.contains("backfw"))
    {
        QVERIFY(option.value().chromeOptions.contains("back-forward-buttons") && ! option.value().chromeOptions.contains("no-chrome"));
    }

    if (filename.contains("reload"))
    {
        QVERIFY(option.value().chromeOptions.contains("reload-button") && ! option.value().chromeOptions.contains("no-chrome"));
    }
}

} // namespace {


ManifestParserTest::ManifestParserTest()
    :QObject(0)
{}

QFileInfoList
ManifestParserTest::listManifests(const QDir& parent)
{
    return parent.entryInfoList(QStringList("*.json"), QDir::Files);
}

bool
ManifestParserTest::shouldManifestSucceed(const QString& filename)
{
    return filename.startsWith("valid-");
}

void ManifestParserTest::initTestCase()
{
}

void ManifestParserTest::testParseManifest()
{
    UnityWebappsAppManifestParser parser;

    QFileInfoList manifests = listManifests(manifestsDataPath);
    Q_FOREACH(QFileInfo manifest, manifests)
    {
        QVERIFY(manifest.isFile());
        ManifestFileInfoOption result =
                parser.parse(manifest);

        QString filename = manifest.fileName();
        QVERIFY(result.isvalid() == shouldManifestSucceed(filename));
    }
}

void ManifestParserTest::testParseChromeOptions()
{
    UnityWebappsAppManifestParser parser;

    QFileInfoList manifests = listManifests(manifestsDataPath);
    Q_FOREACH(QFileInfo manifest, manifests)
    {
        QVERIFY(manifest.isFile());
        ManifestFileInfoOption result =
                parser.parse(manifest);

        QString filename = manifest.fileName();
        QVERIFY(result.isvalid() == shouldManifestSucceed(filename));

        verifyChrome(filename, result);
    }
}
