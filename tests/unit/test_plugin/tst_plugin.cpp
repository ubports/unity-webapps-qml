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

#include "tst_plugin.h"

#include <QDebug>
#include <QQmlComponent>
#include <QQmlContext>
#include <QQmlEngine>
#include <QSignalSpy>
#include <QJsonDocument>
#include <QVariantMap>

#include "plugin/unity-webapps-api.h"
#include "plugin/abstract-item-model-adaptor.h"


const QString webappName = "MyWebapp";
const QString url = "http://MyWebapp.com";

QVariantMap getParams()
{
    QVariantMap params;
    params["domain"] = QVariant("MyWebapp.com");
    params["name"] = QVariant("MyWebapp");
    params["iconUrl"] = QVariant("icon://MyWebappcom");
    return params;
}

PluginTest::PluginTest()
    :QObject(0)
{
}

void PluginTest::initTestCase()
{}

void PluginTest::testLoadPlugin()
{
#if 0
    QQmlEngine engine;
    QQmlComponent component(&engine);
    component.setData("import QtQuick 2.0\nimport Ubuntu.UnityWebApps 0.1\n"
                      "Item { }",
                      QUrl());
    QObject *object = component.create();
    QVERIFY(object != 0);
    delete object;
#endif
}

void PluginTest::testInit()
{
#if 0
    UnityWebapps * p = new UnityWebapps();

    p->setHandleDesktopFileUpdates(false);
    p->init(webappName, url, getParams());

    QVERIFY( ! p->getDesktopFileContent().isEmpty());
#endif
}


#include <QAbstractListModel>
class TestAbstractListModel: public QAbstractListModel
{
    Q_OBJECT

    Q_ENUMS(Roles)

public:
    TestAbstractListModel(QObject * parent
                          , const QStringList & data)
        : QAbstractListModel(parent)
        , _data(data)
    {}

    enum Roles
    {
        FirstRole = Qt::DisplayRole + 1,
        SecondRole,
        ThirdRole,
        FourthRole,
    };

    QHash<int, QByteArray>	roleNames() const Q_DECL_OVERRIDE
    {
        QHash<int, QByteArray> roles;
        roles[FirstRole] = QString("FirstRole").toLocal8Bit();
        roles[SecondRole] = QString("SecondRole").toLocal8Bit();
        roles[ThirdRole] = QString("ThirdRole").toLocal8Bit();
        roles[FourthRole] = QString("FourthRole").toLocal8Bit();
        return roles;
    }

    int rowCount(const QModelIndex &parent = QModelIndex()) const Q_DECL_OVERRIDE
    {
        Q_UNUSED(parent);
        return _data.count();
    }

    QVariant data(const QModelIndex &index,
                  int role = Qt::DisplayRole) const Q_DECL_OVERRIDE
    {
        int idx = index.row();
        if (idx >= rowCount())
            return QVariant();
        QHash<int, QByteArray> namePerRow = roleNames();
        return QVariant(QString("%1-%2")
                        .arg(QString(namePerRow[role]))
                        .arg(_data.at(idx)));
    }

private:

    QStringList _data;
};

void PluginTest::testAbstractItemModelAdaptor()
{
    QStringList data;

    data.append(QLatin1String("First"));
    data.append(QLatin1String("Second"));
    data.append(QLatin1String("Third"));
    data.append(QLatin1String("Fourth"));

    TestAbstractListModel * model =
            new TestAbstractListModel(0, data);
    AbstractItemModelAdaptor * adaptor =
            new AbstractItemModelAdaptor();

    adaptor->setItemModel(model);

    QStringList roles = adaptor->roles();
    QVERIFY(roles.count() == 4);

    for (int i = 0; i < model->rowCount(); ++i)
    {
        for (int roleIdx = 0; roleIdx < roles.count(); ++roleIdx)
        {
            QString role = roles.at(roleIdx);
            QVariant item =
                    adaptor->itemAt(i, role);
            QString expected =
                    QString("%1-%2")
                    .arg(role, data.at(i));

            QVERIFY(item.isValid());
            QVERIFY(item.canConvert(QMetaType::QString));
            QVERIFY(0 == item.toString().compare(expected));
        }
    }

    delete adaptor;
    delete model;
}

#include "tst_plugin.moc"

