import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Content 0.1

Item {
    id: main
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

    Share {
        anchors.fill: parent
        visible: true
        fileToShare: main.fileToShare
        callback: _callback
        provider: "facebook"
        onCanceled: completed(JSON.stringify({status: "cancelled"}))
        onUploadCompleted: console.log (success)
        Component.onCompleted: print ("Page completed " + height + " : " + width)
    }
}
