window.onload = function() {
    document.getElementById('refreshAccounts').addEventListener('click', listAccounts);

    var api = external.getUnityObject('1.0');
    var oa = api.OnlineAccounts;

    function listAccounts() {
        var filters = {};
        var service = document.getElementById('service').value;
        if (service) {
            filters['service'] = service
        }
        var provider = document.getElementById('provider').value;
        if (provider) {
            filters['provider'] = provider
        }

        oa.api.getAccounts(filters, function(accounts) {
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
    }

    function setResults(data) {
        var results = document.getElementById('results');
        results.innerHTML += data;
    };
};
