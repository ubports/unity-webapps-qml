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

  The \l searchPath property can be use to alter the path where the model searches
  for installed webapps. The default search path is set to /usr/share/unity-webapps.
  The \l searchPath property should only be set to valid (existing and readable)
  paths, all other "values" are ignored.
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
    , _doSearchLocalHome(false)
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

bool UnityWebappsAppModel::doSearchHomeFolder() const
{
    return _doSearchLocalHome;
}

void UnityWebappsAppModel::setDoSearchHomeFolder (bool searchLocalHome)
{
    bool reload = (searchLocalHome != _doSearchLocalHome);

    _doSearchLocalHome = searchLocalHome;

    if (reload)
        load();
}

void UnityWebappsAppModel::setSearchPath(const QString& path)
{
    if (_searchPath.compare(path, Qt::CaseInsensitive) == 0)
        return;

    if (path.isEmpty())
    {
        qDebug() << "Empty path in webapps model search path update request";
        return;
    }

    QDir searchDir(path);
    searchDir.makeAbsolute();
    if (! searchDir.exists() || ! searchDir.isReadable())
    {
        qDebug() << "Invalid path in webapps "
                    "model search path update request: " << path;
        return;
    }

    _searchPath = doCorrectSearchPath(searchDir.path());

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
        roles[Chrome] = "chrome";
        roles[UserAgentOverride] = "useragent";
        roles[Path] = "path";
      }
    return roles;
}

UnityWebappsAppModel::WebappFileInfoOption
UnityWebappsAppModel::getWebappFiles(const QFileInfo& webAppInstallLocation)
{
    if (!webAppInstallLocation.isDir()) {
        qDebug() << "Invalid webapps path found (not a proper folder): "
                 << webAppInstallLocation.absoluteFilePath();
        return WebappFileInfoOption();
    }

    QDir installationDir = QDir(webAppInstallLocation.absoluteFilePath());

    // Search for manifest files & userscript

    // The order here is important, the preferred filename is manifest.json
    // which is still used in the desktop for regulat webapps, but in order
    // to avoid name clashes w/ the click package manifest.json, the
    // webapp-properties.json filename is searches first as a valid name
    // and the regular manifest.json file used as a standard fallback.
    const QString INLINE_WEBAPP_MANIFEST_FILENAME = "webapp-properties.json";
    QStringList manifestFileNames =
            QStringList() << INLINE_WEBAPP_MANIFEST_FILENAME
                          << QString("manifest.json");

    WebappFileInfoOption
            webappCandidateInfo;
    Q_FOREACH(QString manifestFileName, manifestFileNames)
    {
        QFileInfo manifestFileInfo =
                installationDir.absolutePath() + QDir::separator() + manifestFileName;
        if ( ! manifestFileInfo.isFile()) {
            qDebug() << "Skipping" << manifestFileName << "as a webapp definition search: "
                     << manifestFileInfo.absoluteFilePath();
            continue;
        }

        QString userScriptFilename;
        QFileInfoList script =
                installationDir.entryInfoList(QStringList("*.user.js"), QDir::Files);
        if (script.count() >= 1) {
            // Arbitrarily considering the "first" one
            userScriptFilename = script[0].absoluteFilePath();
        }

        webappCandidateInfo =
            WebappFileInfoOption (
                WebappFileInfo (manifestFileInfo.absoluteFilePath(),
                                userScriptFilename,
                                manifestFileName == INLINE_WEBAPP_MANIFEST_FILENAME
                                    ? WebappFileInfo::IS_LOCAL_INLINE_WEBAPP
                                    : WebappFileInfo::IS_NON_LOCAL_INLINE_WEBAPP));

        break;
    }

    return webappCandidateInfo;
}

