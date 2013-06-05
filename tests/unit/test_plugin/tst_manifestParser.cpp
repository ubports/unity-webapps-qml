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
//    qputenv("QML2_IMPORT_PATH", "../../../bin");
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

