import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.ListItems 0.1 as ListItem
import Ubuntu.Components.Popups 0.1

/*!
    \brief MainView with a Label and Button elements.
*/

MainView {
    id: root
    // objectName for functional testing purposes (autopilot-qt5)
    objectName: "mainView"

    // Note! applicationName needs to match the "name" field of the click manifest
    applicationName: "com.ubuntu.developer.ken-vandine.hub-sharer"

    /*
     This property enables the application to change orientation
     when the device is rotated. The default is false.
    */
    //automaticOrientation: true

    width: units.gu(100)
    height: units.gu(75)

    signal completed(string result)

    property string fileToShare: "/home/ken/Pictures/Ubuntu_TV.png"

    function _callback(accessToken, fileToShare, message, cb) {
        print ("_callback: " + accessToken);
        print ("_callback: " + fileToShare);
        print ("_callback: " + message);

	var result = {accessToken: accessToken,
	    fileToShare: Qt.resolvedUrl(fileToShare),
	    message: message};
        completed(JSON.stringify(result));
    }


    PageStack {
        id: pageStack
        Component.onCompleted: push(sharePage)

        Page {
            id: sharePage
            visible: false
            title: i18n.tr("Hub Share")

            Share {
                anchors.fill: parent
                fileToShare: root.fileToShare
                callback: _callback
                provider: "facebook"
                onCanceled: print ("canceled")
                onUploadCompleted: print (success)
            }
        }
    }
}
