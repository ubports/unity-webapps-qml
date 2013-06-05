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

#ifndef __TST_MANIFEST_PARSER_H__
#define __TST_MANIFEST_PARSER_H__

#include <QObject>
#include <QFileInfoList>
#include <QTest>


class ManifestParserTest: public QObject
{
    Q_OBJECT

public:
    ManifestParserTest();

private Q_SLOTS:
    void initTestCase();

    // tests
    void testParseManifest();


private:

    static QFileInfoList   listManifests(const QDir& parent);
    static bool   shouldManifestSucceed(const QString& filename);
};

#endif // __TST_MANIFEST_PARSER_H__
