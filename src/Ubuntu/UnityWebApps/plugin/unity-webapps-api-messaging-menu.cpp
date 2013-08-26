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

#include <messaging-menu.h>
#include <glib-object.h>

#include <QString>
#include <QUrl>
#include <QStringList>
#include <QDebug>
#include <QByteArray>

#include "unity-webapps-desktop-infos.h"
#include "unity-webapps-app-infos.h"

#include "unity-webapps-api-messaging-menu.h"


#define API_CALL_HEADER() do { \
        d->init(); \
        if (!d->_mmapp) \
            return; \
    } while(0)

namespace {

QString
getIconPathFor(const QString& iconURI)
{
    static const QString ICON_URI_SCHEME = "icon://";
    if (!iconURI.startsWith(ICON_URI_SCHEME))
    {
        qDebug() << QString("%1 does not start with a proper icon uri scheme").arg(iconURI);
        return QString();
    }
    return QString();
}

GIcon * requestImage(const QString &iconId)
{
    QByteArray utf8Name = QUrl::fromPercentEncoding(iconId.toUtf8()).toUtf8();
    GError *error = NULL;
    GIcon *icon = g_icon_new_for_string(utf8Name.data(), &error);
    if (error)
    {
        qDebug() << "Could not load icon: " << error->message;
        g_error_free(error);
        return NULL;
    }

    return icon;
}


} // namespace {


static void
unity_webapps_messaging_menu_source_activated (
        MessagingMenuApp *mmapp,
        const gchar      *source_id,
        gpointer          user_data);



struct UnityWebappsMessagingMenuPrivate
{
    UnityWebappsMessagingMenuPrivate();
    ~UnityWebappsMessagingMenuPrivate();

    void clear();
    void init();

    UnityWebappsAppInfos *_appInfos;

    MessagingMenuApp *_mmapp;
    QStringList _sources;
    QObject* _callback;
};


UnityWebappsMessagingMenuPrivate::UnityWebappsMessagingMenuPrivate()
    : _appInfos(0), _mmapp(0), _callback(0)
{
}

UnityWebappsMessagingMenuPrivate::~UnityWebappsMessagingMenuPrivate()
{
    clear();
}

void UnityWebappsMessagingMenuPrivate::clear()
{
    if (_mmapp && G_IS_OBJECT(_mmapp))
    {
        g_signal_handlers_disconnect_by_func(_mmapp,
                                             (gpointer)unity_webapps_messaging_menu_source_activated,
                                             this);

        g_object_unref(_mmapp);

        _mmapp = 0;
    }
    _appInfos = 0;
    _callback = 0;
    _sources.clear();
}

static void
unity_webapps_messaging_menu_source_activated (
        MessagingMenuApp *mmapp,
        const gchar      *source_id,
        gpointer          user_data)
{
    Q_UNUSED(mmapp);
    Q_UNUSED(source_id);

    UnityWebappsMessagingMenuPrivate* self =
            static_cast<UnityWebappsMessagingMenuPrivate*>(user_data);

    qDebug() << "activated";

    // FIXME make sure that we have a proper qobject (still alive)
//    if ( ! qobject_cast(self))
//        return;

    if (self->_callback)
        QMetaObject::invokeMethod(self->_callback, "trigger");
}

void UnityWebappsMessagingMenuPrivate::init()
{
    if (Q_UNLIKELY(_mmapp != NULL))
        return;

    if (Q_UNLIKELY(_appInfos == NULL))
    {
        qDebug() << "Trying to initialize the MessagingMenu binding with invalid context";
        return;
    }

    QString desktopId = _appInfos->desktopId();
    if (desktopId.isEmpty())
    {
        qDebug() << "MessagingMenu backend: invalid desktop id (empty)";
        return;
    }

    _mmapp = messaging_menu_app_new (desktopId.toUtf8().data());

    messaging_menu_app_register (_mmapp);

    g_signal_connect (_mmapp,
                      "activate-source",
                      G_CALLBACK (unity_webapps_messaging_menu_source_activated),
                      this);
}



UnityWebappsMessagingMenu::UnityWebappsMessagingMenu(QObject *parent)
    : QObject(parent),
      d_ptr(new UnityWebappsMessagingMenuPrivate())
{}

