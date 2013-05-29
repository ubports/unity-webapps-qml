#include "UnityWebappsApiNotifications.h"

#include <QtCore>

#include <libnotify/notify.h>


UnityWebappsNotification::UnityWebappsNotification(QObject *parent) :
    QObject(parent)
{
}

UnityWebappsNotification::~UnityWebappsNotification()
{
    notify_uninit();
}

void UnityWebappsNotification::show(const QString& summary,
                                    const QString& body,
                                    const QString& icon)
{
    NotifyNotification *notification;
    notification = notify_notification_new (summary.toUtf8().data(),
                                            body.toUtf8().data(),
                                            QFileInfo(icon).canonicalFilePath().toUtf8().data());

    notify_notification_set_timeout (notification, 4);
    notify_notification_set_urgency (notification, NOTIFY_URGENCY_NORMAL);

    GError *error = NULL;
    notify_notification_show (notification, &error);

    if (error) {
        qWarning() << error->message;
    }
}

void UnityWebappsNotification::setName(const QString& name)
{
    _applicationName = name;

    //TODO: this is rather bad, not "closed" at all, very error prone
    notify_init(_applicationName.toUtf8().data());
}

QString UnityWebappsNotification::name() const
{
    return _applicationName;
}

void UnityWebappsNotification::classBegin()
{
}

void UnityWebappsNotification::componentComplete()
{
}
