window.onload = function() {
    document.getElementById('getauth').addEventListener('click', doGetAuth);

    function setResults(data) {
        var results = document.getElementById('results');
        results.innerHTML += data;
    };

    function doGetAuth() {
        setResults('');

        var api = external.getUnityObject('1.0');
        var oa = api.OnlineAccounts;

        oa.api.getAccountsInfoFor(null, 'facebook', function(result) {
            if (result.length != undefined && result.length === 0) {
                setResults("No account found");
            }
            else {
                for (var i = 0; i < result.length; ++i) {
                    setResults("name: " + result[i].displayName
			       + ', id: ' + result[i].accountId
			       + ', providerName: ' + result[i].providerName
			       + ', serviceName: ' + result[i].serviceName
			       + ', enabled: ' + (result[i].enabled ? "true" : "false")
			       + '<br>');
                }
            }

            oa.api.getAccessTokenFor(null, 'facebook', null, function(result) {
                if (result.error) {
                    setAuthToken("Error: " + result.error);
                    return;
                }

                setResults("<br><br>Authenticated: "
                             + result.authenticated
                             + ", token: "
                             + result.data.AccessToken);
            });
        });
    }
};
