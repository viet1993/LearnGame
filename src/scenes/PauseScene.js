import BaseScene from './BaseScene';

class MenuScene extends BaseScene{
    constructor(config) {
        super('PauseScene', config);

        this.menu = [
            {scene: 'PlayScene', text: 'Continue'},
            {scene: 'MenuScene', text: 'Exit'}
        ]
    }

    create() {
        super.create();
        //this.scene.start('PlayScene');
        this.createMenu(this.menu, this.setUpMenuEvents.bind(this));
    }

    setUpMenuEvents(menuItem) {
        const textGO = menuItem.textGO;
        textGO.setInteractive();
       
        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        });

        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#fff'});
        });

        textGO.on('pointerup', () => {
            if(menuItem.scene && menuItem.text === "Continue") {
                // Shutting Playscreen, PauseScene and resume play screen
               this.scene.stop();
               this.scene.resume(menuItem.scene);
               this.physics.resume();
            }
            else {
                // Shutting Playscreen, PauseScene and running Menu
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        });
    }
}

export default MenuScene;