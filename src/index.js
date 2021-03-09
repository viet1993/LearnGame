
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 2800,
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
const PIPES_TO_RENDER = 4;

let bird = null;
let upperPipe = null;
let lowerPipe = null;

const pipeVertaicalDistanceRange = [150, 250];
let pipeHorizontalDistance = 250;
let pipeVertaicalDistance = Phaser.Math.Between(pipeVertaicalDistanceRange[0], pipeVertaicalDistanceRange[1]);

let flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2}

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create () {
  // trục x, trục y, key value  of image
  this.add.image(0, 0, 'sky').setOrigin(0);
  // middle of the height , 1/10 width
  // gắn vị trí ban đầu cho con chym
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    // gắn vị trí ông nước ban đầu
    upperPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0, 1);
    lowerPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }
  
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

function restartBirdPosition () {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
}

function placePipe (uPipe, lPipe) {
  pipeHorizontalDistance += 400;
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVertaicalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(50, config.height - 50 - pipeVerticalDistance);
  
  // gắn vị trí ông nước trên phia đầu
  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticalDistance;

  lPipe.x = uPipe.x;
  lPipe.y =  uPipe.y + pipeVerticalDistance;
  
  // vận tốc ống nước
  uPipe.body.velocity.x = -200;
  lPipe.body.velocity.x = -200;
}

function flap () {
  bird.body.velocity.y = -flapVelocity;
  console.log(bird.y)
  //debugger
}


new Phaser.Game(config);