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

#include "unity-webapps-app-model.h"

#include <QDebug>
#include <QFile>
#include <QStandardPaths>
#include <QDir>
#include <QUrl>

#include "unity-webapps-app-infos.h"


UnityWebappsAppInfos::UnityWebappsAppInfos(QObject *parent)
    : QObject(parent)
{}

UnityWebappsAppInfos::~UnityWebappsAppInfos()
{}

void UnityWebappsAppInfos::setAppName(const QString& name)
{
    _appName = name;
    Q_EMIT appNameChanged(name);
}

QString UnityWebappsAppInfos::appName() const
{
    return _appName;
}

void UnityWebappsAppInfos::setDisplayName(const QString& name)
{
    _displayName = name;
    Q_EMIT displayNameChanged(name);
}

QString UnityWebappsAppInfos::displayName() const
{
    return _displayName;
}

void UnityWebappsAppInfos::setDesktopId(const QString& desktopId)
{
    _desktopId = desktopId;
    Q_EMIT desktopIdChanged(desktopId);
}

QString UnityWebappsAppInfos::desktopId() const
{
    return _desktopId;
}

void UnityWebappsAppInfos::setIconName(const QString& name)
{
    if (0 == _iconName.compare(name))
        return;

    _iconName = name;
    Q_EMIT iconNameChanged(name);
}

QString UnityWebappsAppInfos::iconName() const
{
    return _iconName;
}

UnityWebappsAppModel* UnityWebappsAppInfos::model() const
{
    return _model;
}

void UnityWebappsAppInfos::setModel(UnityWebappsAppModel *  model)
{
    if (model == _model)
        return;
    _model = model;
    Q_EMIT modelChanged(model);
}

