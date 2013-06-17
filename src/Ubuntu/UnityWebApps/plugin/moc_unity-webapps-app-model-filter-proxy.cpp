/****************************************************************************
** Meta object code from reading C++ file 'unity-webapps-app-model-filter-proxy.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.0.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "unity-webapps-app-model-filter-proxy.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'unity-webapps-app-model-filter-proxy.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.0.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
struct qt_meta_stringdata_UnityWebappsAppModelFilterProxy_t {
    QByteArrayData data[7];
    char stringdata[116];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    offsetof(qt_meta_stringdata_UnityWebappsAppModelFilterProxy_t, stringdata) + ofs \
        - idx * sizeof(QByteArrayData) \
    )
static const qt_meta_stringdata_UnityWebappsAppModelFilterProxy_t qt_meta_stringdata_UnityWebappsAppModelFilterProxy = {
    {
QT_MOC_LITERAL(0, 0, 31),
QT_MOC_LITERAL(1, 32, 17),
QT_MOC_LITERAL(2, 50, 0),
QT_MOC_LITERAL(3, 51, 18),
QT_MOC_LITERAL(4, 70, 10),
QT_MOC_LITERAL(5, 81, 11),
QT_MOC_LITERAL(6, 93, 21)
    },
    "UnityWebappsAppModelFilterProxy\0"
    "webappNameChanged\0\0sourceModelChanged\0"
    "webappName\0sourceModel\0UnityWebappsAppModel*\0"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_UnityWebappsAppModelFilterProxy[] = {

 // content:
       7,       // revision
       0,       // classname
       0,    0, // classinfo
       2,   14, // methods
       2,   26, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       2,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,   24,    2, 0x05,
       3,    0,   25,    2, 0x05,

 // signals: parameters
    QMetaType::Void,
    QMetaType::Void,

 // properties: name, type, flags
       4, QMetaType::QString, 0x00495003,
       5, 0x80000000 | 6, 0x0049500b,

 // properties: notify_signal_id
       0,
       1,

       0        // eod
};

void UnityWebappsAppModelFilterProxy::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        UnityWebappsAppModelFilterProxy *_t = static_cast<UnityWebappsAppModelFilterProxy *>(_o);
        switch (_id) {
        case 0: _t->webappNameChanged(); break;
        case 1: _t->sourceModelChanged(); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        void **func = reinterpret_cast<void **>(_a[1]);
        {
            typedef void (UnityWebappsAppModelFilterProxy::*_t)() const;
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&UnityWebappsAppModelFilterProxy::webappNameChanged)) {
                *result = 0;
            }
        }
        {
            typedef void (UnityWebappsAppModelFilterProxy::*_t)() const;
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&UnityWebappsAppModelFilterProxy::sourceModelChanged)) {
                *result = 1;
            }
        }
    }
    Q_UNUSED(_a);
}

const QMetaObject UnityWebappsAppModelFilterProxy::staticMetaObject = {
    { &QSortFilterProxyModel::staticMetaObject, qt_meta_stringdata_UnityWebappsAppModelFilterProxy.data,
      qt_meta_data_UnityWebappsAppModelFilterProxy,  qt_static_metacall, 0, 0}
};


const QMetaObject *UnityWebappsAppModelFilterProxy::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *UnityWebappsAppModelFilterProxy::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_UnityWebappsAppModelFilterProxy.stringdata))
        return static_cast<void*>(const_cast< UnityWebappsAppModelFilterProxy*>(this));
    return QSortFilterProxyModel::qt_metacast(_clname);
}

int UnityWebappsAppModelFilterProxy::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QSortFilterProxyModel::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 2)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 2;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 2)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 2;
    }
#ifndef QT_NO_PROPERTIES
      else if (_c == QMetaObject::ReadProperty) {
        void *_v = _a[0];
        switch (_id) {
        case 0: *reinterpret_cast< QString*>(_v) = webappName(); break;
        case 1: *reinterpret_cast< UnityWebappsAppModel**>(_v) = sourceModel(); break;
        }
        _id -= 2;
    } else if (_c == QMetaObject::WriteProperty) {
        void *_v = _a[0];
        switch (_id) {
        case 0: setwebappName(*reinterpret_cast< QString*>(_v)); break;
        case 1: setsourceModel(*reinterpret_cast< UnityWebappsAppModel**>(_v)); break;
        }
        _id -= 2;
    } else if (_c == QMetaObject::ResetProperty) {
        _id -= 2;
    } else if (_c == QMetaObject::QueryPropertyDesignable) {
        _id -= 2;
    } else if (_c == QMetaObject::QueryPropertyScriptable) {
        _id -= 2;
    } else if (_c == QMetaObject::QueryPropertyStored) {
        _id -= 2;
    } else if (_c == QMetaObject::QueryPropertyEditable) {
        _id -= 2;
    } else if (_c == QMetaObject::QueryPropertyUser) {
        _id -= 2;
    } else if (_c == QMetaObject::RegisterPropertyMetaType) {
        if (_id < 2)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 2;
    }
#endif // QT_NO_PROPERTIES
    return _id;
}

// SIGNAL 0
void UnityWebappsAppModelFilterProxy::webappNameChanged()const
{
    QMetaObject::activate(const_cast< UnityWebappsAppModelFilterProxy *>(this), &staticMetaObject, 0, 0);
}

// SIGNAL 1
void UnityWebappsAppModelFilterProxy::sourceModelChanged()const
{
    QMetaObject::activate(const_cast< UnityWebappsAppModelFilterProxy *>(this), &staticMetaObject, 1, 0);
}
QT_END_MOC_NAMESPACE
