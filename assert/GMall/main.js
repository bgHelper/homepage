var gameInit = function(gameObject) {
	var mode = "list";


	var loadGame = function(id) {
		gameObject.scene.remove("main");
		gameLoader(gameObject, id);
	}

	var scene = {
		preload: function(){
			loaderSet(this, "游戏大厅");

			this.load.json('list', 'list.json');
			//this.load.spritesheet('token', 'token.png', { frameWidth: 100, frameHeight: 100});
		},
		create: function(){
			var list = this.cache.json.get('list');
			
			var width = gameObject.canvas.width;
			var height = gameObject.canvas.height;

			var baseY = height / 10;
			var stepY = height / 10;


			for(id in list) {
				var item = list[id];
				var sp = this.add.rectangle(width/2, baseY, 0.8 * width, 0.8 * stepY, 0x707070);
				sp.setInteractive();
				/*
				sp.setInteractive({
					//draggable:true,
					//useHandCursor:true,
					pixelPerfect:true,
				});*/
				sp.setDataEnabled();
				sp.data.set('gameId', id);

				this.add.text(width / 2 , baseY, item.name)
					.setOrigin(0.5).setColor("#ffffff").setFontSize(stepY / 2);
				baseY += stepY;
			}

			this.input.once('gameobjectdown', function (pointer, sp) {
				var id = sp.data.get('gameId');
				gameObject.scene.remove("main");
				gameLoader(gameObject, id);
			}, this);
				

			//this.input.setDraggable(sp)

/*
			this.input.on('dragstart', function (pointer, gameObject) {
				//gameObject.setFrame(gameObject.data.get('side') * 2 + 1);
			});

			this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
				gameObject.x = dragX;
				gameObject.y = dragY;
			});

			this.input.on('dragend', function (pointer, gameObject) {
				//gameObject.setFrame(gameObject.data.get('side') * 2);
			});
*/
		},
		update: function(){
		},
	};

	gameObject.scene.add("main", scene, true);
}
