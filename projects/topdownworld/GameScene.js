import * as Phaser from 'phaser'

class GameScene extends Phaser.Scene {
	constructor () {
		super('GameScene')
	}

	preload () {
		this.load.image('mario-tiles', 'projects/mario/assets/maptileset.png')
		this.load.tilemapTiledJSON('map', 'projects/mario/assets/untitled.json')
	}

	create () {
		const map = this.make.tilemap({
			key: 'map'
		})

		const tileset = map.addTilesetImage('maptileset', 'mario-tiles')
		for (const layerData of map.layers) {
			const layer = map.createStaticLayer(layerData.name, tileset, 0, 0)

			layer.setCollisionByProperty({
				collides: true
			})

			// const debugGraphics = this.add.graphics().setAlpha(0.75)

			// layer.renderDebug(debugGraphics, {
			// 	tileColor: null, // Color of non-colliding tiles
			// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
			// })
		}

		const camera = this.cameras.main
		camera.setOrigin(0, 0)

		console.log(camera)
	}

	update () {}
}

export default GameScene
