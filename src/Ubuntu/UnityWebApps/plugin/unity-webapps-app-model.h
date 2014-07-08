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
    Q_PROPERTY(QString searchPath READ searchPath WRITE setSearchPath NOTIFY searchPathChanged)
    Q_PROPERTY(bool doSearchHomeFolder READ doSearchHomeFolder WRITE setDoSearchHomeFolder)

    Q_ENUMS(WebAppsRoles)


public:

    UnityWebappsAppModel(QObject* parent = 0);
    ~UnityWebappsAppModel();

    enum WebAppsRoles {
        Name = Qt::UserRole + 1,
        Domain,
        Urls,
        Homepage,
        Scripts,
        ScriptsContent,
        Chrome,
        UserAgentOverride,
        Path
    };

    // QAbstractListModel implementation
    QHash<int, QByteArray> roleNames() const;
    int rowCount(const QModelIndex& parent = QModelIndex ()) const;
    QVariant data(const QModelIndex& index, int role) const;


    // Properties
    QString searchPath() const;
    void setSearchPath (const QString& path);

    bool doSearchHomeFolder() const;
    void setDoSearchHomeFolder (bool searchLocalHome);

    // Exposed to QML
    /*!
     * \brief exists
     * \param webappName
     * \return
     */
    Q_INVOKABLE bool exists(const QString & webappName) const;


    /*!
     * \brief getWebappIndex
     * \param webappName
     * \return
     */
    Q_INVOKABLE int getWebappIndex(const QString & webappName) const;


    /*!
     * \brief
     */
    Q_INVOKABLE QString getDomainFor(const QString & webappName) const;


    /*!
     * \brief
     */
    Q_INVOKABLE QStringList getChromeOptionsFor(const QString & webappName) const;


    /*!
     * \brief
     */
    Q_INVOKABLE QString userAgentOverrideFor(const QString & webappName) const;

    /*!
     * \brief
     */
    Q_INVOKABLE QString path(const QString & webappName) const;


    /*!
     * \brief
     */
    Q_INVOKABLE bool doesUrlMatchesWebapp(const QString & webappName, const QString & url) const;


    /*!
     * \brief
     */
    Q_INVOKABLE QString getDisplayNameFor(const QString & webappName) const;


    /*!
     * \brief data
     * \return
     */
    Q_INVOKABLE QVariant data(int row, int role) const;


Q_SIGNALS:

    void searchPathChanged(const QString & path);
    void modelContentChanged();


private Q_SLOTS:

    /*!
     * \brief Starts loading all the WebApps
     */
    void load();


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
    getWebappFiles (const QFileInfo& webAppInstallLocatio);

    /*!
     * \brief UnityWebappsAppModel::getCandidateInstalledWebappsFolders
     * \return
     */
    QFileInfoList
    getCandidateInstalledWebappsFolders (const QString& installationSearchPath);

    static QString
    getDefaultWebappsInstallationSearchPath();

    static QString
    doCorrectSearchPath(const QString & p);

    /*!
     * \brief Cleanup the object and already loaded WebApps
     */
    void cleanup();

    /*!
     * \brief addWebApp
     * \param userscriptLocation
     * \param requiresLocation
     * \param manifest
     * \param content
     */
    void addWebApp(const QString& userscriptLocation,
                   const QString& requiresLocation,
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
        QString userscriptLocation;
        QString requiresLocation;

        struct
        {
            ManifestFileInfo manifest;
            QString content;
        } data;
    };
    QList<InstalledWebApp> _webapps;

    QString _searchPath;
    bool _doSearchLocalHome;

    static QString _commonScriptsDirName;
    static QString _webappDirPrefix;
};


#endif // __UNITY_WEBAPPS_APP_MODEL_H__


