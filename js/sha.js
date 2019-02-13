var sha = function(str) {
	var hash = new jsSHA("SHA-256", "TEXT");
	hash.update(str);
	return hash.getHash("HEX");
}