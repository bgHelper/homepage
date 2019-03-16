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

var setFullpage = function() {
	var page = document.getElementById('page');
	if (page) {
		window.addEventListener('DOMContentLoaded', function() {
			var nav = window.navigator;
			var ua = nav.userAgent;
			var isFullScreen = nav.standalone;
			if (ua.indexOf('Android') !== -1) {
				// 56对应的是Android Browser导航栏的高度
				page.style.height = window.innerHeight + 56 + 'px';
			} else if (/iPhone|iPod|iPad/.test(ua)) {
				// 60对应的是Safari导航栏的高度
				page.style.height = window.innerHeight + (isFullScreen ? 0 : 60) + 'px'
			}
			setTimeout(scrollTo, 0, 0, 1);
		}, false);
	}
}

function getHttpRequest(url, callback) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		// IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp = new XMLHttpRequest();
	} else {
		// IE6, IE5 浏览器执行代码
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			callback(xmlhttp);
		}
	}

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function gameLoader (gameObject, assertName) {
	var assertPath = "./assert/"+assertName+"/"

	var loaderFrame = function(sc) {
		var progress = sc.add.graphics();
		sc.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(0, gameObject.canvas.height / 2 -30, gameObject.canvas.width * value, 60);
		});

		sc.load.on('complete', function () {
			progress.destroy();
		});
	}

	var scene = {
		preload: function(){
			this.add.text(gameObject.canvas.width / 2, gameObject.canvas.height / 2, "Load Script...")
			.setOrigin(0.5).setColor("#000000").setFontSize(gameObject.canvas.width / 10);

			getHttpRequest(assertPath + 'main.js', function(xmlHttp) {
				eval(xmlHttp.responseText);
				gameInit(gameObject, assertPath);
				gameObject.scene.remove("loader");
			});
		},
	};

	gameObject.scene.add("loader", scene, true);
}
