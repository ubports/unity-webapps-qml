#include "tst_plugin.h"

#include <QDebug>
#include <QQmlComponent>
#include <QQmlContext>
#include <QQmlEngine>
#include <QSignalSpy>
#include <QJsonDocument>
#include <QVariantMap>

#include "plugin/unity-webapps-api.h"


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
#if 0
    UnityWebapps * p = new UnityWebapps();

    p->setHandleDesktopFileUpdates(false);
    p->init(webappName, url, getParams());

    QVERIFY( ! p->getDesktopFileContent().isEmpty());
#endif
}
