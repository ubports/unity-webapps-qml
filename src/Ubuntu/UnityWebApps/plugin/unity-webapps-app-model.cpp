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

#include <QDir>
#include <QDebug>
#include <QtCore/QTextStream>

#include "unity-webapps-app-model.h"
#include "unity-webapps-app-manifest-parser.h"


/*!
  \qmltype UnityWebappsAppModel
  \inqmlmodule Ubuntu.UnityWebApps 0.1
  \ingroup ubuntu
  \brief Provides a model for the list of the currently installed WebApps.

  Besides providing information about the currently installed webapps, it can
  typically be used in conjunction with the UnityWebApps QML component that already
  takes care of making sure that the Unity WebApps API is available to a given
  QML WebView. What the UnityWebappsAppModel can provide is a way to ask the
  WebApp QML component to inject the userscripts corresponding to a given webapp
  along with the API itself.

  \qml
    UnityWebApps {
        id: webapps
        name: webappName
        bindee: webview
        model: UnityWebappsAppModel {}
    }
  \endqml

  If the WebApp whose name is specified as part of the "name" property is found in the
  specified model, its scripts (along with their dependancies) will be injected.
  Otherwise only the API will be made available.
*/


// TODO add local folders
QString UnityWebappsAppModel::_commonScriptsDirName = "common";
QString UnityWebappsAppModel::_webappDirPrefix = "unity-webapps-";

QString
UnityWebappsAppModel::doCorrectSearchPath(const QString & p)
{
    QString fixedPath = p;
    if (QDir::isRelativePath(fixedPath))
    {
        QDir d(fixedPath);
        d.makeAbsolute();
        fixedPath = d.absolutePath();
    }
    return fixedPath;
}

QString
UnityWebappsAppModel::getDefaultWebappsInstallationSearchPath()
{
    return "/usr/share/unity-webapps/userscripts";
}

UnityWebappsAppModel::UnityWebappsAppModel(QObject* parent)
    : QAbstractListModel(parent)
    , _searchPath(getDefaultWebappsInstallationSearchPath())
{
    load();

    QObject::connect(this, SIGNAL(searchPathChanged(const QString)), SLOT(load()));
}

UnityWebappsAppModel::~UnityWebappsAppModel()
{}

QString UnityWebappsAppModel::searchPath() const
{
    return _searchPath;
}

void UnityWebappsAppModel::setSearchPath(const QString& path)
{
    _searchPath = doCorrectSearchPath(path);

    qDebug() << "Using '"
             << _searchPath
             << "' as the default search path for installed webapps";

    Q_EMIT searchPathChanged(_searchPath);
}

QHash<int, QByteArray>
UnityWebappsAppModel::roleNames() const
{
    static QHash<int, QByteArray> roles;
    if (roles.isEmpty())
      {
        roles[Name] = "name";
        roles[Domain] = "domain";
        roles[Homepage] = "homepage";
        roles[Urls] = "urls";
        roles[ScriptsContent] = "content";
        roles[Scripts] = "scripts";
      }
    return roles;
}

UnityWebappsAppModel::WebappFileInfoOption
UnityWebappsAppModel::getWebappFiles(QFileInfo webAppInstallLocation)
{
    if (!webAppInstallLocation.isDir()) {
        qDebug() << "Invalid webapps path found (not a proper folder): "
                 << webAppInstallLocation.absoluteFilePath();
        return WebappFileInfoOption();
    }

    QDir installationDir = QDir(webAppInstallLocation.absoluteFilePath());

    //TODO search only for manifest.json
    // Search for manifest & userscript
    QFileInfoList manifest =
            installationDir.entryInfoList(QStringList("*.json"), QDir::Files);
    if (manifest.count() != 1) {
        qDebug() << "Folder not being considered for webapp (no manifest file found): "
                 << installationDir.absolutePath();
        return WebappFileInfoOption();
    }

    QFileInfoList script =
            installationDir.entryInfoList(QStringList("*.user.js"), QDir::Files);
    if (script.count() != 1) {
        qDebug() << "Folder not being considered for webapp (no userscript found): "
                 << installationDir.absolutePath();
        return WebappFileInfoOption();
    }

    return WebappFileInfoOption (WebappFileInfo (manifest[0].absoluteFilePath(), script[0].absoluteFilePath()));
}

QFileInfoList
UnityWebappsAppModel::getCandidateInstalledWebappsFolders (const QString& installationSearchPath)
{
    QDir webappsDir(installationSearchPath);
    return webappsDir.entryInfoList (QStringList(_webappDirPrefix + "*"), QDir::Dirs);
}

void UnityWebappsAppModel::cleanup()
{
    _webapps.clear();
}

