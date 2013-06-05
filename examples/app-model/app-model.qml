import QtQuick 2.0
import Ubuntu.UnityWebApps 0.1

Rectangle {
    width: 360
    height: 360
    MouseArea {
        anchors.fill: parent
        onClicked: {
            Qt.quit();
        }
    }
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
                    Text { text: '<b>content:</b> ' + domain }
                }
           }
        }
    }
}

