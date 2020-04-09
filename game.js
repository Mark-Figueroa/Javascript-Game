// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var gameoverMessage;
var won = false;
var gameover = false;
var currentScore = 0;
var winningScore = 100;
var gameoverScore = -20;


// add collectable items to the game
function addItems() {
    items = game.add.physicsGroup();
    // lower
    createItem(200, 500, 'coin');
    createItem(475, 400, 'coin'); //center
    createItem(475, 570, 'poison');
    createItem(675, 500, 'coin');
    createItem(775, 500, 'poison')


    // upper
    createItem(100, 20, 'star');
    createItem(200, 150, 'coin');
    createItem(430, 153, 'poison');
    createItem(575, 80, 'coin'); //center
    createItem(695, 153, 'poison');
    createItem(875, 150, 'coin');

    // Mid
    createItem(30, 300, 'coin');
    createItem(550, 250, 'coin'); //center
    createItem(930, 300, 'coin');
}

// add platforms to the game
function addPlatforms() {
    platforms = game.add.physicsGroup();

    // lower
    platforms.create(200, 550, 'platform2');
    platforms.create(390, 450, 'platform2'); //center
    platforms.create(550, 550, 'platform2');

    // upper
    platforms.create(100, 70, 'platform2');
    platforms.create(200, 200, 'platform');
    platforms.create(490, 125, 'platform'); //center
    platforms.create(750, 200, 'platform');

    //mid
    platforms.create(20, 350, 'platform');
    platforms.create(490, 300, 'platform'); //center
    platforms.create(800, 350, 'platform');
    platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
    var item = items.create(left, top, image);
    item.animations.add('spin');
    item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
    badges = game.add.physicsGroup();
    var badge = badges.create(750, 400, 'badge');
    badge.animations.add('spin');
    badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
    item.kill();
    if (item.key === 'coin') {
        currentScore = currentScore + 10;
    } else if (item.key === 'poison') {
        currentScore = currentScore - 25;
    }

    if (item.key === 'star') {
        currentScore = currentScore + (winningScore - currentScore);
    }

    if (currentScore <= gameoverScore) {
        player.kill();
        gameover = true;
    }

    if (currentScore === winningScore) {
        createBadge();
    }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
    badge.kill();
    won = true;
}

// setup game when the web page loads
window.onload = function() {
    game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    // before the game begins
    function preload() {
        game.stage.backgroundColor = '#5db1ad';

        //Load images
        game.load.image('platform', 'platform_1.png');
        game.load.image('platform2', 'platform_2.png');

        //Load spritesheets
        game.load.spritesheet('player', 'mikethefrog.png', 32, 32);
        game.load.spritesheet('coin', 'coin.png', 36, 44);
        game.load.spritesheet('badge', 'badge.png', 42, 54);
        game.load.spritesheet('poison', 'poison.png', 32, 32);
        game.load.spritesheet('star', 'star.png', 32, 32);
    }

    // initial game set up
    function create() {
        player = game.add.sprite(50, 600, 'player');
        player.animations.add('walk');
        player.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 500;

        addItems();
        addPlatforms();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
        winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
        winningMessage.anchor.setTo(0.5, 1);
        gameoverMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
        gameoverMessage.anchor.setTo(0.5, 1);
    }

    // while the game is running
    function update() {
        text.text = "SCORE: " + currentScore;
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, items, itemHandler);
        game.physics.arcade.overlap(player, badges, badgeHandler);
        player.body.velocity.x = 0;

        // is the left cursor key presssed?
        if (cursors.left.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = -300;
            player.scale.x = -1;
        }
        // is the right cursor key pressed?
        else if (cursors.right.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = 300;
            player.scale.x = 1;
        }
        // player doesn't move
        else {
            player.animations.stop();
        }

        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -400;
        }
        // when the player winw the game
        if (won) {
            winningMessage.text = "YOU WIN!!!";
        }
        if (gameover) {
            gameoverMessage.text = "Game Over!";
        }
    }

    function render() {

    }

};