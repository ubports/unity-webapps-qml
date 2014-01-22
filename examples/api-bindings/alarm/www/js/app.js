window.onload = function() {
    document.getElementById('start')
        .addEventListener('click', doStart);

    function doStart() {
        var api = external.getUnityObject(1.0);

        var date = new Date();
        date.setTime(Date.parse(document.getElementById('date').value));

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
