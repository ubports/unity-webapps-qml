import QtQuick 2.0
import Ubuntu.UnityWebApps 0.1

Rectangle {
    id: rootItem
    width: 360
    height: 360

    ListView {
        id: webapps
        anchors.fill: parent
        model: UnityWebappsAppModel {}
        delegate: installedWebappsDelegate

        Component {
            id: installedWebappsDelegate
            Item {
                width: 180; height: 40
                Column {
                    Text { text: '<b>Name:</b> ' + name }
                    Text { text: '<b>Domain:</b> ' + domain }
                }
           }
        }
    }
}

