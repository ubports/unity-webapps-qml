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

#include "callback.h"

#include <QJsonValue>
#include <QDebug>
#include <QFile>


UnityWebappsCallback::UnityWebappsCallback(QObject *parent)
    : QObject(parent)
{}

UnityWebappsCallback::~UnityWebappsCallback()
{}

void UnityWebappsCallback::trigger (QVariant user_data)
{
    Q_EMIT triggered(user_data);
}
