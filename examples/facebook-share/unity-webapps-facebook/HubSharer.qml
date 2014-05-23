import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.ListItems 0.1 as ListItem
import Ubuntu.Components.Popups 0.1
import Ubuntu.Content 0.1

/*!
    \brief MainView with a Label and Button elements.
*/

Item {
    id: main
    // objectName for functional testing purposes (autopilot-qt5)
    //objectName: "mainView"

    // Note! applicationName needs to match the "name" field of the click manifest
    //applicationName: "com.ubuntu.developer.ken-vandine.hub-sharer"

    /*
     This property enables the application to change orientation
     when the device is rotated. The default is false.
    */
    //automaticOrientation: true

    width: parent.width
    height: parent.height
    anchors.fill: parent

    signal completed(string result)

    property string fileToShare


    function _callback(accessToken, fileToShare, message, cb) {
        print ("_callback: " + accessToken);
        print ("_callback: " + fileToShare);
        print ("_callback: " + message);

        itemComp.url = fileToShare;
        var dataUri = itemComp.toDataURI();
	var result = {accessToken: accessToken,
            fileToShare: dataUri.toString(),
            message: message};

        completed(JSON.stringify(result));

    }

    ContentItem {
        id: itemComp
    }

    //PageStack {
    //    id: pageStack
    //    Component.onCompleted: push(sharePage)

        //Page {
        //    id: sharePage
        //    anchors.fill: parent
        //    visible: true
        //    title: i18n.tr("Hub Share")

            Share {
                anchors.fill: parent
                visible: true
                fileToShare: main.fileToShare
                callback: _callback
                provider: "facebook"
                onCanceled: print ("canceled")
                onUploadCompleted: print (success)
                Component.onCompleted: print ("Page completed " + height + " : " + width)
            }
        //}
    //}
}
