function gameInit (gameObject, assertPath, config) {
	var cards = [];
	var actions = [];
	var cardWidth = 300;
	var cardHeight = 417;

	var cardList = {
		b1 : {
			ATexture : "card1",
			AFrame : 0,
			BTexture : "card2",
			BFrame : 2,
		},
		b2 : {
			ATexture : "card1",
			AFrame : 1,
			BTexture : "card2",
			BFrame : 1,
		},
		b3 : {
			ATexture : "card1",
			AFrame : 2,
			BTexture : "card2",
			BFrame : 0,
		},
		b4 : {
			ATexture : "card1",
			AFrame : 3,
			BTexture : "card2",
			BFrame : 5,
		},
		b5 : {
			ATexture : "card1",
			AFrame : 4,
			BTexture : "card2",
			BFrame : 4,
		},
		b6 : {
			ATexture : "card1",
			AFrame : 5,
			BTexture : "card2",
			BFrame : 3,
		},
		b7 : {
			ATexture : "card1",
			AFrame : 6,
			BTexture : "card2",
			BFrame : 8,
		},
		b8 : {
			ATexture : "card1",
			AFrame : 7,
			BTexture : "card2",
			BFrame : 7,
		},
		b9 : {
			ATexture : "card1",
			AFrame : 8,
			BTexture : "card2",
			BFrame : 6,
		},
		b10 : {
			ATexture : "card3",
			AFrame : 1,
			BTexture : "card4",
			BFrame : 1,
		},
		b11 : {
			ATexture : "card3",
			AFrame : 4,
			BTexture : "card4",
			BFrame : 4,
		},
		b12 : {
			ATexture : "card3",
			AFrame : 7,
			BTexture : "card4",
			BFrame : 7,
		},
		b13 : {
			ATexture : "card3",
			AFrame : 0,
			BTexture : "card4",
			BFrame : 2,
		},
		b14 : {
			ATexture : "card3",
			AFrame : 2,
			BTexture : "card4",
			BFrame : 0,
		},
		b15 : {
			ATexture : "card3",
			AFrame : 3,
			BTexture : "card4",
			BFrame : 5,
		},
		b16 : {
			ATexture : "card3",
			AFrame : 5,
			BTexture : "card4",
			BFrame : 3,
		},
		b17 : {
			ATexture : "card3",
			AFrame : 6,
			BTexture : "card4",
			BFrame : 8,
		},
	}

	var gameData = {};

	function onResize() {
		var sp;
		var width = gameObject.canvas.width;
		var height = gameObject.canvas.height;

		var showHeight = cardHeight - cardWidth;

		if (width < height) {
			var ratioX = width / (cardWidth + 1.2 * cardHeight);
			var ratioY = height / (3 * cardHeight);
			var ratio = Math.min(ratioX, ratioY);


			var base1X = width / 2 - ratio * showHeight * 2;
			var base1Y = 0.48 * height - ratio * cardHeight / 2;

			var base2X = width / 2 - ratio * showHeight * 2;
			var base2Y = 0.52 * height + ratio * cardHeight / 2;

			var baseXR = base1X + ratio * (cardWidth - cardHeight) / 2;
			var baseYR = base1Y + ratio * (cardHeight - cardWidth) / 2;
			var stepR = ratio * showHeight;
		} else {
		}

		for (var id = 0; id < 4; id ++) {
			sp = cards[id];
			sp.x = baseXR + (4 - id) * stepR;
			sp.y = baseYR;
			sp.setScale(ratio);
		}

		sp = cards[4];
		sp.x = base2X;
		sp.y = base2Y;
		sp.setScale(ratio);

		sp = cards[7];
		sp.x = width - base2X;
		sp.y = base2Y;
		sp.setScale(ratio);

		sp = cards[5];
		sp.x = base1X;
		sp.y = base1Y;
		sp.setScale(ratio);

		sp = cards[6];
		sp.x = width - base1X;
		sp.y = base1Y;
		sp.setScale(ratio);

		for (var id = 0; id < 2; id++) {
			for (var ac = 0; ac < 4; ac++) {
				i = id * 4 + ac;
				sp = actions[i];

				sp.x = base2X + ratio * (cardWidth / 2 + 60 + ac * 120);
				sp.y = base2Y + ratio * (0.5 - id) * 120;
				sp.setScale(ratio);
			}
		}
	}

	function updateCard(sp, card, flip) {
		//console.log(sp)
		//console.log(card)
		//console.log(flip)
		if (card) {
			sp.setVisible(true);
			var detail = cardList[card.id];
			var face = card.face;
			if (flip) {
				face = 1 - face;
			}
			if (face == 0) {
				sp.setTexture(detail.ATexture, detail.AFrame);
			} else {
				sp.setTexture(detail.BTexture, detail.BFrame);
			}
			sp.angle = 90 * card.rotation;
		} else {
			sp.setVisible(false);
		}
	}

	function updateCards() {
		updateCard(cards[0], gameData.bRes[3]);
		updateCard(cards[1], gameData.bRes[2]);
		updateCard(cards[2], gameData.bRes[1]);
		updateCard(cards[3], gameData.bRes[0]);
		updateCard(cards[4], gameData.bDeck[0]);
		updateCard(cards[5], gameData.bDeck[1]);
		updateCard(cards[6]);
		updateCard(cards[7]);
	}

	function randDeck(deck) {
		var length = deck.length;
		for (var t = 0; t < length; t++) {
			var pos = Math.floor(length * Math.random());
			var s = deck.splice(pos, 1);
			deck.push(s[0]);
		}

		//gameData.bRes.push(gameData.bDeck[15]);
		//gameData.bDeck[15].rotation = 1;
	}

	function unflip(id) {

	}

	var scene = {
		preload: function(){
			loaderFrame(this);


			/*
			var progress = this.add.graphics();
			this.load.on('progress', function (value) {
				progress.clear();
				progress.fillStyle(0xffffff, 1);
				progress.fillRect(0, gameObject.canvas.height / 2 -30, gameObject.canvas.width * value, 60);
			});
			this.load.on('complete', function () {
				progress.destroy();
			});
*/

			this.load.spritesheet('card1', assertPath + '001.png', { frameWidth: cardWidth, frameHeight: cardHeight});
			this.load.spritesheet('card2', assertPath + '002.png', { frameWidth: cardWidth, frameHeight: cardHeight});
			this.load.spritesheet('card3', assertPath + '003.png', { frameWidth: cardWidth, frameHeight: cardHeight});
			this.load.spritesheet('card4', assertPath + '004.png', { frameWidth: cardWidth, frameHeight: cardHeight});
			this.load.spritesheet('action', assertPath + 'action.png', { frameWidth: 60, frameHeight: 60});
		},
		create: function(){
			gameData.bDeck = [];
			gameData.bRes = [];
			gameData.bSel = [0, 0, 0, 0];
			for (var id = 1; id <= 16; id++) {
				gameData.bDeck.push({id : 'b'+id, face : 0, rotation : 0});
			}

			randDeck(gameData.bDeck);
			gameData.bDeck.push({id : 'b17', face : 0, rotation : 0});

			for (var id = 0; id < 8; id++) {
				var sp = this.add.sprite(0, 0, 'card1', 0);
				sp.setDataEnabled();
				 
				if (id < 6) {
					sp.setInteractive();
					if (id < 4) {
						sp.data.set('type', 'res');
						sp.data.set('id', 3 - id);
					} else {
						sp.data.set('type', 'card');
						sp.data.set('id', id - 4);
					}
				}
				
				cards.push(sp);
			}

			for (var id = 0; id < 2; id++) {
				for (var ac = 0; ac < 4; ac++) {
					var sp = this.add.sprite(0, 0, 'action', ac * 2);
					sp.setDataEnabled();
					sp.data.set('type', 'action');
					sp.data.set('id', id);
					sp.data.set('ac', ac);
					sp.setInteractive();
					actions.push(sp);
				}
			}

			onResize();
			updateCards();

			this.input.on('gameobjectdown', function (pointer, gameObject) {
				var type = gameObject.data.get('type');

				if (type == 'res') {
					var id = gameObject.data.get('id');
					if (gameData.bSel[id]) {
						gameData.bSel[id] = 0;
						cards[3 - id].setTint(0xffffff);
					} else {
						gameData.bSel[id] = 1;
						cards[3 - id].setTint(0x7f7f7f);
					}
				} else if (type == 'card') {
					var id = gameObject.data.get('id');
					updateCard(cards[7 - id], gameData.bDeck[id], true);
				} else if (type == 'action') {
					var id = gameObject.data.get('id');
					var ac = gameObject.data.get('ac');
					var s = gameData.bDeck.splice(id, 1)[0];
					if (ac == 0) {
						s.rotation += 1;
						gameData.bRes.push(s);
					} else if (ac == 1) {
						s.rotation += 2;
					} else if (ac == 2) {
						s.face = 1 - s.face;
					}

					for (var id = gameData.bSel.length; id >= 0; id--) {
						if (gameData.bSel[id]) {
							var r = gameData.bRes.splice(id, 1)[0];
							r.rotation -= 1;
							cards[3 - id].setTint(0xffffff);
							gameData.bSel[id] = 0;
						}
					}

					gameData.bDeck.push(s);
					updateCards();
				}
			}, this);

			this.input.on('pointerup', function (pointer, gameObject) {
				updateCard(cards[6]);
				updateCard(cards[7]);
			}, this);
		},
		update: function(){},
	};

gameObject.scene.add("111", scene, true);
}
