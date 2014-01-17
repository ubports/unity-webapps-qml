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

#if !defined(__UNITY_WEBAPPS_APP_MODEL_FILTER_PROXY_H__)
#define __UNITY_WEBAPPS_APP_MODEL_FILTER_PROXY_H__

// Qt
#include <QHash>
#include <QSharedPointer>
#include <QSortFilterProxyModel>


class UnityWebappsAppModel;

/*!
 * \brief The UnityWebappsAppModelFilterProxy class
 */
class UnityWebappsAppModelFilterProxy : public QSortFilterProxyModel
{
    Q_OBJECT

    Q_PROPERTY(QString webappName READ webappName WRITE setwebappName NOTIFY webappNameChanged)
    Q_PROPERTY(UnityWebappsAppModel * sourceModel READ sourceModel WRITE setsourceModel NOTIFY sourceModelChanged)


public:
    UnityWebappsAppModelFilterProxy(QObject *parent = 0);
    virtual ~UnityWebappsAppModelFilterProxy();

    /*!
     * \brief webappName
     * \return
     */
    QString webappName () const;

    /*!
     * \brief setwebappName
     * \param name
     */
    void setwebappName (const QString& name);

    /*!
     * \brief sourceModel
     * \return
     */
    UnityWebappsAppModel * sourceModel() const;

    /*!
     * \brief setSourceModel
     * \param model
     */
    void setsourceModel(UnityWebappsAppModel * model);


Q_SIGNALS:

    void webappNameChanged () const;
    void sourceModelChanged () const;


protected:

    // From QSortFilterProxyModel::filterAcceptsRow
    bool filterAcceptsRow(int source_row, const QModelIndex& source_parent) const;


private:

    QString _name;
};

#endif // __UNITY_WEBAPPS_APP_MODEL_FILTER_PROXY_H__
