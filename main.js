var mainState = {
	preload: function () {
		game.load.image("player", "assets/player.png");
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');
		game.load.image('coin', 'assets/coin.png');
		game.load.image('enemy', 'assets/enemy.png');
	},

	create: function () {
		game.stage.backgroundColor = "#3498db";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.renderer.renderSession.roundPixels = true;
		this.player = game.add.sprite(game.width / 2, game.height / 2, "player");
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.player);
		//gravity of player
		this.player.body.gravity.y = 500;
		this.cursor = game.input.keyboard.createCursorKeys();
		//Create a group
		this.walls = game.add.group();
		this.enemies = game.add.group();
		//add physics to the gruop
		this.walls.enableBody = true;
		this.enemies.enableBody = true;
		//Create enemies
		this.enemies.createMultiple(20, 'enemy');
		//call 'addEnemy' in ... milisecond
		game.time.events.loop(2200, this.addEnemy, this);
		//Create 2 walls in the group
		game.add.sprite(0, 0, 'wallV', 0, this.walls);
		game.add.sprite(480, 0, 'wallV', 0, this.walls);
		//horizontal walls
		game.add.sprite(0, 0, 'wallH', 0, this.walls); //Top left
		game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
		game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
		game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
		game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
		game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);
		//Set all the wall to be moveable
		this.walls.setAll('body.immovable', true);
		//add coin
		this.coin = game.add.sprite(60, 140, 'coin');
		//add physics to the coin
		game.physics.arcade.enable(this.coin);
		//set the anchor point to it center
		this.coin.anchor.setTo(0.5, 0.5);
		//add text
		this.scoreLabel = game.add.text(30, 30, 'score: 0', {
			font: '18px Arial',
			fill: '#ffffff'
		});
		this.score = 0;
		game.add.text()
	},

	update: function () {
		game.physics.arcade.collide(this.player, this.walls);
		game.physics.arcade.collide(this.enemies, this.walls);
		this.movePlayer();
		if (!this.player.inWorld) {
			this.playerDie();
		}
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
	},

	movePlayer: function () {
		if (this.cursor.left.isDown) {
			this.player.body.velocity.x = -200;
		} else if (this.cursor.right.isDown) {
			this.player.body.velocity.x = 200;
		} else {
			this.player.body.velocity.x = 0;
		}
		if (this.cursor.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y = -320;
		}
	},

	playerDie: function () {
		game.state.start('main');
	},

	takeCoin: function () {
		//		this.coin.kill();
		this.score += 5;
		this.scoreLabel.text = 'score: ' + this.score;
		this.updateCoinPosition();
	},

	updateCoinPosition: function () {
		var coinPosition = [
			{
				x: 140,
				y: 60
			}, {
				x: 360,
				y: 60
			},
			{
				x: 50,
				y: 140
			}, {
				x: 440,
				y: 140
			},
			{
				x: 130,
				y: 300
			}, {
				x: 170,
				y: 300
			}
		];
		//get rid of current position
		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x == this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}
		//random pick from array
		var newPosition = game.rnd.pick(coinPosition);
		//set new position
		this.coin.reset(newPosition.x, newPosition.y);
	},

	addEnemy: function () {
		var enemy = this.enemies.getFirstDead();
		if (!enemy) {
			return;
		}
		if (!game.rnd.pick([0, 1])) {
			enemy.anchor.setTo(0.5, 1);
			enemy.reset(game.width / 2, game.height);
			enemy.body.gravity.y = -500;
		} else {
			enemy.anchor.setTo(0.5, 1);
			enemy.reset(game.width / 2, 0);
			enemy.body.gravity.y = 500;
		}
		enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	}
};
var game = new Phaser.Game(500, 340, Phaser.AUTO, "gameDiv");
game.state.add("main", mainState);
game.state.start("main");
