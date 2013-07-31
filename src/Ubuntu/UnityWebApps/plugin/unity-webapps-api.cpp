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

#include "unity-webapps-api.h"

#include <QDebug>
#include <QFile>
#include <QStandardPaths>
#include <QDir>
#include <QUrl>

#include <gio/gdesktopappinfo.h>

#include "unity-webapps-desktop-infos.h"


UnityWebapps::UnityWebapps(QObject *parent)
    : QObject(parent)
{}

UnityWebapps::~UnityWebapps()
{}

void UnityWebapps::init(const QString& name, const QVariant& args)
{
    Q_UNUSED(name);

    if (QString(args.typeName()).compare("QVariantMap") != 0)
    {
        qDebug() << "Invalid init() parameter types: " <<args.typeName();

        Q_EMIT initCompleted(false);

        return;
    }

    QVariantMap initArgs =
        qvariant_cast<QVariantMap>(args);
    if ( ! initArgs.contains("name") ||
         ! initArgs.contains("domain") ||
         ! initArgs.contains("iconUrl")
         )
    {
        qDebug() << "Invalid init() parameter content (not found): name, domain and iconUrl are mandatory";

        Q_EMIT initCompleted(false);

        return;
    }
    if ( ! initArgs.value("name").canConvert<QString>() ||
         ! initArgs.value("domain").canConvert<QString>() ||
         ! initArgs.value("iconUrl").canConvert<QString>()
         )
    {
        qDebug() << "Invalid init() parameter value types.";

        Q_EMIT initCompleted(false);

        return;
    }

    QString displayName = initArgs.value("name").toString();
    QString iconUrl = initArgs.value("iconUrl").toString();
    QString domain = initArgs.value("domain").toString();

    bool success = init(displayName, domain, iconUrl);

    Q_EMIT initCompleted(success);
}

bool UnityWebapps::init(const QString& name,
                        const QString& domain,
                        const QString& iconUrl)
{
    return ensureDesktopExists(name, domain, iconUrl);
}

bool UnityWebapps::ensureDesktopExists(const QString& webappName,
                                       const QString& domain,
                                       const QString& iconName)
{
    QString desktopId =
            QString("%1.desktop").arg(UnityWebappsQML::buildDesktopInfoFileForWebapp(webappName, domain));

    GDesktopAppInfo *appinfo =
            g_desktop_app_info_new(desktopId.toLatin1());
    bool success = true;
    if ( ! appinfo)
    {
        success = createDefaultDesktopFileFor(desktopId, webappName, domain, iconName);
    }

//    g_object_unref(appinfo);

    return success;
}

bool UnityWebapps::createDefaultDesktopFileFor (const QString& desktopId,
                                                const QString& webappName,
                                                const QString& domain,
                                                const QString& iconName)
{
    Q_UNUSED(domain);

    bool success = false;

    QStringList userhomeList =
            QStandardPaths::standardLocations(QStandardPaths::HomeLocation);
    if (userhomeList.isEmpty())
    {
        qDebug() << "Error (cannot find ~) while trying to ensure that a desktop file exists for: " << webappName;
        return success;
    }

    QDir home(userhomeList.at(0));
    QString desktopFilePath =
            QDir::cleanPath(home.absolutePath() + QDir::separator() + ".local/share/applications/" + desktopId);

    // Should not happen
    if (QFile::exists(desktopFilePath))
    {
        qCritical() << "Desktop file found when it should not be there: " << desktopFilePath;
        return success;
    }

    //FIXME: encore webappName
    QString contents = QString("[Desktop Entry]\n"
                               "Name=%1\n"
                               "Type=Application\n"
                               "Icon=%2\n"
                               "Actions=S0;S1;S2;S3;S4;S5;S6;S7;S8;S9;S10;\n"
                               "Exec=webbrowser-app --chromeless --webapp=%3' %%u")
            .arg(webappName)
            .arg(iconName)
            .arg(QString(QUrl::toPercentEncoding(webappName)));

    QFile f(desktopFilePath);
    if ( ! f.open(QIODevice::WriteOnly))
    {
        qCritical() << "Could not create desktop file: " << desktopFilePath;
        return success;
    }

    f.write(contents.toUtf8());
    f.close();

    success = true;

    return success;
}


// QMLParserStatus
void UnityWebapps::classBegin()
{}

void UnityWebapps::componentComplete()
{}

