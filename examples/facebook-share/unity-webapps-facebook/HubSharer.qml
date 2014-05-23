import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.ListItems 0.1 as ListItem
import Ubuntu.Components.Popups 0.1

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

    property string fileToShare: "/home/ken/Pictures/Ubuntu_TV.png"


    function _callback(accessToken, fileToShare, message, cb) {
        print ("_callback: " + accessToken);
        print ("_callback: " + fileToShare);
        print ("_callback: " + message);


        var xhr = new XMLHttpRequest();
        xhr.open("GET", fileToShare, true);
        xhr.setRequestHeader("Content-type", "image/png");

        //xhr.responseType = "blob";
        xhr.onreadystatechange = function (e) {
            print ("HERE");
            if (xhr.readyState === XMLHttpRequest.DONE) {

            //var blob = new Blob([xhr.response], {type: "image/png"});
//            for (var i in XMLHttpRequest.prototype)
//                print (i);

                console.log("HEADERS: " + xhr.getAllResponseHeaders());
                console.log("SIZE: "+ xhr.responseText.length);
                var a1 = Qt.btoa(xhr.responseText);
                console.log("SIZE: "+ a1.length);
                console.log('response body:' + xhr.responseText)
		console.log('a1: ' + a1);
	        var result = {accessToken: accessToken,
                fileToShare: a1,
             	    message: message, size: xhr.responseText.length, contentlength: xhr.getResponseHeader('content-length')};

                completed(JSON.stringify(result));

                /*

                */
            }
        }
        xhr.send();

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
