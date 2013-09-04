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

#include "unity-webapps-icon-utils.h"
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
    , _handleDesktopFileUpdates(true)
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

    qDebug() << "init";

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
        buildAppInfos(name,
                      displayName,
                      domain,
                      getDesktopFilenameFor(displayName, domain),
                      iconUrl);

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
                                 const QString & desktopId,
                                 const QString & iconName)
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
    _appInfos->setIconName(iconName);
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

bool UnityWebapps::handleDesktopFileUpdates() const
{
    return _handleDesktopFileUpdates;
}

void UnityWebapps::setHandleDesktopFileUpdates (bool handle)
{
    _handleDesktopFileUpdates = handle;
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

QString UnityWebapps::getLocalDesktopFilepath(const QString & desktopId)
{
    return getUserSharePath()
            + QDir::separator()
            + "applications/"
            + desktopId;
}

bool UnityWebapps::ensureDesktopExists(const QString& displayName,
                                       const QString& domain,
                                       const QString& iconName)
{
    if ( ! handleDesktopFileUpdates())
        return true;

    QString desktopId = getDesktopFilenameFor(displayName, domain);

    QDir localDesktopFile (getLocalDesktopFilepath (desktopId));
    if (localDesktopFile.exists())
    {
        return true;
    }

    GDesktopAppInfo *appinfo =
            g_desktop_app_info_new(desktopId.toLatin1());

    bool success = true;
    if ( ! appinfo)
    {
        success = createLocalDesktopFileFor(desktopId, displayName, domain, iconName);
    }

    return success;
}

QString UnityWebapps::generateActionEntryFor(const QString& actionName,
                                             const QString& name,
                                             const QString& showIn,
                                             const QString& exec)
{
    return QString("[Desktop Action %1]\n"
                   "Name=%2\n"
                   "OnlyShowIn=%3\n"
                   "Exec=%4\n\n")
            .arg(actionName)
            .arg(name)
            .arg(showIn)
            .arg(exec);
}

QString UnityWebapps::getUrlLaunchExec(const QString & webappName,
                                       const QString & url)
{
    return QString("webbrowser-app --webapp='%1' %2")
            .arg(webappName.toUtf8().toBase64().data())
            .arg(url);
}

QString UnityWebapps::generateActionsEntry(const QString & webappName)
{
    const size_t MAX_ACTIONS_INDEX = 9;

    QString content;
    Q_FOREACH(const QString& actionName, _actions.keys())
    {
        if (_actions[actionName].idx > MAX_ACTIONS_INDEX)
            continue;

        QStringList showIn;
        QString exec;
        if (_actions[actionName].type & STATIC_ACTION)
        {
            exec = getUrlLaunchExec(webappName, _actions[actionName].url);
            showIn.append("Unity");
        }
        if (_actions[actionName].type & LAUNCHER_ACTION)
        {
            showIn.append("Unity");
        }
        if (_actions[actionName].type & INDICATOR_ACTION)
        {
            showIn.append("Messaging Menu");
        }

        content.append (generateActionEntryFor (QString("S%1").arg(_actions[actionName].idx),
                                                actionName,
                                                showIn.join(";"),
                                                exec));
    }
    return content;
}

QMap<size_t, UnityWebapps::ActionInfos>
UnityWebapps::collectActionIndexes()
{
    QMap<size_t, UnityWebapps::ActionInfos>
            indexes;
    Q_FOREACH(const QString& name, _actions.keys())
    {
        indexes[_actions[name].idx] = _actions[name];
    }
    return indexes;
}

int
UnityWebapps::findNextAvailableActionIndex(const QMap<size_t, UnityWebapps::ActionInfos> & indexes)
{
    int idx = 1;
    while (1) {
        if ( ! indexes.contains(idx))
            break;
        idx++;
    }
    return idx;
}

QString UnityWebapps::addAction (const QString& name,
                              UnityWebapps::ActionTypeFlags type,
                              const QString& url)
{
    if (_actions.contains(name))
    {
        if ((_actions[name].type & type) && (0 == _actions[name].url.compare(url)))
            return QString();

        _actions[name].type |= type;
        _actions[name].url = url;
    }
    else
    {
        _actions[name] = ActionInfos(name,
                                     type,
                                     findNextAvailableActionIndex(collectActionIndexes()),
                                     url);
    }

    updateDesktopFileContent();

    return QString("S%1").arg(_actions[name].idx);
}

QString UnityWebapps::addLauncherAction(const QString& name)
{
    return addAction(name, LAUNCHER_ACTION);
}

QString UnityWebapps::addIndicatorAction (const QString& name)
{
    return addAction(name, INDICATOR_ACTION);
}

QString UnityWebapps::addStaticAction (const QString& name, const QString& url)
{
    return addAction(name, STATIC_ACTION, url);
}

void UnityWebapps::removeLauncherAction(const QString& name)
{
    if (_actions.contains(name) && (_actions[name].type & LAUNCHER_ACTION))
    {
        _actions[name].type &= ~LAUNCHER_ACTION;

        updateDesktopFileContent();
    }
}

void UnityWebapps::removeLauncherActions()
{
    bool found = false;
    Q_FOREACH(const QString & actionName, _actions.keys())
    {
        if (_actions[actionName].type & LAUNCHER_ACTION)
        {
            _actions[actionName].type &= ~LAUNCHER_ACTION;
            found = true;
        }
    }
    if (found)
        updateDesktopFileContent();
}

QString UnityWebapps::getDesktopFileContent()
{
    if ( ! appInfos())
        return QString();

    QString webappName = appInfos()->displayName();
    QString iconName = appInfos()->iconName();
    QString desktopId = appInfos()->desktopId();

    QString appId = QString(desktopId).replace(".desktop", "");
    QString content = QString("[Desktop Entry]\n"
                               "Name=%1\n"
                               "Type=Application\n"
                               "Icon=%2\n"
                               "Actions=S1;S2;S3;S4;S5;S6;S7;S8;S9;S10;\n"
                               "Exec=webbrowser-app --app-id='%4' --webapp='%5' %u\n\n"
                               "%6")
            .arg(webappName)
            .arg(UnityWebappsQML::getIconPathFor(iconName))
            .arg(appId)
            .arg(QString(webappName.toUtf8().toBase64().data()))
            .arg( ! webappName.isEmpty()
                 ? generateActionsEntry(webappName)
                 : QString(""));
    return content;
}

void UnityWebapps::updateDesktopFileContent ()
{
    if ( ! handleDesktopFileUpdates())
        return;

    if ( ! appInfos() || appInfos()->desktopId().isEmpty())
    {
        qDebug() << "Cannot update local desktop file content";
        return;
    }

    QString desktopFilePath =
            QDir::cleanPath (getLocalDesktopFilepath (appInfos()->desktopId()));
    QFile f(desktopFilePath);
    if ( ! f.open(QIODevice::WriteOnly))
    {
        qWarning() << "Could not create/access desktop file: " << desktopFilePath;
        return;
    }

    f.write(getDesktopFileContent().toUtf8());
    f.close();
}

void UnityWebapps::ensureLocalApplicationsPathExists()
{
    QString shareDirPath (getUserSharePath());
    if (shareDirPath.isEmpty())
    {
        qDebug() << "Error while trying to get current session home directory";
        return;
    }

    shareDirPath += QDir::separator() + QString("applications/");

    // Create the directory if it doesn't exist
    QDir shareDir(shareDirPath);
    if (!shareDir.exists())
    {
        shareDir.mkpath(".");
    }
}

bool UnityWebapps::createLocalDesktopFileFor (const QString& desktopId,
                                              const QString& webappName,
                                              const QString& domain,
                                              const QString& iconName)
{
    Q_UNUSED(domain);
    Q_UNUSED(webappName);
    Q_UNUSED(iconName);

    bool success = false;

    ensureLocalApplicationsPathExists();

    QString desktopFilePath = QDir::cleanPath(getLocalDesktopFilepath(desktopId));
    QFile f(desktopFilePath);
    if ( ! f.open(QIODevice::WriteOnly))
    {
        qCritical() << "Could not create desktop file: " << desktopFilePath;
        return success;
    }
    f.write(getDesktopFileContent().toUtf8());
    f.close();

    success = true;

    return success;
}


// QMLParserStatus
void UnityWebapps::classBegin()
{}

void UnityWebapps::componentComplete()
{}

