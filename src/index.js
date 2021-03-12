
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
const PIPES_TO_RENDER = 4;

let bird = null;
let pipes = null;
// khoảng cách giữa 2 ống nước trong khoảng 150 - 250
const pipeVertaicalDistanceRange = [150, 250];
const pipeHorizonDistanceRange = [400, 450];

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

  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    // gắn vị trí ông nước ban đầu
    let upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    let lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-VELOCITY);
  
  this.input.on('pointerdown',flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

// if bird position x is same or larger than width of canvas go back the left
// if bird position x is smaller or equal to 0 then move back to the right
function update(time, delta) {
  if (bird.y > config.height || bird.y < - bird.height ) {
    restartBirdPosition();
  }
  
  recyclePipes();
}

function restartBirdPosition () {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
}

function placePipe (uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVertaicalDistanceRange);
  // 50 là chiều cao tối thiểu từ frame game đến mép thành ống nước
  const pipeVerticalPosition = Phaser.Math.Between(50, config.height - 50 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizonDistanceRange)

  // gắn vị trí ông nước trên phia đầu
  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;
  // gắn vị trí ông nước trên phia dưới
  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      // recycle pipe
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  })
}

// tính toán khoảng cách ngẫu nhiên của ống nước
function getRightMostPipe() {
  let rightMostX = 0;
  pipes.getChildren().forEach(pipe => {
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}

function flap () {
  bird.body.velocity.y = -flapVelocity;
}


new Phaser.Game(config);