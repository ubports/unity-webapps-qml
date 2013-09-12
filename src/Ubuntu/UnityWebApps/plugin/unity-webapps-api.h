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
#include <QMap>
#include <QQmlParserStatus>

#include "callback.h"


class UnityWebappsAppInfos;
class UnityWebappsAppModel;

class UnityWebapps : public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)
    Q_PROPERTY(UnityWebappsAppModel* model READ model WRITE setAppModel)
    Q_PROPERTY(bool handleDesktopFileUpdates READ handleDesktopFileUpdates WRITE setHandleDesktopFileUpdates)
    Q_PROPERTY(UnityWebappsAppInfos* appInfos READ appInfos NOTIFY appInfosChanged)


public:
    UnityWebapps(QObject *parent = 0);
    ~UnityWebapps();

    UnityWebappsAppModel* model() const;
    void setAppModel(UnityWebappsAppModel *);

    bool handleDesktopFileUpdates() const;
    void setHandleDesktopFileUpdates (bool);

    // TODO: really need it?
    void componentComplete();
    void classBegin();

    Q_INVOKABLE QString addIndicatorAction (const QString& name);
    Q_INVOKABLE QString addStaticAction (const QString& name, const QString& url);
    Q_INVOKABLE QString addLauncherAction (const QString& name);
    Q_INVOKABLE void removeLauncherAction (const QString& name);
    Q_INVOKABLE void removeLauncherActions ();


public Q_SLOTS:

    // API functions
    void init(const QString& name, const QString& url, bool isLocal, const QVariant& args);

    // class functions
    UnityWebappsAppInfos *appInfos();

    QString getDesktopFileContent();


Q_SIGNALS:

    void initCompleted(bool success);
    void appInfosChanged(UnityWebappsAppInfos *appInfos);


private:

    enum ActionTypeFlags
    {
        STATIC_ACTION = 0x1,
        INDICATOR_ACTION = 0x2,
        LAUNCHER_ACTION = 0x4,
    };

    QStringList collectActionNames() const;
    QString getUrlLaunchExec (const QString & webappName,
                              const QString & url);

    QString addAction (const QString& name,
                    ActionTypeFlags type,
                    const QString & url = QString());
    void removeAction (const QString& name);

    void ensureLocalApplicationsPathExists();

    QString getLocalDesktopFilepath(const QString & desktopId);

    bool ensureDesktopExists(const QString& webappName,
                             const QString& domain,
                             const QString& iconName);

    void updateDesktopFileContent();

    QString generateActionEntryFor(const QString& actionName,
                                   const QString & webappName,
                                   const QString& showIn,
                                   const QString& exec);
    QString generateActionsEntry(const QString & webappName);

    bool isValidInitForWebappAndModel (const QString & name,
                                       const QString& domain,
                                       const QString & displayName);

    bool initInternal(const QString& name,
              const QString& domain,
              const QString& displayName,
              const QString& iconUrl,
              const QString& url);
    void cleanup();

    bool isConfined() const;

    void buildAppInfos(const QString & name,
                       const QString & displayName,
                       const QString & domain,
                       const QString & desktopId,
                       const QString & iconName);

    bool createLocalDesktopFileFor (const QString& desktopId,
                                    const QString& webappName,
                                    const QString& domain,
                                    const QString& iconName);

    static QString getUserSharePath();


private:

    struct ActionInfos
    {
        ActionInfos() {}
        ActionInfos(const QString & n, size_t t, size_t i, const QString & u = QString())
            : name(n), type(t), url(u), idx(i)
        {}
        QString name;
        size_t type;
        QString url;
        size_t idx;
    };

    QMap<size_t, ActionInfos> collectActionIndexes();
    int findNextAvailableActionIndex(const QMap<size_t, ActionInfos> & indexes);

    QMap<QString, ActionInfos>  _actions;

    UnityWebappsAppModel *_model;
    UnityWebappsAppInfos *_appInfos;
    bool _handleDesktopFileUpdates;
};

#endif // __UNITY_WEBAPPS_API_H__

