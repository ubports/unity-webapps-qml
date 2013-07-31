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

#include <QString>
#include <QChar>

#include "unity-webapps-desktop-infos.h"


QString
UnityWebappsQML::buildDesktopInfoFileForWebapp (const QString& name, const QString& domain)
{
    return QString("%1%2").arg(UnityWebappsQML::canonicalize(name)).arg(UnityWebappsQML::canonicalize(domain));
}

QString
UnityWebappsQML::canonicalize(const QString& s, bool keep_whitespaces)
{
    QString canonicalized;

    for (QString::const_iterator it = s.begin();
        it != s.end();
        ++it)
    {
        if (it->isLetterOrNumber() || (keep_whitespaces && it->isSpace()))
            canonicalized.append(*it);
    }
    return canonicalized;
}

