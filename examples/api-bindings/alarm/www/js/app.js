window.onload = function() {
    document.getElementById('start')
        .addEventListener('click', doStart);

    function getDate() {
        var datetime = document.getElementById('date').value;
        if (! datetime || datetime.length == 0)
            return null;
        var parts = datetime.split('T');
        if (! parts || parts.length != 2)
            return null;
        var calendar = parts[0];
        var time = parts[1];

        parts = calendar.split('-');
        if (! parts || parts.length != 3)
            return null;
        var date = new Date(parts[0], parts[1] - 1, parts[2]);
        var times = time.split(':');
        if ( ! times || times.length != 3)
            return date;
        date.setHours(times[0]);
        date.setMinutes(times[1]);
        date.setSeconds(times[2]);
        return date;
    }

    function doStart() {
        var api = external.getUnityObject(1.0);

        var date = getDate();
        if ( ! date) {
            var results = document.getElementById('results');
            results.innerHTML = "Invalid date";
            return;
        }

        api.Alarm.api.createAndSaveAlarmFor(
            date,
            api.Alarm.AlarmType.OneTime,
            api.Alarm.AlarmDayOfWeek.AutoDetect,
            document.getElementById('message').value,
            function(errorid) {
                var results = document.getElementById('results');
                results.innerHTML = api.Alarm.api.errorToMessage(errorid);

            });
    };
};
