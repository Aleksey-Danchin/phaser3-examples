import * as Phaser from 'phaser'

import GameScene from './GameScene'
import gameConfig from './gameConfig'

const config = {
	width: 800,
	height: 600,
	pixelArt: true,
	scene: [GameScene],
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: {
				y: 0,
				x: 0
			}
		}
	}
}

const game = new Phaser.Game(config)

export default game