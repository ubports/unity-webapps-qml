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
#include "unity-webapps-app-infos.h"
#include "unity-webapps-app-model.h"

#include <QDebug>
#include <QFile>
#include <QStandardPaths>
#include <QDir>
#include <QUrl>

#include <gio/gdesktopappinfo.h>

#include "unity-webapps-desktop-infos.h"


namespace {

QString
getDesktopFilenameFor(const QString & name,
                      const QString & domain)
{
    return QString("%1.desktop").arg(UnityWebappsQML::buildDesktopInfoFileForWebapp(name, domain));
}

} // namespace {


UnityWebapps::UnityWebapps(QObject *parent)
    : QObject(parent)
    , _model(0)
    , _appInfos(0)
{}

UnityWebapps::~UnityWebapps()
{
    cleanup();
}

void UnityWebapps::cleanup()
{
    delete _appInfos;
    _appInfos = 0;
}

void UnityWebapps::init(const QString& name,
                        const QString& url,
                        const QVariant& args)
{
    Q_UNUSED(name);

    if (_appInfos != NULL)
        cleanup();

    if (QString(args.typeName()).compare("QVariantMap") != 0)
    {
        qDebug() << "Invalid init() parameter types: " << args.typeName();

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

    bool success = initInternal(name, displayName, domain, iconUrl, url);

    if (success)
        buildAppInfos(name, displayName, domain, getDesktopFilenameFor(displayName, domain));

    Q_EMIT initCompleted(success);
}

UnityWebappsAppInfos * UnityWebapps::appInfos()
{
    return _appInfos;
}

UnityWebappsAppModel* UnityWebapps::model() const
{
    return _model;
}

void UnityWebapps::setAppModel(UnityWebappsAppModel * model)
{
    if (_model == model)
        return;
    _model = model;
}

void UnityWebapps::buildAppInfos(const QString & name,
                                 const QString & displayName,
                                 const QString & domain,
                                 const QString & desktopId)
{
    Q_UNUSED(domain);

    if (_appInfos != NULL)
    {
        qDebug() << "WARNING: Found existing application info for app " << name;
        return;
    }

    _appInfos = new UnityWebappsAppInfos();
    _appInfos->setAppName(name);
    _appInfos->setDisplayName(displayName);
    _appInfos->setDesktopId(desktopId);

    _appInfos->setModel(_model);

    Q_EMIT appInfosChanged(_appInfos);
}

bool UnityWebapps::initInternal(const QString& name,
                                const QString& displayName,
                                const QString& domain,
                                const QString& iconUrl,
                                const QString& url)
{
    Q_UNUSED(name);

    bool successful = false;

    if ( ! isValidInitForWebappAndModel(domain, displayName, url))
    {
        qDebug() << "Invalid init() call from javascript for webapp " << name << " and current model";
        return false;
    }

    successful = ensureDesktopExists(displayName, domain, iconUrl);

    return successful;
}

bool UnityWebapps::isValidInitForWebappAndModel (const QString & domain,
                                                 const QString & displayName,
                                                 const QString & url)
{
    if (NULL == _model)
        return true;

    if ( ! _model->exists(displayName))
    {
        qDebug() << "Initializing a non-local webapp (not found installed locally)";
        return true;
    }

    QString modelAppDomain = _model->getDomainFor(displayName);
    if (modelAppDomain.isEmpty())
    {
        qDebug() << "Validation a weird webapps install: domain name empty for " << displayName;
        return true;
    }

    return modelAppDomain.compare(domain, Qt::CaseInsensitive) == 0
            && _model->doesUrlMatchesWebapp(displayName, url);
}

QString UnityWebapps::getUserSharePath()
{
    QStringList userhomeList =
            QStandardPaths::standardLocations(QStandardPaths::HomeLocation);
    if (userhomeList.isEmpty())
    {
        qDebug() << "Error cannot find current '~'";
        return QString();
    }

    QDir home(userhomeList.at(0));
    return home.absolutePath() + QDir::separator() + ".local/share";
}

bool UnityWebapps::ensureDesktopExists(const QString& displayName,
                                       const QString& domain,
                                       const QString& iconName)
{
    QString desktopId =
            QString("%1.desktop").arg(UnityWebappsQML::buildDesktopInfoFileForWebapp(displayName, domain));

    QDir localDesktopFile(getUserSharePath()
                          + QDir::separator()
                          + "applications/"
                          + desktopId);
    if (localDesktopFile.exists())
    {
        return true;
    }

    GDesktopAppInfo *appinfo =
            g_desktop_app_info_new(desktopId.toLatin1());
    bool success = true;
    if ( ! appinfo)
    {
        success = createDefaultDesktopFileFor(desktopId, displayName, domain, iconName);
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

    QString shareDirPath (getUserSharePath());
    if (shareDirPath.isEmpty())
    {
        qDebug() << "Error while trying to get current session home directory";
        return success;
    }
    shareDirPath += QDir::separator() + QString("applications/");

    // Create the directory if it doesn't exist
    QDir shareDir(shareDirPath);
    if (!shareDir.exists())
    {
        shareDir.mkpath(".");
    }

    QString desktopFilePath = QDir::cleanPath(shareDirPath + desktopId);

    // Should not happen
    if (QFile::exists(desktopFilePath))
    {
        qDebug() << "Desktop file found when it should not be there: " << desktopFilePath;
        return true;
    }

    //FIXME: encore webappName
    QString contents = QString("[Desktop Entry]\n"
                               "Name=%1\n"
                               "Type=Application\n"
                               "Icon=%2\n"
                               "Actions=S0;S1;S2;S3;S4;S5;S6;S7;S8;S9;S10;\n"
                               "Exec=webbrowser-app --chromeless --fullscreen --webapp='%3' %u")
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

