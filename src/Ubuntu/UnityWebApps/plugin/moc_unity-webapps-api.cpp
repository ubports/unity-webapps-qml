/****************************************************************************
** Meta object code from reading C++ file 'unity-webapps-api.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.0.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "unity-webapps-api.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'unity-webapps-api.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.0.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
struct qt_meta_stringdata_UnityWebapps_t {
    QByteArrayData data[10];
    char stringdata[90];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    offsetof(qt_meta_stringdata_UnityWebapps_t, stringdata) + ofs \
        - idx * sizeof(QByteArrayData) \
    )
static const qt_meta_stringdata_UnityWebapps_t qt_meta_stringdata_UnityWebapps = {
    {
QT_MOC_LITERAL(0, 0, 12),
QT_MOC_LITERAL(1, 13, 13),
QT_MOC_LITERAL(2, 27, 0),
QT_MOC_LITERAL(3, 28, 4),
QT_MOC_LITERAL(4, 33, 4),
QT_MOC_LITERAL(5, 38, 9),
QT_MOC_LITERAL(6, 48, 4),
QT_MOC_LITERAL(7, 53, 8),
QT_MOC_LITERAL(8, 62, 12),
QT_MOC_LITERAL(9, 75, 13)
    },
    "UnityWebapps\0initCompleted\0\0init\0args\0"
    "addAction\0name\0callback\0removeAction\0"
    "removeActions\0"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_UnityWebapps[] = {

 // content:
       7,       // revision
       0,       // classname
       0,    0, // classinfo
       5,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,   39,    2, 0x05,

 // slots: name, argc, parameters, tag, flags
       3,    1,   40,    2, 0x0a,
       5,    2,   43,    2, 0x0a,
       8,    1,   48,    2, 0x0a,
       9,    0,   51,    2, 0x0a,

 // signals: parameters
    QMetaType::Void,

 // slots: parameters
    QMetaType::Void, QMetaType::QVariant,    4,
    QMetaType::Void, QMetaType::QString, QMetaType::QVariant,    6,    7,
    QMetaType::Void, QMetaType::QString,    6,
    QMetaType::Void,

       0        // eod
};

void UnityWebapps::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        UnityWebapps *_t = static_cast<UnityWebapps *>(_o);
        switch (_id) {
        case 0: _t->initCompleted(); break;
        case 1: _t->init((*reinterpret_cast< const QVariant(*)>(_a[1]))); break;
        case 2: _t->addAction((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< QVariant(*)>(_a[2]))); break;
        case 3: _t->removeAction((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 4: _t->removeActions(); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        void **func = reinterpret_cast<void **>(_a[1]);
        {
            typedef void (UnityWebapps::*_t)();
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&UnityWebapps::initCompleted)) {
                *result = 0;
            }
        }
    }
}

const QMetaObject UnityWebapps::staticMetaObject = {
    { &QObject::staticMetaObject, qt_meta_stringdata_UnityWebapps.data,
      qt_meta_data_UnityWebapps,  qt_static_metacall, 0, 0}
};


const QMetaObject *UnityWebapps::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *UnityWebapps::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_UnityWebapps.stringdata))
        return static_cast<void*>(const_cast< UnityWebapps*>(this));
    if (!strcmp(_clname, "QQmlParserStatus"))
        return static_cast< QQmlParserStatus*>(const_cast< UnityWebapps*>(this));
    if (!strcmp(_clname, "org.qt-project.Qt.QQmlParserStatus"))
        return static_cast< QQmlParserStatus*>(const_cast< UnityWebapps*>(this));
    return QObject::qt_metacast(_clname);
}

int UnityWebapps::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 5)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 5;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 5)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 5;
    }
    return _id;
}

// SIGNAL 0
void UnityWebapps::initCompleted()
{
    QMetaObject::activate(this, &staticMetaObject, 0, 0);
}
QT_END_MOC_NAMESPACE
