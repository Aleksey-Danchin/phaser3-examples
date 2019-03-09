import * as Phaser from 'phaser'

class GameScene extends Phaser.Scene {
	constructor () {
		super('GameScene')

		// this.controls = null
		this.satyr = null
		this.cursors = null
	}

	preload () {
		this.load.image('overworld_tileset_grass', 'projects/mario/assets/overworld_tileset_grass.png')
		this.load.tilemapTiledJSON('map', 'projects/mario/assets/map.json')
		this.load.spritesheet('satyr', 'projects/mario/assets/mvSatyr.png', {
			frameWidth: 32,
			frameHeight: 64
		})
	}

	create () {
		const map = this.make.tilemap({
			key: 'map'
		})

		this.cursors = this.input.keyboard.createCursorKeys()

		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('satyr', { start: 0, end: 6 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'wait',
			frames: this.anims.generateFrameNumbers('satyr', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		})

		const spawnPoint = map.findObject('Objects', obj => obj.name === 'spawn poing')
		this.satyr = this.physics.add.sprite(-100, -100, 'satyr')
			.setOrigin(0.5, 1)
			.setDepth(1)
			.setScale(0.5)
			.setPosition(spawnPoint.x, spawnPoint.y)
			.setSize(10, 5)
			.setOffset(10, 60)

		this.cameras.main.startFollow(this.satyr)


		const tileset = map.addTilesetImage('overworld_tileset_grass', 'overworld_tileset_grass')
		for (const layerData of map.layers) {
			const layer = map.createStaticLayer(layerData.name, tileset, 0, 0)

			layer.setCollisionByProperty({
				collides: true
			})

			this.physics.add.collider(this.satyr, layer)

			// const debugGraphics = this.add.graphics().setAlpha(0.75)

			// layer.renderDebug(debugGraphics, {
			// 	tileColor: null, // Color of non-colliding tiles
			// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
			// })
		}

		this.cameras.main
			.setBounds(0, 0, map.widthInPixels, map.hegihtInPixels)
			.setZoom(2.5)

		const cursors = this.input.keyboard.createCursorKeys()

		// const controlConfig = {
		// 	camera: this.cameras.main,
		// 	left: cursors.left,
		// 	right: cursors.right,
		// 	up: cursors.up,
		// 	down: cursors.down,
		// 	zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
		// 	zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
		// 	acceleration: 0.06,
		// 	drag: 0.0005,
		// 	maxSpeed: 0.5
		// }

		// this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig)
	}

	update (time, delta) {
		const speed = 35
		// this.controls.update(delta)

		this.satyr.setVelocity(0)

		let speedX = 0
		let speedY = 0

		if (this.cursors.left.isDown) {
			speedX -= speed
		}

		if (this.cursors.right.isDown) {
			speedX += speed
		}

		if (this.cursors.up.isDown) {
			speedY -= speed
		}

		if (this.cursors.down.isDown) {
			speedY += speed
		}

		this.satyr.body.setVelocity(speedX, speedY)
		this.satyr.body.velocity.normalize().scale(speed)

		if (speedX !== 0 || speedY !== 0) {
			this.satyr.anims.play('walk', true)

			this.satyr.flipX = speedX < 0
		} else {
			this.satyr.anims.play('wait')
		}
	}
}

export default GameScene
