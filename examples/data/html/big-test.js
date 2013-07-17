var Unity = external.getUnityObject(1);

var data_uri = "data:image/png;base64,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";

var icon_uri = "http://www.ubuntu.com/sites/www.ubuntu.com/files/active/02_ubuntu/U_homepage/picto-server.png";

function addLauncherTests() {
    $("#launcherTest1Button").click(function (){
	Unity.Launcher.setCount(7);
    });
    $("#launcherTest2Button").click(function (){
	Unity.Launcher.setProgress(0.3);
    });
    $("#launcherTest3Button").click(function (){
	Unity.Launcher.setUrgent();
    });
    
    $("#launcherClearButton").click(function (){
	Unity.Launcher.clearCount();
	Unity.Launcher.clearProgress();
    });

    $("#launcherRemoveActionsBulk").click(function(){
	Unity.Launcher.removeActions();
    });

    $("#launcherRemoveAction").click(function(){
	Unity.Launcher.removeAction("Test Action 1");
    });

    $("#launcherAddActionsButton").click(function(){
	var makeLauncherCallback = function(label) {
	    return function () {
		$("#launcherCallbackLog").html($("#launcherCallbackLog").html()+label+"<br/>");
	    }
	};
	Unity.Launcher.addAction("Test Action 1", makeLauncherCallback("Test Action 1"));
	Unity.Launcher.addAction("Test Action 2", makeLauncherCallback("Test Action 2"));
	    
    });
}

function addNotificationTests(){
    $("#notificationTest1Button").click(function (){
	Unity.Notification.showNotification("Test notification", "Showing a simple test notification", null);
    });
    $("#notificationTest2Button").click(function (){
	Unity.Notification.showNotification("Test notification", "Showing a test notification with an image URL", "http://www.ubuntu.com/sites/www.ubuntu.com/files/active/02_ubuntu/U_homepage/picto-desktop.png");
    });
    $("#notificationTest3Button").click(function (){
	Unity.Notification.showNotification("Test notification", "Showing a test notification with a data URI", data_uri);
    });
}

function addMediaPlayerTests(){
    $("#musicPlayerInitButton").click(function(){
	Unity.MediaPlayer.init("Wha");
    });

    $("#musicPlayerTest1Button").click(function(){
	Unity.MediaPlayer.setTrack({artist: "Test artist", album: "Test album", title: "Test", artLocation: null});
    });
    $("#musicPlayerTest2Button").click(function(){
	Unity.MediaPlayer.setTrack({artist: "Test artist", album: "Test album", title: "Test", artLocation: icon_uri});
    });
    $("#musicPlayerTest3Button").click(function(){
	Unity.MediaPlayer.setTrack({artist: "Test artist", album: "Test album", title: "Test", artLocation: data_uri});
    });
    $("#musicPlayerPlaybackStateButton").click(function(){
	Unity.MusicPlayer.getPlaybackState(
          function (playbackstate) {
            Unity.MediaPlayer.setPlaybackState( ! playbackstate);
          }
        );
    });
    
    $("#musicPlayerAddCallbacksButton").click(function(){
	Unity.MediaPlayer.onNext(function() {
	    $("#musicPlayerCallbackLog").html($("#musicPlayerCallbackLog").html()+"<br/>Next");
	});
	Unity.MediaPlayer.onPrevious(function() {
	    $("#musicPlayerCallbackLog").html($("#musicPlayerCallbackLog").html()+"<br/>Previous");
	});
	Unity.MediaPlayer.onPlayPause(function() {
	    $("#musicPlayerCallbackLog").html($("#musicPlayerCallbackLog").html()+"<br/>Play/Pause");
	});
    });
}

function addIndicatorTests() {
    $("#clearButton").click(function (){
	Unity.MessagingIndicator.clearIndicator("Simple test indicator");
	Unity.MessagingIndicator.clearIndicator("Indicator with Count");
	Unity.MessagingIndicator.clearIndicator("Indicator with Time");
	Unity.MessagingIndicator.clearIndicator("Indicator with Icon");
	Unity.MessagingIndicator.clearIndicator("Indicator with Icon (Data URI)");
	Unity.MessagingIndicator.clearIndicator("Indicator with Callback (1)");
	Unity.MessagingIndicator.clearIndicator("Indicator with Callback (2)");
    });
    
    $("#indicatorTest1Button").click(function (){
	Unity.MessagingIndicator.showIndicator("Simple test indicator");
    });
    $("#indicatorTest2Button").click(function(){
	Unity.MessagingIndicator.showIndicator("Indicator with Count", {count: "103"});
    });
    $("#indicatorTest3Button").click(function(){
	Unity.MessagingIndicator.showIndicator("Indicator with Time", {time: new Date()});
    });
    $("#indicatorTest4Button").click(function(){
	Unity.MessagingIndicator.showIndicator("Indicator with Icon", {icon: icon_uri});
    });
    $("#indicatorTest5Button").click(function(){
	Unity.MessagingIndicator.showIndicator("Indicator with Icon (Data URI)", {icon: data_uri});
    });
    $("#indicatorTest6Button").click(function(){
	Unity.MessagingIndicator.addAction("Test action", function(){});
    });
    
    $("#indicatorCallbackAddButton").click(function(){
	var callback1 = function() {
	    $("#indicatorCallback1Label").text("Indicator Callback 1: Success");
	}
	var callback2 = function() {
	    $("#indicatorCallback2Label").text("Indicator Callback 2: Success");
	}
	Unity.MessagingIndicator.showIndicator("Indicator with Callback (1)", callback1);
	Unity.MessagingIndicator.showIndicator("Indicator with Callback (2)", callback2);
    });

    $("#indicatorActionCallbackAddButton").click(function(){
	var callback1 = function() {
	    $("#indicatorActionCallback1Label").text("Action Callback 1: Success");
	}
	var callback2 = function() {
	    $("#indicatorActionCallback2Label").text("Action Callback 2: Success");
	}
	Unity.MessagingIndicator.addAction("Action with Callback (1)", callback1);
	Unity.MessagingIndicator.addAction("Action with Callback (2)", callback2);
    });
}

function addHUDTest() {
    $("#HUDAddActions").click(function(){
        function addAction(name) {
            Unity.addAction(name, function() {
	        $("#indicatorActionCallback2Label").text(name);
            });
        }

        addAction('/HUD/haveAniceDay');
        addAction('/HUD/dontBeEvil');
        addAction('/HUD/Bender/killAllHumans');
    });
    $("#HUDRemoveActions").click(function(){
        Unity.clearActions();
    });
}

function initializeUnityAPI () {
    var name = "BigUnityWebTest";
    var iconUrl = "http://www.ubuntu.com/sites/www.ubuntu.com/files/active/02_ubuntu/U_business/pictograms-cloud.png";
    function init() {
	addNotificationTests();
	addIndicatorTests();
	addMediaPlayerTests();
	addLauncherTests();
	addHUDTest();
    }
    Unity.init ({ name: name,
                  iconUrl: iconUrl,
                  onInit: init
                });
}

$().ready( function() {
    $("#initButton").click(initializeUnityAPI);
});
