/****************************************************************************
** Meta object code from reading C++ file 'unity-webapps-app-model.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.0.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "unity-webapps-app-model.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'unity-webapps-app-model.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.0.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
struct qt_meta_stringdata_UnityWebappsAppModel_t {
    QByteArrayData data[14];
    char stringdata[116];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    offsetof(qt_meta_stringdata_UnityWebappsAppModel_t, stringdata) + ofs \
        - idx * sizeof(QByteArrayData) \
    )
static const qt_meta_stringdata_UnityWebappsAppModel_t qt_meta_stringdata_UnityWebappsAppModel = {
    {
QT_MOC_LITERAL(0, 0, 20),
QT_MOC_LITERAL(1, 21, 6),
QT_MOC_LITERAL(2, 28, 0),
QT_MOC_LITERAL(3, 29, 10),
QT_MOC_LITERAL(4, 40, 14),
QT_MOC_LITERAL(5, 55, 4),
QT_MOC_LITERAL(6, 60, 3),
QT_MOC_LITERAL(7, 64, 4),
QT_MOC_LITERAL(8, 69, 12),
QT_MOC_LITERAL(9, 82, 4),
QT_MOC_LITERAL(10, 87, 6),
QT_MOC_LITERAL(11, 94, 4),
QT_MOC_LITERAL(12, 99, 7),
QT_MOC_LITERAL(13, 107, 7)
    },
    "UnityWebappsAppModel\0exists\0\0webappName\0"
    "getWebappIndex\0data\0row\0role\0WebAppsRoles\0"
    "Name\0Domain\0Urls\0Scripts\0Content\0"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_UnityWebappsAppModel[] = {

 // content:
       7,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       1,   40, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: name, argc, parameters, tag, flags
       1,    1,   29,    2, 0x02,
       4,    1,   32,    2, 0x02,
       5,    2,   35,    2, 0x02,

 // methods: parameters
    QMetaType::Bool, QMetaType::QString,    3,
    QMetaType::Int, QMetaType::QString,    3,
    QMetaType::QVariant, QMetaType::Int, QMetaType::Int,    6,    7,

 // enums: name, flags, count, data
       8, 0x0,    5,   44,

 // enum data: key, value
       9, uint(UnityWebappsAppModel::Name),
      10, uint(UnityWebappsAppModel::Domain),
      11, uint(UnityWebappsAppModel::Urls),
      12, uint(UnityWebappsAppModel::Scripts),
      13, uint(UnityWebappsAppModel::Content),

       0        // eod
};

void UnityWebappsAppModel::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        UnityWebappsAppModel *_t = static_cast<UnityWebappsAppModel *>(_o);
        switch (_id) {
        case 0: { bool _r = _t->exists((*reinterpret_cast< const QString(*)>(_a[1])));
            if (_a[0]) *reinterpret_cast< bool*>(_a[0]) = _r; }  break;
        case 1: { int _r = _t->getWebappIndex((*reinterpret_cast< const QString(*)>(_a[1])));
            if (_a[0]) *reinterpret_cast< int*>(_a[0]) = _r; }  break;
        case 2: { QVariant _r = _t->data((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])));
            if (_a[0]) *reinterpret_cast< QVariant*>(_a[0]) = _r; }  break;
        default: ;
        }
    }
}

const QMetaObject UnityWebappsAppModel::staticMetaObject = {
    { &QAbstractListModel::staticMetaObject, qt_meta_stringdata_UnityWebappsAppModel.data,
      qt_meta_data_UnityWebappsAppModel,  qt_static_metacall, 0, 0}
};


const QMetaObject *UnityWebappsAppModel::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *UnityWebappsAppModel::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_UnityWebappsAppModel.stringdata))
        return static_cast<void*>(const_cast< UnityWebappsAppModel*>(this));
    return QAbstractListModel::qt_metacast(_clname);
}

int UnityWebappsAppModel::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QAbstractListModel::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 3)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 3;
    }
    return _id;
}
QT_END_MOC_NAMESPACE
