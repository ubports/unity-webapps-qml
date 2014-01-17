window.onload = function() {
    document.getElementById('getauth').addEventListener('click', doGetAuth);

    function setAuthToken(token) {
	var results = document.getElementById('results');
	results.innerHTML = token;
    };

    function doGetAuth() {
	var api = external.getUnityObject(1.0);
	var oa = api.OnlineAccounts;

	oa.api.getAccessTokenFor(null, 'facebook', function(result) {
	    
	    setAuthToken(result);
	});
    }
};
