import BaseScene from './BaseScene';

class MenuScene extends BaseScene{
    constructor(config) {
        super('MenuScene', config);

        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'OptionScene', text: 'Option'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: null, text: 'Exit'}
        ]
    }

    create() {
        super.create();

        this.add.text(16, 16, `Difficult: ${this.config.difficulty}`, {fontSize:`16px`})
        .setOrigin(0)

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
           menuItem.scene && this.scene.start(menuItem.scene);

           if(menuItem.text === 'Exit') {
               this.game.destroy(true);
           }
        });
    }
}

export default MenuScene;