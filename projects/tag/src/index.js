import * as Phaser from 'phaser'

import Game from './Game'

const config = {
	width: 500,
	height: 500,
	scene: [Game]
}

const game = new Phaser.Game(config)

export default game