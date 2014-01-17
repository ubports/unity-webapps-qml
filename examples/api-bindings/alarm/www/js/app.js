window.onload = function() {
    document.getElementById('start').addEventListener('click', doStart);

    function doStart() {
	var api = external.getUnityObject(1.0);

	api.Alarm.createAlarm(function(alarm) {
	    var date = new Date();
	    date.setTime(Date.parse(document.getElementById('date').value));
	    console.log(alarm);
	    alarm.setDate(date);
	    alarm.setMessage(document.getElementById('message').value);
	    alarm.save();

	    var results = document.getElementById('results');
	    peer.innerHTML = 'SAVED!';
	});
    }
};
