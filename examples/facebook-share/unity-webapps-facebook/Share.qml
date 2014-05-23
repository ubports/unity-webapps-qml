/*
 * Copyright (C) 2012-2013 Canonical, Ltd.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import QtQuick 2.0
import QtQuick.Window 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.ListItems 0.1 as ListItem
import Ubuntu.OnlineAccounts 0.1

Rectangle {
    id: root
    anchors.fill: parent
    color: Theme.palette.normal.background
    property string fileToShare
    property var callback
    property string serviceType: "sharing"
    property string provider: "facebook"
    property string userAccountId
    property string accessToken
    property var account
    signal accountSelected
    signal canceled()
    signal uploadCompleted(bool success)

    onUploadCompleted: {
        activitySpinner.visible = false;
        if (success)
            print ("Successfully posted");
        else
            print ("Failed to post");
    }

    Component.onCompleted: print ("Root completed " + height + " : " + width)

    AccountServiceModel {
        id: accounts
        serviceType: root.serviceType
        provider: root.provider
    }

    Rectangle {
        id: shareComponent
        objectName: "shareComponent"
        anchors.fill: parent
        color: Theme.palette.normal.background
        visible: false

        Component.onCompleted: print ("shareComponent completed " + height + " : " + width)

        Column {
            anchors.fill: parent
            spacing: units.gu(1)

            Item {
                id: serviceHeader
                y: 0
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.topMargin: units.gu(1)
                anchors.leftMargin: units.gu(1)
                anchors.rightMargin: units.gu(1)
                height: childrenRect.height

                ListItem.Subtitled {
                    anchors {
                        left: parent.left
                        right: parent.right
                    }
                    iconName: root.account.provider.iconName
                    text: root.account.provider.displayName
                    subText: root.account.displayName
                    showDivider: false
                }
            }

            ListItem.ThinDivider {}

            UbuntuShape {
                id: messageArea
                objectName: "messageArea"
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.topMargin: units.gu(1)
                anchors.leftMargin: units.gu(1)
                anchors.rightMargin: units.gu(1)

                height: units.gu(20)
                color: "#f2f2f2"

                TextEdit {
                    id: message
                    color: "#333333"
                    anchors.top: parent.top
                    anchors.left: snapshot.right
                    anchors.bottom: parent.bottom
                    anchors.margins: units.gu(1)
                    wrapMode: Text.Wrap
                    width: parent.width - snapshot.width -
                           snapshot.anchors.margins * 2 -
                           message.anchors.leftMargin - message.anchors.rightMargin
                    clip: true
                    font.pixelSize: FontUtils.sizeToPixels("medium")
                    font.weight: Font.Light
                    focus: true
                }

                ActivityIndicator {
                    id: activitySpinner
                    anchors.centerIn: message
                    visible: false
                    running: visible
                }

                UbuntuShape {
                    id: snapshot
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.margins: units.gu(1)
                    width: units.gu(10)
                    height: units.gu(10)

                    image: Image {
                        source: fileToShare
                        sourceSize.height: snapshot.height
                        sourceSize.width: snapshot.width
                        fillMode: Image.PreserveAspectCrop
                    }
                }
            }

            Item {
                id: actionsBar
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.topMargin: units.gu(2)
                anchors.leftMargin: units.gu(1)
                anchors.rightMargin: units.gu(1)
                height: childrenRect.height

                Button {
                    objectName: "cancelButton"
                    anchors.left: parent.left
                    text: i18n.dtr("ubuntu-ui-extras", "Cancel")
                    color: "#cccccc"
                    width: units.gu(10)
                    height: units.gu(4)
                    onClicked: canceled()
                }

                Button {
                    objectName: "postButton"
                    anchors.right: parent.right
                    anchors.top: parent.top
                    text: i18n.dtr("ubuntu-ui-extras", "Post")
                    color: "#dd4814"
                    width: units.gu(10)
                    height: units.gu(4)
                    enabled: !activitySpinner.visible
                    onClicked: {
                        activitySpinner.visible = true;
                        callback(accessToken, fileToShare, message.text, uploadCompleted);
                    }
                }
            }

            UbuntuShape {
                id: useLocation
                anchors {
                    left: parent.left
                    leftMargin: units.gu(1)
                    topMargin: units.gu(1)
                }
                color: selected ? "#cccccc" : "transparent"
                property bool selected: false
                width: units.gu(4.5)
                height: units.gu(4)

                AbstractButton {
                    anchors.fill: parent
                    onClicked: parent.selected = !parent.selected
                    Image {
                        source: "assets/icon_location.png"
                        anchors.centerIn: parent
                        height: parent.height * 0.75
                        fillMode: Image.PreserveAspectFit
                        smooth: true
                    }
                }
            }

            Label {
                anchors.left: useLocation.right
                anchors.baseline: useLocation.top
                anchors.baselineOffset: units.gu(3)
                anchors.leftMargin: units.gu(1)
                text: i18n.dtr("ubuntu-ui-extras", "Include location")
                fontSize: "small"
            }

        }

        states: [
            State {
                name: "landscape-with-keyborad"
                PropertyChanges {
                    target: serviceHeader
                    y: - serviceHeader.height
                }
                PropertyChanges {
                    target: messageArea
                    height: units.gu(12)
                }
            }
        ]

        state: ((Screen.orientation === Qt.LandscapeOrientation) ||
                (Screen.orientation === Qt.InvertedLandscapeOrientation)) &&
               Qt.inputMethod.visible ? "landscape-with-keyborad" : ""
    }

    /* Menu listing online accounts */
    Item {
        id: sharemenu
        anchors.fill: parent
        visible: true

        signal selected(string accountId, string token)

        Component.onCompleted: {
            visible = true;
            print ("sharemenu completed " + height + " : " + width);
        }
        onSelected: {
            root.userAccountId = accountId;
            root.accessToken = token;
            shareComponent.visible = true;
            sharemenu.visible = false;
        }

        Component {
            id: acctDelegate
            Item {
                anchors {
                    left: parent.left
                    right: parent.right
                }
                AccountService {
                    id: service
                    objectHandle: accountServiceHandle
                    onAuthenticated: {
                        sharemenu.selected(accountId, reply.AccessToken);
                    }
                }

                height: childrenRect.height

                ListItem.Subtitled {
                    anchors {
                        left: parent.left
                        right: parent.right
                    }
                    text: service.provider.displayName
                    subText: displayName
                    iconName: service.provider.iconName
                    __iconHeight: units.gu(5)
                    __iconWidth: units.gu(5)

                    onClicked: {                        
                        root.account = service;
                        root.account.authenticate(null);
                    }
                    Component.onCompleted: print ("KEN: " + service.provider.displayName + " height: " + height + " y: " + y + " visible: " + visible)
                }
            }
        }

        ListView {
            anchors {
                top: parent.top
                left: parent.left
                right: parent.right
            }
            height: childrenRect.height
            interactive: false
            model: accounts
            delegate: acctDelegate
            Component.onCompleted: print ("listview completed " + height + " : " + width)
        }
    }
}
