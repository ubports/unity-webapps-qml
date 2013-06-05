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


namespace priv {

class DefaultEnvironment : public UnityWebappsAppModel::Environment
{
public:
    virtual QString getWebAppsSearchPath () const
    {
        return QLatin1String("/usr/share/unity-webapps/userscripts");
    }
};

} // namespace {


// TODO add local folders
QString UnityWebappsAppModel::_commonScriptsDirName = "common";
QString UnityWebappsAppModel::_webappDirPrefix = "unity-webapps-";

UnityWebappsAppModel::UnityWebappsAppModel(
            QSharedPointer<Environment> environment,
            QObject* parent)
    : QAbstractListModel(parent)
    , _environment(environment)
{
    if (_environment.isNull())
        _environment.reset(new priv::DefaultEnvironment());

    load();
}

UnityWebappsAppModel::~UnityWebappsAppModel()
{}

QHash<int, QByteArray>
UnityWebappsAppModel::roleNames() const
{
    static QHash<int, QByteArray> roles;
    if (roles.isEmpty())
      {
        roles[Name] = "name";
        roles[Domain] = "domain";
        roles[Urls] = "urls";
        roles[Content] = "content";
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

void UnityWebappsAppModel::load()
{
    QString installationSearchPath =
            _environment->getWebAppsSearchPath();

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

        QString content =
                loadUserScript (QDir(candidateWebappFolder.absoluteFilePath()),
                                manifest.value());

        addWebApp (candidateWebappFolder.absoluteFilePath(),
                   manifest.value(),
                   content);
    }
}

QString
UnityWebappsAppModel::loadUserScript(const QDir& path,
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

    QString installationSearchPath = _environment->getWebAppsSearchPath();

    const QString COMMON_BASE_PATH =
            installationSearchPath + QDir::separator() + _commonScriptsDirName;
    READ_USER_SCRIPT(requires,COMMON_BASE_PATH);
    READ_USER_SCRIPT(scripts,path.absolutePath());

    return script;
}

void UnityWebappsAppModel::addWebApp(const QString& location,
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

    webapp.location = location;
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

QVariant UnityWebappsAppModel::data(const QModelIndex& index, int role) const
{
    if (!index.isValid())
    {
        qDebug() << "UnityWebappsAppModel::data: Invalid index element";
        return QVariant();
    }

    int row = index.row();
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

    case Urls:
        return webapp.data.manifest.includes;

    case Content:
        return webapp.data.content;
    }

    return QVariant();
}


