#ifndef TST_PLUGIN_H
#define TST_PLUGIN_H

#include <QTest>

class PluginTest: public QObject
{
    Q_OBJECT

public:
    PluginTest();

private Q_SLOTS:
    void initTestCase();

    // tests
    void testLoadPlugin();
    void testInit();
};

#endif // TST_PLUGIN_H