QFileInfoList
UnityWebappsAppModel::getCandidateInstalledWebappsFolders (const QString& installationSearchPath)
{
    // If the search path was overriden (not the default system one), we add the local
    // path to the list of searched paths. The idea is to remove some of the potentially
    // overloaded cruft (notably on UbuntuTouch or for simple installs/tests) the needed
    // webapp file setup.
    // We still do some possibly unecessary work of looking up in any unity-webapp-* subdir
    // but in the general case that shouldn't be too much of a hassle.

    QDir webappsDir(installationSearchPath);
    QFileInfoList
        candidateWebappsFolders = webappsDir.entryInfoList (QStringList(_webappDirPrefix + "*")
                                                            , QDir::Dirs);
    if (installationSearchPath != getDefaultWebappsInstallationSearchPath())
    {
        QFileInfo localSearchPath(installationSearchPath);
        if (localSearchPath.isDir())
        {
            candidateWebappsFolders.append(localSearchPath);
        }
    }
    return candidateWebappsFolders;
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
            continue;
        }

        WebappFileInfoOption webappInfos =
                getWebappFiles (candidateWebappFolder);
        if (!webappInfos.isvalid())
        {
            continue;
        }

        UnityWebappsAppManifestParser
                parser;

        ManifestFileInfoOption manifest =
                parser.parse (QFileInfo (webappInfos.value().manifestFilename));
        if (!manifest.isvalid())
        {
            qDebug() << "Invalid webapps manifest found in: "
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
                   content,
                   webappInfos.value().isLocalInlineWebapp);
    }

    Q_EMIT modelContentChanged();
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

QString
UnityWebappsAppModel::path(const QString & webappName) const {
    if (!exists(webappName))
        return QString();

    int idx = getWebappIndex(webappName);
    if (Q_UNLIKELY(idx == -1))
    {
        qDebug() << "Invalid index for a supposedly existing webapp: " << webappName;
        return QString();
    }

    return data(idx, Path).toString();
}

QString
UnityWebappsAppModel::userAgentOverrideFor(const QString & webappName) const
{
    if (!exists(webappName))
        return QString();

    int idx = getWebappIndex(webappName);
    if (Q_UNLIKELY(idx == -1))
    {
        qDebug() << "Invalid index for a supposedly existing webapp: " << webappName;
        return QString();
    }

    return data(idx, UserAgentOverride).toString();
}

QStringList
UnityWebappsAppModel::getChromeOptionsFor(const QString & webappName) const
{
    if (!exists(webappName))
        return QStringList();

    int idx = getWebappIndex(webappName);
    if (Q_UNLIKELY(idx == -1))
    {
        qDebug() << "Invalid index for a supposedly existing webapp: " << webappName;
        return QStringList();
    }

    return data(idx, Chrome).toStringList();
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

bool UnityWebappsAppModel::doesUrlMatchesWebapp(const QString & webappName, const QString & url) const
{
    if (!exists(webappName))
        return false;

    int idx = getWebappIndex(webappName);
    if (Q_UNLIKELY(idx == -1))
    {
        qDebug() << "Invalid index for a supposedly existing webapp: " << webappName;
        return false;
    }

    // TODO: very very inefficient
    QStringList urls = data(idx, Urls).toStringList();

    bool matches = false;
    Q_FOREACH(const QString& urlCandidate, urls)
    {
        QRegExp pattern(urlCandidate, Qt::CaseInsensitive, QRegExp::Wildcard);
        if (pattern.indexIn(url) != -1)
        {
            matches = true;
            break;
        }
    }

    return matches;
}

QString UnityWebappsAppModel::getDisplayNameFor(const QString & webappName) const
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

    return data(idx, Name).toString();
}


void UnityWebappsAppModel::addWebApp(const QString& userscriptLocation,
                                     const QString& requiresLocation,
                                     const ManifestFileInfo& manifest,
                                     const QString& content,
                                     bool isLocalInlineWebapp)
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
    webapp.isLocalInlineWebapp = isLocalInlineWebapp;
    webapp.data.manifest = manifest;
    webapp.data.content = content;

    _webapps.append(webapp);
}

bool UnityWebappsAppModel::isValidInstall(const QString& searchPath)
{
    return QFileInfo(searchPath).isDir()
           && QDir(searchPath).exists();
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

    case Chrome:
        return webapp.data.manifest.chromeOptions;

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

    case UserAgentOverride:
        return webapp.data.manifest.userAgentOverride;

    case Path:
        return webapp.userscriptLocation;
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


bool UnityWebappsAppModel::providesSingleInlineWebapp() const
{
    return !_webapps.empty() && _webapps.count() == 1 && _webapps.at(0).isLocalInlineWebapp;
}

QString UnityWebappsAppModel::getSingleInlineWebappName() const
{
    if (!providesSingleInlineWebapp())
        return QString();
    return _webapps.at(0).data.manifest.name;
}
