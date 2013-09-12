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

#ifndef __UNITY_WEBAPPS_APP_MANIFEST_H__
#define __UNITY_WEBAPPS_APP_MANIFEST_H__

#include <QString>
#include <QStringList>
#include <QFileInfo>

#include "unity-webapps-common-priv.h"

/*!
 * \brief Data view of a given WebApp manifest
 *
 * Describes a given WebApp and its execution environment.
 */
struct ManifestFileInfo
{
    // Name of the WebApp
    QString name;
    // Domain associated with the WebApp (TLD)
    QString domain;
    // Homepage that should be used when the webapp is being launched
    QString homepage;
    // List of urls for which the WebApp applies (wildcard are allowed)
    QStringList includes;
    // List of javascript files that correspond to script names for the WebApp
    QStringList scripts;
    // List of javascript files required by the WebApp (but not included)
    QStringList requires;
    // The currently selected chrome option for this WebApp
    QStringList chromeOptions;
};

/*!
 * \brief Option type for ManifestFileInfo
 */
typedef Fallible<ManifestFileInfo> ManifestFileInfoOption;



/*!
 * \brief The UnityWebappsAppManifestParser class
 */
class UnityWebappsAppManifestParser : public QObject
{
public:
    Q_OBJECT


public:
    UnityWebappsAppManifestParser(QObject *parent = 0);
    virtual ~UnityWebappsAppManifestParser();

    /*!
     * \brief parse
     * \param manifest
     * \return
     */
    virtual ManifestFileInfoOption parse (QFileInfo manifest);


private:

    /*!
     * \brief parseArray
     * \param parent
     * \param name
     * \return
     */
    QStringList parseArray(const QJsonObject& parent,
                           const QString& name);

    QStringList
    parseChromeOptions(const QString& options);

    /*!
     * \brief parseContent
     * \param content
     * \param infos
     * \return
     */
    bool parseContent(const QString& content,
                      ManifestFileInfo * infos);
};

#endif // __UNITY_WEBAPPS_APP_MANIFEST_H__

