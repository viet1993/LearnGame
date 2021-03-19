import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;
const VELOCITY = 200;

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.bird = null;
        this.pipes = null;

        this.pipeHorizontalDistance = 0;
        this.pipeVertaicalDistanceRange = [150, 250];
        this.pipeHorizonDistanceRange = [400, 450];
        this.flapVelocity = 300;

        this.score = 0;
        this.scoreText = '';
    }

    create() {
        this.createBG(); 
        this.createBird(); 
        this.createPipes(); 
        this.createColliders();
        this.createScore();
        this.createPause();
        // this.createResume();
        this.handleInput(); 
    }
    
    update() {
        this.checkGameStatus();    
        this.recyclePipes();
    }

    createBG() {
        // trục x, trục y, key value  of image
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird() {
        // middle of the height , 1/10 width
        // gắn vị trí ban đầu cho con chym
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {      
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            // gắn vị trí ông nước ban đầu
            const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1);
            const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 0);
        
            this.placePipe(upperPipe, lowerPipe);
        }
        
        this.pipes.setVelocityX(-VELOCITY);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this); 
    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, {fontSize:'32px', fill: '#000'});
        this.add.text(16, 52, `Best score: ${bestScore || 0}`, {fontSize:`18px`, fill:`#000`});
    }

    createPause() {
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
        .setInteractive()
        .setScale(3)
        .setOrigin(1);

        pauseButton.on('pointerdown', () => {
            this.physics.pause();
            this.scene.pause();

        });
    }

    createResume() {
        const playButton = this.add.image(this.config.width - 10, this.config.height - 10, 'play')
        .setInteractive()
        .setScale(3)
        .setOrigin(1);

        playButton.on('pointerdown', () => {
            this.physics.resume();
            this.scene.resume();
        });
    }

    handleInput() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    placePipe(uPipe, lPipe) {
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVertaicalDistanceRange);
        // 50 là chiều cao tối thiểu từ frame game đến mép thành ống nước
        const pipeVerticalPosition = Phaser.Math.Between(50, this.config.height - 50 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizonDistanceRange)
      
        // gắn vị trí ông nước trên phia đầu
        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
        // gắn vị trí ông nước trên phia dưới
        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance;
    }

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0 ) {
            this.gameOver();
        }
    }
      
    recyclePipes() {
        const tempPipes = [];

        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                // recycle pipe
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.placePipe(...tempPipes);
                    this.increaseScore();
                    this.setBestScore();
                }
            }
        })
    }

    setBestScore() {
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if(!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xeb4034);
        this.setBestScore();

        this.time.addEvent({
            delay:1000,
            callback: ()=> {
                this.scene.restart();
            },
            loop:false
        })
    }
      
    // tính toán khoảng cách ngẫu nhiên của ống nước
    getRightMostPipe() {
        let rightMostX = 0;

        this.pipes.getChildren().forEach(pipe => {
          rightMostX = Math.max(pipe.x, rightMostX);
        });

        return rightMostX;
    }
      
    flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}

export default PlayScene;