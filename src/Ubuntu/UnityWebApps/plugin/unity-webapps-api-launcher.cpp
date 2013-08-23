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
#include <gio/gdesktopappinfo.h>
#include <gio/gio.h>

#include <unity.h>
#include <glib-object.h>

#include <QString>
#include <QUrl>
#include <QStringList>
#include <QDebug>
#include <QByteArray>

#include "unity-webapps-desktop-infos.h"
#include "unity-webapps-api-launcher.h"

#define API_CALL_HEADER() do { \
        d->init(); \
        if (!d->_launcher) \
            return; \
    } while(0)

namespace {

} // namespace {


struct UnityWebappsLauncherPrivate
{
    UnityWebappsLauncherPrivate();
    ~UnityWebappsLauncherPrivate();

    void clear();
    void init();

    static QString getDesktopFilenameFor(const QString & name,
                                         const QString & domain);

    QString _name;
    QString _displayName;
    UnityWebappsAppModel *_model;
    UnityLauncherEntry *_launcher;
    QStringList _sources;
    QObject* _callback;
};

QString
UnityWebappsLauncherPrivate::getDesktopFilenameFor(const QString & name,
                                                        const QString & domain)
{
    return QString("%1.desktop").arg(UnityWebappsQML::buildDesktopInfoFileForWebapp(name, domain));
}

UnityWebappsLauncherPrivate::UnityWebappsLauncherPrivate()
    :_model(0), _callback(0)
{
}

UnityWebappsLauncherPrivate::~UnityWebappsLauncherPrivate()
{
    clear();
}

void UnityWebappsLauncherPrivate::clear()
{
    if (_launcher && G_IS_OBJECT(_launcher))
    {
        g_object_unref (G_OBJECT (_launcher));
        _launcher = 0;
    }
    _name.clear();
}

void UnityWebappsLauncherPrivate::init()
{
    if (Q_UNLIKELY(_launcher != NULL))
        return;

    if (Q_UNLIKELY(_model == NULL || _name.isEmpty() || _displayName.isEmpty()))
    {
        qDebug() << "Trying to initialize the Launcher binding with invalid context";
        return;
    }

    QString domain = _model->getDomainFor(_name);
    if (domain.isEmpty())
    {
        qDebug() << "Could not retrieve domain for WebApp: " << _name;
    }

    _launcher = unity_launcher_entry_get_for_desktop_id ("unity-webapps-qml-launcher.desktop");

    qDebug() << "_launcher " << _launcher;
}



UnityWebappsLauncher::UnityWebappsLauncher(QObject *parent)
    : QObject(parent),
      d_ptr(new UnityWebappsLauncherPrivate())
{}

UnityWebappsLauncher::~UnityWebappsLauncher()
{
    delete d_ptr;
}

UnityWebappsAppModel* UnityWebappsLauncher::model() const
{
    Q_D(const UnityWebappsLauncher);

    return d->_model;
}

void UnityWebappsLauncher::setModel(UnityWebappsAppModel * model)
{
    Q_D(UnityWebappsLauncher);

    d->_model = model;

    Q_EMIT modelChanged(model);

    d->init();
}

void UnityWebappsLauncher::setName(const QString &name)
{
    Q_D(UnityWebappsLauncher);
    d->_name = name;

    Q_EMIT nameChanged(name);
}

QString UnityWebappsLauncher::name() const
{
    Q_D(const UnityWebappsLauncher);
    return d->_name;
}

void UnityWebappsLauncher::setDisplayName(const QString &name)
{
    Q_D(UnityWebappsLauncher);
    d->_displayName = name;

    Q_EMIT displayNameChanged(name);
}

QString UnityWebappsLauncher::displayName() const
{
    Q_D(const UnityWebappsLauncher);
    return d->_displayName;
}

void UnityWebappsLauncher::setCount(int count)
{
    Q_D(UnityWebappsLauncher);

    API_CALL_HEADER();

    qDebug() << "setCount " << count;

    unity_launcher_entry_set_count (d->_launcher, count);
    unity_launcher_entry_set_count_visible (d->_launcher, TRUE);
}

int UnityWebappsLauncher::getCount()
{
    Q_D(UnityWebappsLauncher);

    d->init();
    if (!d->_launcher)
        return 0;

    return unity_launcher_entry_get_count(d->_launcher);
}

void UnityWebappsLauncher::clearCount()
{
    Q_D(UnityWebappsLauncher);

    API_CALL_HEADER();

    unity_launcher_entry_set_count_visible (d->_launcher, FALSE);
}

void UnityWebappsLauncher::setProgress(double progress)
{
    Q_D(UnityWebappsLauncher);

    API_CALL_HEADER();

    unity_launcher_entry_set_progress (d->_launcher, progress);
    unity_launcher_entry_set_progress_visible (d->_launcher, TRUE);
}

double UnityWebappsLauncher::getProgress()
{
    Q_D(UnityWebappsLauncher);

    d->init();
    if (!d->_launcher)
        return 0;

    return unity_launcher_entry_get_progress (d->_launcher);
}

void UnityWebappsLauncher::clearProgress()
{
    Q_D(UnityWebappsLauncher);

    API_CALL_HEADER();

    unity_launcher_entry_set_progress_visible (d->_launcher, FALSE);
}

void UnityWebappsLauncher::setUrgent()
{
    Q_D(UnityWebappsLauncher);

    API_CALL_HEADER();

    unity_launcher_entry_set_urgent (d->_launcher, TRUE);
}

void UnityWebappsLauncher::addAction(const QString & actionName, const QString & action)
{
    Q_UNUSED(actionName);
    Q_UNUSED(action);
}

void UnityWebappsLauncher::removeAction(const QString & actionName)
{
    Q_UNUSED(actionName);
}

void UnityWebappsLauncher::removeActions()
{
}

void UnityWebappsLauncher::classBegin()
{
}

void UnityWebappsLauncher::componentComplete()
{
}