void UnityWebappsAppModel::load()
{
    cleanup();

    QString installationSearchPath = searchPath();

    if (!isValidInstall(installationSearchPath))
    {
        qDebug() << "Invalid webapps installation";
        return;
    }

    QFileInfoList folders =
            getCandidateInstalledWebappsFolders (installationSearchPath);

    Q_FOREACH(QFileInfo candidateWebappFolder, folders)
    {
        if (!candidateWebappFolder.isDir())
        {
            qDebug() << "Candidate webapp folder not a webapp: "
                     << candidateWebappFolder.absoluteFilePath();
            continue;
        }

        WebappFileInfoOption webappInfos =
                getWebappFiles (candidateWebappFolder);
        if (!webappInfos.isvalid())
        {
            qDebug() << "Invalid webapps path found: "
                     << candidateWebappFolder.absoluteFilePath();
            continue;
        }

        UnityWebappsAppManifestParser
                parser;

        ManifestFileInfoOption manifest =
                parser.parse (QFileInfo (webappInfos.value().manifestFilename));
        if (!manifest.isvalid())
        {
            qDebug() << "Invalid webapps installation found: "
                     << candidateWebappFolder.absoluteFilePath();
            continue;
        }

        // FIXME: mmmh? ondemand or async?
        QString content =
                loadUserScript (QDir(candidateWebappFolder.absoluteFilePath()),
                                manifest.value());

        const QString COMMON_BASE_PATH =
                _searchPath
                + QDir::separator()
                + _commonScriptsDirName;

        //TODO: find proper common files (if any) considering the ones
        // in local/ that could over take
        addWebApp (candidateWebappFolder.absoluteFilePath(),
                   COMMON_BASE_PATH,
                   manifest.value(),
                   content);
    }
}

QString
UnityWebappsAppModel::loadUserScript(const QDir& userscriptPath,
                                     const ManifestFileInfo& manifest)
{
    if (manifest.scripts.count() == 0)
    {
        return QString();
    }

    //TODO: use QStringBuilder
    QString script;
#define READ_USER_SCRIPT(field_name,base_path) \
    Q_FOREACH(QString filename, manifest.field_name) \
    { \
        QFile f(base_path + QDir::separator() + filename); \
        if (!f.open(QIODevice::ReadOnly | QIODevice::Text)) \
        { \
            return QString(); \
        } \
        script += f.readAll(); \
        script += "\n\n"; \
    }

    QString installationSearchPath = _searchPath;

    const QString COMMON_BASE_PATH =
            installationSearchPath + QDir::separator() + _commonScriptsDirName;
    READ_USER_SCRIPT(requires,COMMON_BASE_PATH);
    READ_USER_SCRIPT(scripts,userscriptPath.absolutePath());

    return script;
}

QString UnityWebappsAppModel::getDomainFor(const QString & webappName) const
{
    //FIXME: very inefficient

    if (!exists(webappName))
        return QString();

    int idx = getWebappIndex(webappName);
    if (Q_UNLIKELY(idx == -1))
    {
        qDebug() << "Invalid index for a supposedly existing webapp: " << webappName;
        return QString();
    }

    return data(idx, Domain).toString();
}

void UnityWebappsAppModel::addWebApp(const QString& userscriptLocation,
                                     const QString& requiresLocation,
                                     const ManifestFileInfo& manifest,
                                     const QString& content)
{
    if (manifest.name.isEmpty())
    {
        qDebug() << "Cannot add a webapp with an empty name";
        return;
    }
/*
     if (_webapps.contains(manifest))
    {
        qDebug() << "Webapp already exists: " << manifest.name;
        return;
    }
*/

    InstalledWebApp webapp;

    webapp.userscriptLocation = userscriptLocation;
    webapp.requiresLocation = requiresLocation;
    webapp.data.manifest = manifest;
    webapp.data.content = content;

    _webapps.append(webapp);
}

bool UnityWebappsAppModel::isValidInstall(const QString& searchPath)
{
    return QFileInfo(searchPath).isDir()
           && QDir(searchPath).exists()
           && QFileInfo(searchPath + QDir::separator() + _commonScriptsDirName).isDir()
           && QDir(searchPath + QDir::separator() + _commonScriptsDirName).exists();
}

int UnityWebappsAppModel::rowCount(const QModelIndex& parent) const
{
    Q_UNUSED(parent);
    return _webapps.count();
}

int UnityWebappsAppModel::getWebappIndex(const QString & webappName) const
{
    if (_webapps.empty())
        return -1;

    int idx = 0;
    for (QList<InstalledWebApp>::const_iterator it = _webapps.begin()
         ; it != _webapps.end()
         ; ++idx, ++it)
    {
        if (0 == it->data.manifest.name.toLower().compare(webappName.toLower()))
        {
            return idx;
        }
    }

    return -1;
}

bool UnityWebappsAppModel::exists(const QString & webappName) const
{
    //FIXME: efficiency
    return getWebappIndex(webappName) != -1;
}

QVariant UnityWebappsAppModel::data(int row, int role) const
{
    if ((row < 0) || (row >= _webapps.count()))
    {
        qDebug() << "UnityWebappsAppModel::data: Invalid index (out of bound)";
        return QVariant();
    }

    const InstalledWebApp& webapp =
            _webapps.at(row);

    switch (role) {
    case Name:
        return webapp.data.manifest.name;

    case Domain:
        return webapp.data.manifest.domain;

    case Homepage:
        return webapp.data.manifest.homepage;

    case Urls:
        return webapp.data.manifest.includes;

    case Scripts:
        {
            QStringList scripts;
            Q_FOREACH(QString require, webapp.data.manifest.requires)
            {
                scripts.append(webapp.requiresLocation + "/" + require);
            }
            Q_FOREACH(QString script, webapp.data.manifest.scripts)
            {
                scripts.append(webapp.userscriptLocation + "/" + script);
            }
            return scripts;
        }
    case ScriptsContent:
        return webapp.data.content;
    }

    return QVariant();
}

QVariant UnityWebappsAppModel::data(const QModelIndex& index, int role) const
{
    if ( ! index.isValid())
    {
        return QVariant();
    }

    return data(index.row(), role);
}


