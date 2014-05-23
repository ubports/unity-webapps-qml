import QtQuick 2.0;

//import "/home/ken/work/phablet/content-hub/14.10/content-hub-share/examples/facebook-share/unity-webapps-facebook" as Sharer
import "unity-webapps-facebook" as Sharer

Sharer.HubSharer {
  width: 800
  height: 500
  
  fileToShare: 'file:///home/ken/.cache/com.ubuntu.developer.webapps.webapp-facebook/HubIncoming/14/ubuntu-varsity-red-1920x1200.png';
  visible: true;
}

