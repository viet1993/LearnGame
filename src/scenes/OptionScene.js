import BaseScene from './BaseScene';

class OptionScene extends BaseScene{
    constructor(config) {
        super('OptionScene', config);
        this.menu = [
            {scene: 'Easy', text: 'Easy'},
            {scene: 'Normal', text: 'Normal'},
            {scene: 'Hard', text: 'Hard'}
        ]
    }

    create() {
        super.create();
        this.createGoBack();
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
            if(menuItem.text === 'Easy') {
                this.config.difficulty = 'easy';
            }
            else if (menuItem.text === 'Normal') {
                this.config.difficulty = 'normal';
            }
            else {
                this.config.difficulty = 'hard';
            }
            menuItem.scene && this.scene.start('MenuScene');
        });
    }
}

export default OptionScene;