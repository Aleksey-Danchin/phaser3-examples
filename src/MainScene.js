import * as Phaser from 'phaser'

class MainScene extends Phaser.Scene {
	constructor () {
		super('MainScene')

		this.faces = []
	}

	preload () {
		this.load.spritesheet('faces', './faces.png', {
			frameWidth: 100,
			frameHeight: 100
		})
	}

	create () {
		this.faces = this.physics.add.group({
			key: 'faces',
			frameQuantity: 3,
			collideWorldBounds: true,
			bounceX: 1,
			bounceY: 1,
			velocityX: 200,
			velocityY: 200
		})

		Phaser.Actions.Call(this.faces.getChildren(), face => {
			const velocityX = Phaser.Math.Between(5, 25)
			const velocityY = Phaser.Math.Between(5, 25)

			face.setVelocity(velocityX, velocityY)
			face.body.onWorldBounds = true
			face.body.onCollide = true
		})

		Phaser.Actions.RandomRectangle(this.faces.getChildren(), this.physics.world.bounds)

		this.physics.add.collider(this.faces)

		this.physics.world.on('worldbounds', body => {
			this.updateFrame(body.gameObject)
		})

		this.physics.world.on('collide', (gameObject1, gameObject2) => {
			this.updateFrame(gameObject1)
			this.updateFrame(gameObject2)
		})
	}

	updateFrame (gameObject) {
		const frame = gameObject.frame.name
		gameObject.setFrame((frame + 1) % 3)
	}
}

export default MainScene