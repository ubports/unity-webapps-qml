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

#if !defined(__UNITY_WEBAPPS_APP_MODEL_H__)
#define __UNITY_WEBAPPS_APP_MODEL_H__

// Qt
#include <QHash>
#include <QtCore/QFileInfo>
#include <QtCore/QAbstractListModel>
#include <QtCore/QFileInfoList>
#include <QSharedPointer>

#include "unity-webapps-app-manifest-parser.h"


/*!
 * \brief Model for the currently installed WebApps
 * Each installed webapp can be pulled from this model.
 *
 * TODO: No "installation" monitor is currently being setup ...
 * TODO: make sure that we are properly initialized w/ QML (QMLParserStatus)
 */
class UnityWebappsAppModel : public QAbstractListModel
{
    Q_OBJECT

public:

    /*!
     * \brief Acts as a sink for environment specific values
     *
     */
    class Environment
    {
    public:
        virtual ~Environment() {}

        /*!
         * \brief getWebAppsSearchPath
         * \return Search location for installed WebApps
         */
        virtual QString getWebAppsSearchPath () const = 0;
    };


public:

    /*!
     * \param environment optionally set an environment from where to pull the installed WebApps
     *                    if none is specified a default one is picked that looks in the std paths
     */
    UnityWebappsAppModel(QSharedPointer<Environment> environment = QSharedPointer<Environment>(),
                         QObject* parent = 0);
    ~UnityWebappsAppModel();

    enum Roles {
        Name = Qt::UserRole + 1,
        Domain,
        Urls,
        Content
    };

    // QAbstractListModel implementation
    QHash<int, QByteArray> roleNames() const;
    int rowCount(const QModelIndex& parent = QModelIndex ()) const;
    QVariant data(const QModelIndex& index, int role) const;


private:

    /*!
     * \brief Agreggates simple set of data on a given candidate for a WebApp install
     */
    struct WebappFileInfo
    {
        WebappFileInfo ()
        {}
        WebappFileInfo(const QString& m, const QString& s)
            : manifestFilename(m), userscript(s)
        {}
        QString manifestFilename;
        QString userscript;
    };
    /*!
     * \brief Option type for WebappFileInfo
     */
    typedef Fallible<WebappFileInfo> WebappFileInfoOption;


    /*!
     * \brief getWebappFiles
     * \param webappDir
     * \return
     */
    WebappFileInfoOption
    getWebappFiles (QFileInfo webappDir);

    /*!
     * \brief UnityWebappsAppModel::getCandidateInstalledWebappsFolders
     * \return
     */
    static QFileInfoList
    getCandidateInstalledWebappsFolders (const QString& installationSearchPath);

    /*!
     * \brief Starts loading all the WebApps
     */
    void load();

    /*!
     * \brief addWebApp
     * \param location
     * \param manifest
     * \param manifest
     */
    void addWebApp(const QString& location,
                   const ManifestFileInfo& manifest,
                   const QString& content);

    /*!
     * \brief isValidInstall
     * \param searchpath
     * \return
     */
    bool isValidInstall(const QString& searchpath);

    /*!
     * \brief loadUserScript
     * \param path
     * \param manifest
     * \return
     */
    QString loadUserScript(const QDir& path,
                           const ManifestFileInfo& manifest);

 private:

    struct InstalledWebApp
    {
        QString location;

        struct
        {
            ManifestFileInfo manifest;
            QString content;
        } data;
    };
    QList<InstalledWebApp> _webapps;

    QSharedPointer<Environment> _environment;

    static QString _commonScriptsDirName;
    static QString _webappDirPrefix;
};


#endif // __UNITY_WEBAPPS_APP_MODEL_H__


