// Lib
const Mathabs = Math.abs;

// configSize
const cS = {
  w: 10000,
  h: 1000,
  vw: window.innerWidth,
  vh: window.innerHeight,
  vwo: window.innerWidth / 2,
  vho: window.innerHeight / 2
};

const config = {
  type: Phaser.AUTO,
  width: cS.w,
  height: cS.h,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 600},
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const game = new Phaser.Game(config);

let player;
let platforms;
let input;
let cursors;
let tests;
function preload() {
  this.load.image('sky', './assets/sky.png');
  this.load.image('ground', './assets/ground.png');
  this.load.image('wall', './assets/wall.png');
  this.load.image('bg1', './assets/bg1.png');
  this.load.image('test', './assets/test.png');
  this.load.spritesheet('dude', './assets/dude.png', {frameWidth: 128, frameHeight: 240});
}
function create() {
  // Camera
  this.cameras.main.setBounds(0, 0, cS.w, cS.h);
  this.cameras.main.setSize(cS.vw, cS.vh);

  // Background
  const bg = this.add.image(400, 300, 'sky');
  bg.scaleX = 25;
  bg.scaleY = 20;

  // First scene
  const bg1 = this.add.image(0, cS.h + 40, 'bg1');
  bg1.setOrigin(0, 1);

  // Platforms
  platforms = this.physics.add.staticGroup();
  // Ground
  const floor = platforms.create(0, cS.h, 'ground');
  floor.setOrigin(0, 1);
  floor.scaleX = Math.floor(cS.w / floor.width) + 1;
  floor.refreshBody();
  // Walls
  // platforms.create(600, cS.h - 350, 'wall').setOrigin(0, 1).setScale(1, 1.6).refreshBody();
  // platforms.create(600, cS.h - 550, 'ground').setOrigin(0, 1).setScale(9, 1).refreshBody();
  // platforms.create(1736, cS.h - 350, 'wall').setOrigin(0, 1).setScale(1, 1.6).refreshBody();
  // platforms.create(1737, cS.h - 350, 'ground').setOrigin(0, 1).setScale(10, 1).refreshBody();
  // platforms.create(2520, cS.h - 350, 'wall').setOrigin(0, 1).setScale(1, 1.6).refreshBody();

  // Tests objects
  tests = this.physics.add.staticGroup();
  const test1 = tests.create(1150, cS.h-350, 'test');
  const test2 = tests.create(1500, cS.h-350, 'test');
  const test3 = tests.create(1800, cS.h-350, 'test');
  const test4 = tests.create(2100, cS.h-350, 'test');


  // The layer and its settings
  player = this.physics.add.sprite(10, cS.h-200, 'dude');
  // Physics properties
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  // Animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [{key: 'dude', frame: 4}],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 7}),
    frameRate: 10,
    repeat: -1
  });
  player.anims.play('turn');

  // Input Events
  cursors = this.input.keyboard.createCursorKeys();
  input = this.input.keyboard;

  // Colliders
  this.physics.add.collider(player, platforms);

  // Overlaps
  this.physics.add.overlap(player, tests, interactTest, null, this);
}
function update() {
  // Movements
  if (cursors.left.isDown) {
    // Left Move
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    // Right Move
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else if (Mathabs(player.body.velocity.x) > 0) {
    // Standing
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  // Jump
  if ((cursors.space.isDown || cursors.up.isDown) && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  // Camera follow
  if (Mathabs(player.body.velocity.x) > 5 || Mathabs(player.body.velocity.y) > 5) {
    this.cameras.main.scrollX = player.x - cS.vwo;
    this.cameras.main.scrollY = player.y - cS.vho;
  }
}

// Tests handler
const testModal = $('#myModal');
let testModalIsVisible = false;
let testObject;
testModal.on('hidden.bs.modal', function (e) {
  input.enabled = true;
  testObject.disableBody(true, true);
  testObject = null;
  testModalIsVisible = false;
});
function interactTest(player, test) {
  if (!testModalIsVisible) {
    // Save the test
    testObject = test;
    // Disable inputs
    input.enabled = false;
    for (let i = 0; i < input.keys.length; i++) {
      let key = input.keys[i];
      if (key) {
        key.isDown = false;
      }
    }
    // Trigger the modal
    testModalIsVisible = true;
    testModal.modal();
  }
}