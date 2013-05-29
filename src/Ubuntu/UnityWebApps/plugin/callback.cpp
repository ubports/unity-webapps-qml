#include "callback.h"

#include <QDebug>

Callback::Callback(QObject* parent)
: QObject(parent)
{
}

QVariant Callback::call(const QVariantList& arguments)
{
    Q_UNUSED(arguments);
//    emit called(arguments);
    return QVariant();
}

