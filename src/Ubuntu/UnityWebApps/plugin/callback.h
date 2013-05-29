#ifndef CALLBACK_H
#define CALLBACK_H

#include <QVariant>
#include <QObject>

class Callback : public QObject
{
    Q_OBJECT

public:
    Callback(QObject *parent);

    Q_INVOKABLE QVariant call(const QVariantList& arguments);
};

#endif // CALLBACK_H
