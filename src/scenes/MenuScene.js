import BaseScene from './BaseScene';

class MenuScene extends BaseScene{
    constructor(config) {
        super('MenuScene', config);

        this.menu = [
            {scene: 'PlayScene', text:'Play'},
            {scene: 'Score', text:'Score'},
            {scene: null, text:'Exit'}
        ]
    }

    create() {
        super.create();
        //this.scene.start('PlayScene');
        this.createMenu(this.menu);
    }
}

export default MenuScene;