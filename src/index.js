
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
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
let upperPipe = null;
let lowerPipe = null;

let flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2}

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create () {
  // trục x, trục y, key value of image
  this.add.image(0, 0, 'sky').setOrigin(0);
  // middle of the height , 1/10 width
  // gắn vị trí ban đầu cho con chym
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;
  
  //gắn vị trí ông nước trên phia đầu
  upperPipe = this.physics.add.sprite(400, 100, 'pipe').setOrigin(0, 1);
  lowerPipe = this.physics.add.sprite(400, upperPipe.y  + 100, 'pipe').setOrigin(0, 0);
  
  this.input.on('pointerdown',flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

// if bird position x is same or larger than width of canvas go back the left
// if bird position x is smaller or equal to 0 then move back to the right
function update(time, delta) {
  if (bird.y > config.height || bird.y < - bird.height ) {
    restartBirdPosition();
  }
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
}

function flap () {
  bird.body.velocity.y = -flapVelocity;
  console.log(bird.y)
  //debugger
}


new Phaser.Game(config);