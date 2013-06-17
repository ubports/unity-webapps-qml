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

#ifndef __UNITY_WEBAPPS_MESSAGING_MENU_H__
#define __UNITY_WEBAPPS_MESSAGING_MENU_H__

#include <QObject>
#include <QQmlParserStatus>

class UnityWebappsMessagingMenuPrivate;

class UnityWebappsMessagingMenu: public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)

    Q_PROPERTY(QString name READ name WRITE setName)

public:
    UnityWebappsMessagingMenu(QObject * parent = 0);
    virtual ~UnityWebappsMessagingMenu();

    Q_INVOKABLE void showIndicator(const QString& name);
    Q_INVOKABLE void setProperty(const QString& name, const QVariant& value);
    Q_INVOKABLE void clearIndicator(const QString& name);
    Q_INVOKABLE void clearIndicators();


    /*!
     * \brief setName
     * \param name
     */
    void setName(const QString& name);

    /*!
     * \brief name
     * \return
     */
    QString name() const;

    // TODO: don't really need it?
    void classBegin();
    void componentComplete();


private:

    UnityWebappsMessagingMenuPrivate *d_ptr;
    Q_DECLARE_PRIVATE(UnityWebappsMessagingMenu)
};

#endif // __UNITY_WEBAPPS_MESSAGING_MENU_H__


