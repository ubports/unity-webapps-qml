#ifndef WEBAPPS_QML_PLUGIN_H
#define WEBAPPS_QML_PLUGIN_H

#include <QQmlExtensionPlugin>

class WebappsQmlPlugin : public QQmlExtensionPlugin
{
    Q_OBJECT
    Q_PLUGIN_METADATA(IID "org.qt-project.Qt.QQmlExtensionInterface")
    
public:
    void registerTypes(const char *uri);
};

#endif // WEBAPPS_QML_PLUGIN_H

