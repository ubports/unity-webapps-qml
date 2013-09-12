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

#include "unity-webapps-icon-utils.h"


QString
UnityWebappsQML::getIconPathFor (const QString& iconURI)
{
    static const QString ICON_URI_SCHEME = "icon://";
    if (iconURI.startsWith (ICON_URI_SCHEME))
    {
        return iconURI.right(iconURI.count() - ICON_URI_SCHEME.count());
    }
    return QString();
}

