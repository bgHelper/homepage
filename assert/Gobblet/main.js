var gameInit = function(gameObject) {
	var config = "adv";

	var gameData = {};
	var scene = {
		preload: function(){
			loaderSet(this, "棋迹连连");

			this.load.spritesheet('token', 'token.png', { frameWidth: 50, frameHeight: 50});
		},
		create: function(){
			var width = gameObject.canvas.width;
			var height = gameObject.canvas.height;

			var baseSize = Math.min(width, height);
			var cx = width / 2;
			var cy = height / 2;

			var gridNum = 3;
			var tokenMaxValue = 3;
			var tokenPerValue = 2;
			if (config == "adv") {
				gridNum += 1;
				tokenMaxValue += 1;
				tokenPerValue += 1;
			}

			var gridSize = baseSize / (gridNum + 0.2);
			var lineSize = baseSize / 100;
			var zoneSize = 0.9 * (gridSize - lineSize);
			var ratio = zoneSize / 55;

			var graphics = this.add.graphics();
			graphics.lineStyle(lineSize, 0x000000);
			for (var i = 1; i < gridNum; i++) {
				graphics.lineBetween(cx + (i - gridNum / 2) * gridSize, cy - gridNum * gridSize / 2, 
					cx + (i - gridNum / 2) * gridSize, cy + gridNum * gridSize / 2);
				graphics.lineBetween(cx - gridNum * gridSize / 2, cy + (i - gridNum / 2) * gridSize,
					cx + gridNum * gridSize / 2, cy + (i - gridNum / 2) * gridSize);
			}

			gameData.grid = [];
			for (var i = 0; i < gridNum; i++) {
				gameData.grid[i] = [];
				for (var j = 0; j < gridNum; j++) {
					var gcx = cx + (i - (gridNum - 1) / 2) * gridSize;
					var gcy = cy + (j - (gridNum - 1) / 2) * gridSize;

					var zone = this.add.rectangle(gcx, gcy, zoneSize, zoneSize);
					zone.setDataEnabled();
					zone.data.set('i', i);
					zone.data.set('j', j);

					zone.setInteractive();
					zone.input.dropZone = true;

					gameData.grid[i][j] = {
						zone : zone,
						item : [],
					};
				}
			}

			gameData.token = [];
			for (var player = 0; player < 2; player++) {
				gameData.token[player] = {
					sp : []
				};
				for (var value = 1; value <= tokenMaxValue; value++) {
					if (height > width) {
						var sx = cx + (value - (gridNum - 1) / 2 - 1) * gridSize;
						var sy = cy + (player - 0.5) * (gridNum + 2) * gridSize;	
					} else {
						var sx = cx + (player - 0.5) * (gridNum + 2) * gridSize;
						var sy = cy + (value - (gridNum - 1) / 2 - 1) * gridSize;
					}
					for (var i = 0; i < tokenPerValue; i++) {
						var sp = this.add.sprite(sx, sy, 'token', player * 4 + value - 1);
						sp.setInteractive({
							draggable:true,
							pixelPerfect:true,
						});

						sp.setDataEnabled();
						sp.data.set('value', value);
						sp.data.set('player', player);
						sp.data.set('oi', -1);

						sp.setScale(ratio);
						gameData.token[player].sp.push(sp);
					}
				}
				if (height > width) {
					var rt = this.add.rectangle(width / 2, player * (height - 20), width, 20, 0xffffff * (1 - player));
				} else {
					var rt = this.add.rectangle(player * (width - 20), height / 2, 20, height, 0xffffff * (1 - player));
				}				
				gameData.token[player].rect = rt;
			}

			var getGridValue = function(x, y) {
				var gi = gameData.grid[x][y].item;
				if (gi.length) {
					return gi[0].data.get("value");
				} else {
					return 0;
				}
			}

			var getGridPlayer = function(x, y) {
				var gi = gameData.grid[x][y].item;
				if (gi.length) {
					return gi[0].data.get("player");
				} else {
					return -1;
				}
			}

			var setPlayerState = function(player, state) {
				var tk = gameData.token[player];
				for (var key in tk.sp) {
					var sp = tk.sp[key];
					sp.input.enabled = state;
				}
				tk.rect.setVisible(state);
			}

			var changePlayer = function() {
				setPlayerState(gameData.currentPlayer, true);
				setPlayerState(1 - gameData.currentPlayer, false);
			}

			var checkWinner = function(x, y) {				
				var gp = getGridPlayer(x, y);
				if (gp < 0) {
					return false;
				}

				var winner = true;
				for (var i = 0; i < gridNum; i++) {
					var lgp = getGridPlayer(i, y);
					if (lgp != gp) {
						winner = false;
						break;
					}
				}
				if (winner) {
					return gp;
				}

				winner = true;
				for (var i = 0; i < gridNum; i++) {
					var lgp = getGridPlayer(x, i);
					if (lgp != gp) {
						winner = false;
						break;
					}
				}				
				if (winner) {
					return gp;
				}

				if (x == y) {
					winner = true;
					for (var i = 0; i < gridNum; i++) {
						var lgp = getGridPlayer(i, i);
						if (lgp != gp) {
							winner = false;
							break;
						}
					}
					if (winner) {
						return gp;
					}
				}

				if (x + y == gridNum - 1) {
					winner = true;
					for (var i = 0; i < gridNum; i++) {
						var lgp = getGridPlayer(i, gridNum - 1 - i);
						if (lgp != gp) {
							winner = false;
							break;
						}
					}
					if (winner) {
						return gp;
					}
				}
				return -1;
			}

			gameData.currentPlayer = 0;
			changePlayer();

			this.input.on('dragstart', function (pointer, sp) {
				sp.data.set('ox', sp.x);
				sp.data.set('oy', sp.y);
				for (var i = 0; i < gridNum; i++) {
					for (var j = 0; j < gridNum; j++) {
						if (sp.data.get("value") > getGridValue(i, j)) {
							var zone = gameData.grid[i][j].zone;
							zone.setStrokeStyle(lineSize, 0x00FF00);
						}
					}
				}

				sp.setDepth(1);
			});

			this.input.on('dragenter', function (pointer, sp, dropZone) {
				var i = dropZone.data.get("i");
				var j = dropZone.data.get("j");
				var zone = gameData.grid[i][j].zone;
				var c = 0xFF0000
				if (sp.data.get("value") > getGridValue(i, j)) {
					c = 0x0000FF;
				}
				zone.setStrokeStyle(lineSize, c);
			});

			this.input.on('dragleave', function (pointer, sp, dropZone) {
				var i = dropZone.data.get("i");
				var j = dropZone.data.get("j");
				var zone = gameData.grid[i][j].zone;
				if (sp.data.get("value") > getGridValue(i, j)) {
					zone.setStrokeStyle(lineSize, 0x00FF00);
				} else {
					zone.setStrokeStyle(0, 0x000000);	
				}
			});

			this.input.on('drag', function (pointer, sp, dragX, dragY) {
				sp.x = dragX;
				sp.y = dragY;
			});

			this.input.on('dragend', function (pointer, sp, dropped) {
				if (!dropped) {
					sp.x = sp.data.get('ox');
					sp.y = sp.data.get('oy');	
				}

				for (var i = 0; i < gridNum; i++) {
					for (var j = 0; j < gridNum; j++) {
						if (sp.data.get("value") > getGridValue(i, j)) {
							var zone = gameData.grid[i][j].zone;
							zone.setStrokeStyle(0, 0x00FF00);
						}
					}
				}

				sp.setDepth(0);				
			});

			//var winnerBar = this.add.text(cx, cy).setOrigin(0.5).setColor("#000000").setFontSize(gameObject.canvas.width / 10);

			this.input.on('drop', function (pointer, sp, dropZone) {
				var i = dropZone.data.get("i");
				var j = dropZone.data.get("j");
				if (sp.data.get("value") > getGridValue(i, j)) {
					sp.x = dropZone.x;
					sp.y = dropZone.y;				

					var oi = sp.data.get('oi');
					var oj = sp.data.get('oj');

					var winner = -1;
					if (oi > 0)  {
						gameData.grid[oi][oj].item.shift();	
						winner = checkWinner(oi, oj);
					}
					gameData.grid[i][j].item.unshift(sp);
					sp.data.set('oi', i);
					sp.data.set('oj', j);

					if (winner < 0) {
						winner = checkWinner(i, j);	
					}

					if (winner >= 0) {
						sp.scene.add.rectangle(cx, cy, 0.8 * width, width / 5, 0xffffff);
						var bar = sp.scene.add.text(cx, cy).setOrigin(0.5).setColor("#000000").setFontSize(width / 10)
						if (winner == 0) {
							bar.setText("白方获胜");
						} else {
							bar.setText("黑方获胜");
						}

						setPlayerState(0, false);
						setPlayerState(1, false);
					} else {
						gameData.currentPlayer = 1 - gameData.currentPlayer;
						changePlayer();
					}
				} else {
					sp.x = sp.data.get('ox');
					sp.y = sp.data.get('oy');
				};
				dropZone.setStrokeStyle(0, 0x000000);
			});
		},
		update: function(){
		},
	};

	gameObject.scene.add("main", scene, true);
}
