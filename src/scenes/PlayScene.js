import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;
const VELOCITY = 200;

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
        // this.config = config;

        this.bird = null;
        this.pipes = null;

        this.pipeHorizontalDistance = 0;
        // this.pipeVertaicalDistanceRange = [150, 250];
        // this.pipeHorizonDistanceRange = [400, 450];
        this.flapVelocity = 300;

        this.score = 0;
        this.scoreText = '';
        this.isPaused = false 
        //this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy': {
                // khoảng cách 2 ông nước theo chiều dọc
                pipeVertaicalDistanceRange: [150, 200],
                // khoảng cách 2 ông nước theo chiều ngang
                pipeHorizonDistanceRange: [300, 350]
            },
            'normal': {
                pipeVertaicalDistanceRange: [140, 190],
                pipeHorizonDistanceRange:  [280, 330]
            },
            'hard': {
                pipeVertaicalDistanceRange: [120, 170],
                pipeHorizonDistanceRange:  [250, 300]
            }
        }
        this.markers = [
            { name: 'alien death', start: 1, duration: 1.0, config: {} },
            { name: 'boss hit', start: 3, duration: 0.5, config: {} },
            { name: 'escape', start: 4, duration: 3.2, config: {} },
            { name: 'meow', start: 8, duration: 0.5, config: {} },
            { name: 'numkey', start: 9, duration: 0.1, config: {} },
            { name: 'ping', start: 10, duration: 1.0, config: {} },
            { name: 'death', start: 12, duration: 4.2, config: {} },
            { name: 'shot', start: 17, duration: 1.0, config: {} },
            { name: 'squit', start: 19, duration: 0.3, config: {} }
        ];
    }

    create() {
        // create BG
        this.currentDifficulty = this.config.difficulty;
        super.create();

        this.createBird(); 
        this.createPipes(); 
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInput(); 
        this.createGoBack();
        this.listenToEvents();

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start: 8, end:15}),
            // 24 fps default, it will play animation consisiting of 24 frames in 1 seconds
            // it means 2 second wll play 8 frame (8/4 = 2 second)
            frameRate: 4,
            // số lần lặp lại vòng lặp
            repeat: -1
        })
        this.bird.play('fly');
    }
    
    update() {
        this.checkGameStatus();    
        this.recyclePipes();
    }

    listenToEvents() {
        if (this.pauseEvent) { return; }
        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions)
            .setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        });
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if (this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    createBird() {
        // middle of the height , 1/10 width
        // gắn vị trí ban đầu cho con chym
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
        .setFlipX(true)
        .setScale(3)     
        .setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);

        this.bird.setBodySize(this.bird.width, this.bird.height - 7)
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
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
        .setInteractive()
        .setScale(3)
        .setOrigin(1);

        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    handleInput() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    placePipe(uPipe, lPipe) {
        const difficulty = this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVertaicalDistanceRange);
        // 50 là chiều cao tối thiểu từ frame game đến mép thành ống nước
        const pipeVerticalPosition = Phaser.Math.Between(50, this.config.height - 50 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizonDistanceRange)
      
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
                    this.increaseDifficulty();
                }
            }
        })
    }

    increaseDifficulty() {
        if(this.score === 1) {
            this.currentDifficulty = 'easy';
        }
        else if(this.score === 3) {
            this.currentDifficulty = 'hard';
        }
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
        this.addAudioShutDown();

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
        if(this.isPaused) { return; }
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    increaseScore() {
        this.score++;``
        this.scoreText.setText(`Score: ${this.score}`);
        if(this.score > 0) {
            this.addAudioScore();
        }     
    }
    
    addAudioScore() {
        this.beamSound = this.sound.add("sfx");
        this.sound.play('sfx', this.markers[5]);
    }

    addAudioShutDown() {
        this.beamSound = this.sound.add("sfx");
        this.sound.play('sfx', this.markers[0]);
    }
}

export default PlayScene;