#include <QtGui/QGuiApplication>
#include "qtquick2applicationviewer.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    // TODO: remove
    qputenv("QTWEBKIT_INSPECTOR_SERVER", "8383");
    qputenv("UNITY_WEBAPPS_BASE_USERSCRIPTS_FOLDER", "./data");

    QtQuick2ApplicationViewer viewer;
    viewer.setMainQmlFile(QStringLiteral("qml/unity-webapps-example-bbcnews/main.qml"));
    viewer.showExpanded();

    return app.exec();
}
