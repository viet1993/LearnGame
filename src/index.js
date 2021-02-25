
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const VELOCITY = 200;

let bird = null;
let flapVelocity = 250;
let totalDelta = null;

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

function create () {
  // trục x, trục y, key value of image
  this.add.image(0, 0, 'sky').setOrigin(0);
  // middle of the height , 1/10 width
  bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, 'bird').setOrigin(0);
  
  this.input.on('pointerdown',flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

// if bird position x is same or larger than width of canvas go back the left
// if bird position x is smaller or equal to 0 then move back to the right
function update(time, delta) {
  if(bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -VELOCITY;
  }
  else if (bird.x <= 0) {
    bird.body.velocity.x = VELOCITY;
  }
}

function flap () {
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);