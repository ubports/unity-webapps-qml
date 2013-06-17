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

#include <QGuiApplication>
#include <QtQuick/QQuickItem>
#include <QtQuick/QQuickView>
#include <QDebug>
#include <QFileInfo>


int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    if (!app.arguments().count())
    {
        qDebug() << "Invalid inputs args";
        return EXIT_FAILURE;
    }

    const QString QML_FILE_ARG_HEADER = "--qml=";
    const QString ARG_HEADER = "--";
    const QString VALUE_HEADER = "=";
    QHash<QString, QString> properties;
    QString qmlfile;

    Q_FOREACH(QString argument, app.arguments())
    {
        if (argument.contains(QML_FILE_ARG_HEADER))
        {
            qmlfile = argument.right(argument.count() - QML_FILE_ARG_HEADER.count());
        }
        else
        if (argument.startsWith(ARG_HEADER)
                && argument.right(argument.count() - ARG_HEADER.count()).contains("="))
        {
            QString property = argument.right(argument.count() - ARG_HEADER.count());
            property = property.left(property.indexOf(VALUE_HEADER));

            QString value = argument.right(argument.count() - argument.indexOf(VALUE_HEADER) - 1);

            qDebug() << "Adding property: "
                     << property
                     << ", "
                     << "value: "
                     << value;

            properties.insert(property, value);
        }
        else
        {
            qDebug() << "Ignoring argument: " << argument;
        }
    }

    if (qmlfile.isEmpty())
    {
        qDebug() << "No (or empty) QML file specified";
        return EXIT_FAILURE;
    }
    if (!qmlfile.endsWith(".qml"))
    {
        qDebug() << "Invalid QML file name";
        return EXIT_FAILURE;
    }

    QFileInfo f(qmlfile);
    if (!f.exists() || !f.isFile())
    {
        qDebug() << "QML file not found or not a file: " << qmlfile;
        return EXIT_FAILURE;
    }

    QQuickView view;
    view.setSource(QUrl::fromLocalFile(qmlfile));

    QQuickItem* root = view.rootObject();

    QHash<QString, QString>::iterator it;
    for(it = properties.begin();
        properties.end() != it;
        ++it)
    {
        root->setProperty(it.key().toStdString().c_str(), QVariant(it.value()));
    }

    view.show();

    return app.exec();
}
