#include "UnityWebappsApi.h"

#include <QJsonValue>
#include <QDebug>
#include <QFile>


UnityWebapps::UnityWebapps(QObject *parent):
    QObject(parent)
{
}

UnityWebapps::~UnityWebapps()
{
}

// TODO: return types (eval to undefined?):
void UnityWebapps::init(const QVariant& args)
{
    if (!args.type() != QMetaType::QVariantMap)
    {
        qDebug() << "Invalid init() parameter types";
        return;
    }

    QVariantMap initArgs =
        qvariant_cast<QVariantMap>(args);
    if (!initArgs.contains("name") ||
        !initArgs.contains("iconUrl"))
    {
        qDebug() << "Invalid init() parameter content (not found)";
        return;
    }
    if (!initArgs.value("name").canConvert<QString>() ||
        !initArgs.value("iconUrl").canConvert<QString>())
    {
        qDebug() << "Invalid init() parameter values";
        return;
    }

    QString name = initArgs.value("name").toString();
    QString iconUrl = initArgs.value("iconUrl").toString();

    // Nothing much to do
    _init(name, iconUrl);

    Q_EMIT initCompleted();
}

void UnityWebapps::addAction(const QString& name, QVariant callback)
{
    Q_UNUSED(name);
    Q_UNUSED(callback);
}

void UnityWebapps::removeAction(const QString& name)
{
    Q_UNUSED(name);
}

void UnityWebapps::removeActions()
{
}

void UnityWebapps::_init(const QString& name, const QString& iconUrl)
{
    Q_UNUSED(name);
    Q_UNUSED(iconUrl);
}

// QMLParserStatus
void UnityWebapps::classBegin()
{
}

void UnityWebapps::componentComplete()
{
}

