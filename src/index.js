
import Phaser from 'phaser';
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';
import OptionScene from './scenes/OptionScene';

const WIDTH = 400; 
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2};

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
  difficulty: 'easy'
}

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene, OptionScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  // WebGL ( Web graphics library ) JS API for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    }
  },
  scene: initScenes()
}


new Phaser.Game(config);