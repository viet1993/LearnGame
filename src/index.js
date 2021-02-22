
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let bird = null;

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

function create () {
  // trục x, trục y, key value of image
  this.add.image(0, 0, 'sky').setOrigin(0);
  // middle of the height , 1/10 width
  bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, 'bird').setOrigin(0)

  bird.body.gravity.y = 200
  //debugger
}

// 60 fps (frame per seconds)
function update (time, data) {
  //console.log(bird.body.gravity.y)
}

new Phaser.Game(config);