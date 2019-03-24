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

function setTitle(name) {
	document.getElementsByTagName("title")[0].text = name;
}

function gameCreater() {
	var gameObject = new Phaser.Game({
		type: Phaser.AUTO,
		//width: "100%",		
		//height: "100%",
		width : document.documentElement.clientWidth,
		height : document.documentElement.clientHeight,
		backgroundColor : 0xd6ecf0,
	});

	/*
	var backgroundScene = {
		create: function() {
			this.add.graphics().fillStyle(0xd6ecf0, 1).fillRect(0, 0, gameObject.canvas.width, gameObject.canvas.height);
		},
	};

	gameObject.scene.add("background", backgroundScene, true);
	*/

	var loadScene = {
		preload: function(){
			var title = this.add.text(gameObject.canvas.width / 2 , gameObject.canvas.height / 2 - 40, "加载中...")
			.setOrigin(0.5, 1).setColor("#000000").setFontSize(gameObject.canvas.width / 10);

			this.events.on("setTitle", function(gameName) {
				setTitle(gameName);
				title.setText(gameName);
			});

			var progress = this.add.graphics();
			this.events.on("loadProcess", function(value) {
				progress.clear();
				progress.fillStyle(0x000000, 1);
				progress.fillRect(0, gameObject.canvas.height / 2 - 30, gameObject.canvas.width * value, 60);
			});
		},
	};

	gameObject.scene.add("loader", loadScene, true);
	return gameObject;
}

function gameLoader (gameObject, gameId) {
	var assertPath = "./assert/"+gameId;
	var title;

	var loaderSet = function(sc, gameName) {
		gameName = gameName || "";
		gameObject.scene.wake("loader");
		var lc = gameObject.scene.getScene("loader");
		lc.events.emit("setTitle", gameName);
		sc.load.on('progress', function (value) {
			lc.events.emit("loadProcess", value);
		});
		sc.load.on('complete', function () {
			gameObject.scene.sleep("loader");
		});

		sc.load.setPath(assertPath);
	}

	getHttpRequest(assertPath + '/main.js', function(xmlHttp) {
		eval(xmlHttp.responseText);
		gameInit(gameObject);
	});
}

function gameResize(gameObject) {
	//gameObject.canvas.width = document.documentElement.clientWidth;
	//gameObject.canvas.height = document.documentElement.clientHeight;

	//for (var key in gameObject.scene.scenes) {
	//	var sc = gameObject.scene.scenes[key];
	//	sc.events.emit("resize");
	//}
}
