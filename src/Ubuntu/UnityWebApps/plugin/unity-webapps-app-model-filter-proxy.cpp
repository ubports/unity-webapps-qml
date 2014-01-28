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

#include "unity-webapps-app-model-filter-proxy.h"

#include "unity-webapps-app-model.h"


UnityWebappsAppModelFilterProxy::UnityWebappsAppModelFilterProxy(QObject *parent)
    : QSortFilterProxyModel(parent)
{}


UnityWebappsAppModelFilterProxy::~UnityWebappsAppModelFilterProxy()
{}


UnityWebappsAppModel* UnityWebappsAppModelFilterProxy::sourceModel () const
{
    return sourceModel();
}


void UnityWebappsAppModelFilterProxy::setsourceModel (UnityWebappsAppModel * model)
{
    setSourceModel(model);

    Q_EMIT sourceModelChanged();
}


QString UnityWebappsAppModelFilterProxy::webappName () const
{
    return _name;
}


void UnityWebappsAppModelFilterProxy::setwebappName (const QString& name)
{
    _name = name;

    Q_EMIT webappNameChanged();
}


bool UnityWebappsAppModelFilterProxy::filterAcceptsRow(int source_row,
                                                       const QModelIndex &source_parent) const
{
    if (_name.isEmpty() || !sourceModel())
    {
        // filter out everything
        return false;
    }

    QString rowName =
        sourceModel()->data(sourceModel()->index(source_row, 0, source_parent),
                            UnityWebappsAppModel::Name).toString();

    return 0 == _name.toLower().compare(rowName.toLower());
}

