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

#ifndef ABSTRACT_ITEM_MODELADAPTOR_H
#define ABSTRACT_ITEM_MODELADAPTOR_H

#include <QObject>
#include <QStringList>
#include <QAbstractItemModel>


class AbstractItemModelAdaptorPrivate;
class AbstractItemModelAdaptor : public QObject
{
    Q_OBJECT

    Q_PROPERTY(QObject * itemModel READ itemModel \
               WRITE setItemModel NOTIFY itemModelChanged)

public:

    explicit AbstractItemModelAdaptor(QObject *parent = 0);
    ~AbstractItemModelAdaptor();

    Q_INVOKABLE QVariant itemAt(int index, const QString & role);
    Q_INVOKABLE QStringList roles();
    Q_INVOKABLE int rowCount();

    QObject * itemModel();
    void setItemModel(QObject *);


Q_SIGNALS:

    void itemModelChanged();


public Q_SLOTS:


private:

    int roleIndexFromName(const QString & name);

    AbstractItemModelAdaptorPrivate *d_ptr;
    Q_DECLARE_PRIVATE(AbstractItemModelAdaptor)
};

#endif // ABSTRACTITEMMODELADAPTOR_H
