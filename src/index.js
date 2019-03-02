import * as Phaser from 'phaser'

import MainScene from './MainScene'

const config = {
	width: 500,
	height: 500,
	backgroundColor: 0xb1dfff,
	scene: [MainScene],
	physics: {
		default: 'arcade',
		arcade: {
			// debug: true,
			gravity: {
				y: 50
			}
		}
	}
}

const game = new Phaser.Game(config)

export default game