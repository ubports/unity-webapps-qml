#ifndef UNITYWEBAPPS_H
#define UNITYWEBAPPS_H

#include <QObject>
#include <QVariant>
#include <QQmlParserStatus>

class UnityWebapps : public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)

//    Q_PROPERTY(QString applicationName READ applicationName WRITE setApplicationName NOTIFY nameChanged)


public:
    UnityWebapps(QObject *parent = 0);
    ~UnityWebapps();

    // TODO: really need it?
    void classBegin();
    void componentComplete();


public Q_SLOTS:

    // API functions
    void init(const QVariant& args);
    void addAction(const QString& name, QVariant callback);
    void removeAction(const QString& name);
    void removeActions();

Q_SIGNALS:
    void initCompleted();


private:

    void _init(const QString& name, const QString& iconUrl);
};

#endif // UNITYWEBAPPS_H

