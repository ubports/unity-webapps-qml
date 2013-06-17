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

#include <glib.h>
#include <messaging-menu.h>

#include "unity-webapps-api-messaging-menu.h"


class UnityWebappsMessagingMenuPrivate
{
    friend class UnityWebappsMessagingMenu;

    UnityWebappsMessagingMenuPrivate();
    ~UnityWebappsMessagingMenuPrivate();

    void clear();
    void init();

    static QString getDesktopFilenameFor(const QString & name);

    QString _name;
    MessagingMenuApp *_mmapp;
};

QString UnityWebappsMessagingMenuPrivate::getDesktopFilenameFor(const QString & name)
{
    return QString("%1.desktop").arg(name);
}

UnityWebappsMessagingMenuPrivate::UnityWebappsMessagingMenuPrivate()
    :_mmapp(0)
{}

UnityWebappsMessagingMenuPrivate::~UnityWebappsMessagingMenuPrivate()
{
    clear();
}

void UnityWebappsMessagingMenuPrivate::clear()
{
    if (_mmapp && G_IS_OBJECT(_mmapp))
    {
        messaging_menu_app_unregister(_mmapp);
        g_object_unref(_mmapp);
        _mmapp = 0;
    }
    _name.clear();
}

void UnityWebappsMessagingMenuPrivate::init()
{
    _mmapp = messaging_menu_app_new (getDesktopFilenameFor(_name).toStdString().c_str());
    messaging_menu_app_register (_mmapp);
}


UnityWebappsMessagingMenu::UnityWebappsMessagingMenu(QObject *parent)
    : QObject(parent),
      d_ptr(new UnityWebappsMessagingMenuPrivate())
{}

UnityWebappsMessagingMenu::~UnityWebappsMessagingMenu()
{
    delete d_ptr;
}

void UnityWebappsMessagingMenu::showIndicator(const QString& name)
{
    Q_UNUSED(name);
}

void UnityWebappsMessagingMenu::clearIndicator(const QString& name)
{
    Q_UNUSED(name);
}

void UnityWebappsMessagingMenu::setProperty(const QString& name, const QVariant& value)
{
    Q_UNUSED(name);
    Q_UNUSED(value);
}

void UnityWebappsMessagingMenu::clearIndicators()
{
}

void UnityWebappsMessagingMenu::setName(const QString &name)
{
    Q_D(UnityWebappsMessagingMenu);
    d->_name = name;
}

QString UnityWebappsMessagingMenu::name() const
{
    Q_D(const UnityWebappsMessagingMenu);
    return d->_name;
}

void UnityWebappsMessagingMenu::classBegin()
{
}

void UnityWebappsMessagingMenu::componentComplete()
{
    Q_D(UnityWebappsMessagingMenu);
    d->init();
}
