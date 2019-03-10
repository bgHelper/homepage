var getQueryObject = function() {
	var queryString = location.search;
	var qString = queryString.match(/[^?&]+/g);
	var ret = {};
	for (key in qString) {
		var para = qString[key].match(/[^=]+/g);
		if (para.length == 2) {
			ret[para[0]] = para[1];
		}
	}
	return ret;
}