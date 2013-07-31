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

#ifndef __UNITY_WEBAPPS_DESKTOP_INFOS_H__
#define __UNITY_WEBAPPS_DESKTOP_INFOS_H__

namespace UnityWebappsQML {

QString
buildDesktopInfoFileForWebapp (const QString& name, const QString& domain);

QString
canonicalize(const QString& s, bool keep_whitespaces = false);

}

#endif // __UNITY_WEBAPPS_DESKTOP_INFOS_H__
