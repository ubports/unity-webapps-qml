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

#ifndef __UNITY_WEBAPPS_API_H__
#define __UNITY_WEBAPPS_API_H__

#include <QObject>
#include <QVariant>
#include <QQmlParserStatus>


class UnityWebappsAppInfos;
class UnityWebappsAppModel;

class UnityWebapps : public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)
    Q_PROPERTY(UnityWebappsAppModel* model READ model WRITE setAppModel)
    Q_PROPERTY(UnityWebappsAppInfos* appInfos READ appInfos NOTIFY appInfosChanged)


public:
    UnityWebapps(QObject *parent = 0);
    ~UnityWebapps();


    UnityWebappsAppModel* model() const;
    void setAppModel(UnityWebappsAppModel *);

    // TODO: really need it?
    void componentComplete();
    void classBegin();


public Q_SLOTS:

    // API functions
    void init(const QString& name, const QVariant& args);

    // class functions
    UnityWebappsAppInfos *appInfos();


Q_SIGNALS:

    void initCompleted(bool success);
    void appInfosChanged(UnityWebappsAppInfos *appInfos);


private:

    bool ensureDesktopExists(const QString& webappName,
                             const QString& domain,
                             const QString& iconName);

    bool isValidInitForWebappAndModel (const QString & name,
                                       const QString& domain,
                                       const QString & displayName);

    bool initInternal(const QString& name,
              const QString& domain,
              const QString& displayName,
              const QString& iconUrl);
    void cleanup();

    void buildAppInfos(const QString & name,
                       const QString & displayName,
                       const QString & domain,
                       const QString & desktopId);

    bool createDefaultDesktopFileFor (const QString& desktopId,
                                      const QString& webappName,
                                      const QString& domain,
                                      const QString& iconName);

    static QString getUserSharePath();


private:

    UnityWebappsAppModel *_model;
    UnityWebappsAppInfos *_appInfos;
};

#endif // __UNITY_WEBAPPS_API_H__

