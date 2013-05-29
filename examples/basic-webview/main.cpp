#include <QtGui/QGuiApplication>
#include "qtquick2applicationviewer.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    // TODO: remove
    qputenv("QTWEBKIT_INSPECTOR_SERVER", "8383");

    QtQuick2ApplicationViewer viewer;
    viewer.setMainQmlFile(QStringLiteral("qml/basic-webview/main.qml"));
    viewer.showExpanded();

    return app.exec();
}
