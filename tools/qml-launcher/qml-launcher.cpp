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
#include <QLibrary>
#include <QQmlEngine>
#include <QQmlContext>
#include <QQmlComponent>

namespace {

void loadQtTestability(const QStringList & arguments)
{
    // The testability driver is only loaded by QApplication but not by QGuiApplication.
    // However, QApplication depends on QWidget which would add some unneeded overhead => Let's load the testability driver on our own.
    if (arguments.contains(QLatin1String("-testability"))) {
        QLibrary testLib(QLatin1String("qttestability"));
        if (testLib.load()) {
            typedef void (*TasInitialize)(void);
            TasInitialize initFunction = (TasInitialize)testLib.resolve("qt_testability_init");
            if (initFunction) {
                initFunction();
            } else {
                qCritical("Library qttestability resolve failed!");
            }
        } else {
            qCritical("Library qttestability load failed!");
        }
    }
}

} // namespace


int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    if (!app.arguments().count())
    {
        qDebug() << "Invalid inputs args";
        return EXIT_FAILURE;
    }

    loadQtTestability(app.arguments());

    const QString QML_FILE_ARG_HEADER = "--qml=";
    const QString QML_FILE_IMPORT_ARG_HEADER = "--import=";
    const QString QML_APP_ID_ARG_HEADER = "--app-id=";
    const QString QML_INSPECTOR_ARG_HEADER = "--inspector=";
    const QString ARG_HEADER = "--";
    const QString VALUE_HEADER = "=";
    QHash<QString, QString> properties;
    QString qmlfile;
    QString appid;
    QString importPath;
    QString inspector;

    Q_FOREACH(QString argument, app.arguments())
    {
        if (argument.contains(QML_FILE_ARG_HEADER))
        {
            qmlfile = argument.right(argument.count() - QML_FILE_ARG_HEADER.count());
        }
        else
        if (argument.contains(QML_FILE_IMPORT_ARG_HEADER))
        {
            importPath = argument.right(argument.count() - QML_FILE_IMPORT_ARG_HEADER.count());
        }
        else
        if (argument.contains(QML_APP_ID_ARG_HEADER))
        {
            appid = argument.right(argument.count() - QML_APP_ID_ARG_HEADER.count());
        }
        else
        if (argument.contains(QML_INSPECTOR_ARG_HEADER))
        {
            inspector = argument.right(argument.count() - QML_INSPECTOR_ARG_HEADER.count());
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

    if ( ! importPath.isEmpty())
    {
        qDebug() << "Setting import path to: " << importPath;
        qputenv("QML2_IMPORT_PATH", importPath.toLatin1());
    }

    if ( ! appid.isEmpty())
    {
        qputenv("APP_ID", appid.toLatin1());
    }

    if ( ! inspector.isEmpty())
    {
        qDebug() << "Inspector server being set to: " << inspector;

        qputenv("QTWEBKIT_INSPECTOR_SERVER", inspector.toLatin1());
    }

    QQmlEngine engine;
    QQmlContext *context = new QQmlContext(engine.rootContext());

    QQmlComponent component(&engine, qmlfile);
    QObject *object = component.create(context);

    if (!component.isReady()) {
        qWarning() << component.errorString();
        return -1;
    }

    if (!object)
    {
        qCritical() << "Cannot create object from qml base file";
        return -1;
    }

    QQuickWindow* window = qobject_cast<QQuickWindow*>(object);

    QHash<QString, QString>::iterator it;
    for(it = properties.begin();
        properties.end() != it;
        ++it)
    {
        object->setProperty(it.key().toStdString().c_str(), QUrl(it.value()));
    }

    if (window)
        window->show();

    return app.exec();
}



