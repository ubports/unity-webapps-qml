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

#include <QDebug>

#include "abstract-item-model-adaptor.h"


class AbstractItemModelAdaptorPrivate: public QObject
{
    Q_OBJECT

public:
    AbstractItemModelAdaptorPrivate(QObject * parent)
        : QObject(parent),
          _model(NULL)
    {}

    QAbstractItemModel * _model;
};



AbstractItemModelAdaptor::AbstractItemModelAdaptor(QObject *parent) :
    QObject(parent),
    d_ptr(new AbstractItemModelAdaptorPrivate(this))
{}

AbstractItemModelAdaptor::~AbstractItemModelAdaptor()
{
    delete d_ptr;
}

QVariant AbstractItemModelAdaptor::itemAt(int index
                                          , const QString & role)
{
    Q_D(AbstractItemModelAdaptor);

    if ( ! d->_model)
        return QVariant();

    int roleIdx = roleIndexFromName(role);
    if (roleIdx < 0)
        return QVariant();

    return (d->_model == NULL || !d->_model->hasIndex(index, 0)) ?
                QVariant()
              : d->_model->data(d->_model->index(index, 0), roleIdx);
}

int AbstractItemModelAdaptor::roleIndexFromName(const QString & name)
{
    Q_D(AbstractItemModelAdaptor);

    int index = -1;
    if ( ! d->_model)
        return index;

    QHash<int,QByteArray> roleNames = d->_model->roleNames();
    for(QHash<int,QByteArray>::iterator it = roleNames.begin();
        it != roleNames.end();
        ++it)
    {
        if (name.compare(QString(it.value())) == 0)
        {
            index = it.key();
            break;
        }
    }

    return index;
}

QStringList AbstractItemModelAdaptor::roles()
{
    Q_D(AbstractItemModelAdaptor);

    QStringList currentRoles;
    if ( ! d->_model)
        return currentRoles;

    QHash<int,QByteArray> roleNames = d->_model->roleNames();
    for(QHash<int,QByteArray>::iterator it = roleNames.begin();
        it != roleNames.end();
        ++it)
    {
        currentRoles.append(QString(it.value()));
    }

    return currentRoles;
}

QObject * AbstractItemModelAdaptor::itemModel()
{
    Q_D(AbstractItemModelAdaptor);
    return d->_model;
}

int AbstractItemModelAdaptor::rowCount()
{
    Q_D(AbstractItemModelAdaptor);

    if ( ! d->_model)
        return -1;

    return d->_model->rowCount();
}

void AbstractItemModelAdaptor::setItemModel(QObject * model)
{
    Q_D(AbstractItemModelAdaptor);

    if ( ! qobject_cast<QAbstractItemModel*>(model)) {
        qCritical() << "Cannot assign a QObject of "
                       "type not QAbstractItemModel to itemModel";
        return;
    }

    QAbstractItemModel * abstractItemModel =
            qobject_cast<QAbstractItemModel*>(model);

    if (abstractItemModel == d->_model)
        return;

    d->_model = abstractItemModel;

    Q_EMIT itemModelChanged();
}

#include "abstract-item-model-adaptor.moc"