UnityWebappsMessagingMenu::~UnityWebappsMessagingMenu()
{
    delete d_ptr;
}

void UnityWebappsMessagingMenu::onAppInfosChanged(UnityWebappsAppInfos *appInfos)
{
    Q_D(UnityWebappsMessagingMenu);

    qDebug() << "onAppInfosChanged called for messaging menu";

    bool wasInit = false;
    if (d->_mmapp)
    {
        wasInit = true;
        d->clear();
    }
    d->_appInfos = appInfos;

    if (wasInit) d->init();
}

void UnityWebappsMessagingMenu::showIndicator(const QString& indicatorName)
{
    Q_D(UnityWebappsMessagingMenu);

    API_CALL_HEADER();

    if (indicatorName.isEmpty())
    {
        qDebug() << "Invalid indicator label name: " << indicatorName;
        return;
    }

    QByteArray content = indicatorName.toUtf8();
    const gchar *indicatorName_cstr = content.data();

    if ( ! messaging_menu_app_has_source (d->_mmapp, indicatorName_cstr))
    {
        messaging_menu_app_append_source (d->_mmapp,
                                          indicatorName_cstr,
                                          NULL,
                                          indicatorName_cstr);

        d->_sources.append(indicatorName);
    }
}

void UnityWebappsMessagingMenu::clearIndicator(const QString& indicatorName)
{
    Q_D(UnityWebappsMessagingMenu);

    API_CALL_HEADER();

    QByteArray content = indicatorName.toUtf8();
    const gchar *indicatorName_cstr = content.data();

    if (messaging_menu_app_has_source (d->_mmapp, indicatorName_cstr))
    {
        messaging_menu_app_remove_source (d->_mmapp,
                                          indicatorName_cstr);
        d->_sources.removeAll(indicatorName);
    }
}

void UnityWebappsMessagingMenu::clearIndicators()
{
    Q_D(UnityWebappsMessagingMenu);

    API_CALL_HEADER();

    QStringList indicators = d->_sources;
    Q_FOREACH(QString indicator, indicators)
    {
        clearIndicator(indicator);
    }
}

void UnityWebappsMessagingMenu::setProperty(const QString& indicatorName,
                                            const QString& propertyName,
                                            const QVariant& value)
{
    Q_D(UnityWebappsMessagingMenu);

    API_CALL_HEADER();

    if (indicatorName.isEmpty())
    {
        qDebug() << "Invalid empty indicator name";
        return;
    }

    if (propertyName.isEmpty())
    {
        qDebug() << "Invalid empty indicator property";
        return;
    }

    QByteArray content = indicatorName.toUtf8();
    const gchar *indicatorName_cstr = content.data();

    if (propertyName.compare("icon", Qt::CaseInsensitive) == 0)
    {
        GIcon *icon = requestImage(getIconPathFor(value.toString()));

        messaging_menu_app_set_source_icon (d->_mmapp, indicatorName_cstr, icon);

        g_object_unref (icon);
    }
    else if (propertyName.compare("callback", Qt::CaseInsensitive) == 0)
    {
        if (QString(value.typeName()).compare("QObject*") != 0)
        {
            qDebug() << "Invalid callback type";
            return;
        }

        //FIXME: ownership & lifetime management
        QObject * const callback = *static_cast<QObject *const*>(value.data());
        if (callback->metaObject()->indexOfSlot("trigger") != -1)
        {
            qDebug() << "Invalid callback type: no trigger method";
            return;
        }

        d->_callback = callback;
    }
    else if (propertyName.compare("label", Qt::CaseInsensitive) == 0)
    {
        const char *label= value.toString().toStdString().c_str();
        messaging_menu_app_set_source_label (d->_mmapp, indicatorName_cstr, label);
    }
    else if (propertyName.compare("count", Qt::CaseInsensitive) == 0)
    {
        int count = value.toString().toInt();

        messaging_menu_app_set_source_count (d->_mmapp, indicatorName_cstr, count);

        if (count != 0)
          messaging_menu_app_draw_attention (d->_mmapp, indicatorName_cstr);
        else
          messaging_menu_app_remove_attention (d->_mmapp, indicatorName_cstr);
    }
}

void UnityWebappsMessagingMenu::classBegin()
{
}

void UnityWebappsMessagingMenu::componentComplete()
{
}


