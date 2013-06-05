#include "tst_plugin.h"

#include <QDebug>
#include <QQmlComponent>
#include <QQmlContext>
#include <QQmlEngine>
#include <QSignalSpy>
#include <QJsonDocument>

#include "plugin/unity-webapps-api.h"


PluginTest::PluginTest()
    :QObject(0)
{
}

void PluginTest::initTestCase()
{
    qputenv("QML2_IMPORT_PATH", "../../../bin");
}

void PluginTest::testLoadPlugin()
{
    QQmlEngine engine;
    QQmlComponent component(&engine);
    component.setData("import QtQuick 2.0\nimport Ubuntu.UnityWebApps 0.1\n"
                      "Item { }",
                      QUrl());
    QObject *object = component.create();
    QVERIFY(object != 0);
    delete object;
}

void PluginTest::testInit()
{
/*    QQmlEngine engine;
    QQmlComponent component(&engine);
    component.setData("import QtQuick 2.0\nimport Ubuntu.UnityWebApps 0.1\n"
                      "Item { function call() { var binding = new UnityWebAppsJs.UnityWebApps(); binding.init(); } }\n", QUrl());
*/
//    UnityWebapps *binding = new UnityWebapps(NULL);
//    QSignalSpy initCompleted(binding, SIGNAL(initCompleted()));

    // TODO dont need onInit since it will be called via signal and routed to js onInit()

//    const QString initargs = "{\"name\": \"name\", \"iconUrl\": \"icon://\"}";
//    binding->init(QJsonDocument::fromJson(initargs.toUtf8()).toVariant());
//    QCOMPARE(initCompleted.count(), 1);
}
