window.onload = function() {
    document.getElementById('getauth').addEventListener('click', doGetAuth);

    var api = external.getUnityObject('1.0');
    var oa = api.OnlineAccounts;

    oa.api.getAccounts(function(accounts) {
        var ul = document.querySelector('#accounts ul');
        if (accounts.length === 0) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode('No accounts found'));
            ul.appendChild(li);
        }
        else {
            for(var i = 0; i < accounts.length; ++i) {
                var li = document.createElement('li');
                li.innerHTML = 'id: ' + accounts[i].accountId()
                        + ', name: ' + accounts[i].displayName()
                        + ', provider: ' + JSON.stringify(accounts[i].provider())
                        + ', service: ' + JSON.stringify(accounts[i].service());
                ul.appendChild(li);

                (function(i) {
                    function authcallback(results) {
                        setResults('Authentication result: ' + JSON.stringify(results));
                    };

                    li.addEventListener('click', function() {
                        accounts[i].authenticate(authcallback);
                    });
                })(i);
            }
        }
    });

    function setResults(data) {
        var results = document.getElementById('results');
        results.innerHTML += data;
    };

    function doGetAuth() {
        setResults('');

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
