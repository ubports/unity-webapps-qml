#ifndef UNITYWEBAPPSNOTIFICATION_H
#define UNITYWEBAPPSNOTIFICATION_H

#include <QObject>
#include <QQmlParserStatus>

class UnityWebappsNotification : public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)

    Q_PROPERTY(QString name READ name WRITE setName)

public:
    explicit UnityWebappsNotification(QObject *parent = 0);
    virtual ~UnityWebappsNotification();

    void setName(const QString& name);
    QString name() const;

    // TODO: don't really need it?
    void classBegin();
    void componentComplete();

public Q_SLOTS:

    void show(const QString& summary,
              const QString& body,
              const QString& icon);

private:

    QString _applicationName;
};

#endif // UNITYWEBAPPSNOTIFICATION_H
