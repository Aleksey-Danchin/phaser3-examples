import * as Phaser from 'phaser'

import gameConfig from './gameConfig'

class Game extends Phaser.Scene {
	constructor () {
		super('game')

		this.parts = null
		this.partWidth = null
		this.partHeight = null
		this.emptyPoint = {
			x: gameConfig.width - 1,
			y: gameConfig.height - 1
		}
		this.alert = null
	}

	preload () {
		this.load.image('daf', 'projects/tag/assets/dog_and_flowers.jpg')
	}

	create () {
		this.partWidth = this.cameras.main.width / gameConfig.width
		this.partHeight = this.cameras.main.height / gameConfig.height

		this.splitImage()
		this.partsInit()
		this.partsShuffle(1000)

		this.input.keyboard.on('keydown', (...args) => this.handleKey(...args))

		this.alert = this.add.text(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			'!!! YOU WON !!!',
			{
				font: 'bold 50px Arial',
				color: 'yellow'
			}
		)

		this.alert.setOrigin(0.5, 0.5)
		this.alert.setVisible(false)
	}

	update () {}

	splitImage () {
		const texture = this.textures.get('daf')
		const image = texture.getSourceImage()
		const frameWidth = image.width / gameConfig.width
		const frameHeight = image.height / gameConfig.height

		for (let rowIndex = 0; rowIndex < gameConfig.height; rowIndex++) {
			for (let columnIndex = 0; columnIndex < gameConfig.width; columnIndex++) {
				const index = rowIndex * gameConfig.width + columnIndex

				texture.add(
					index,
					0,
					columnIndex * frameWidth,
					rowIndex * frameHeight,
					frameWidth,
					frameHeight
				)
			}
		}
	}

	partsInit () {
		const parts = []
		const commonPartsNumber = gameConfig.width * gameConfig.height - 1

		for (let i = 0; i < commonPartsNumber; i++) {
			const rowIndex = i % gameConfig.width
			const columnIndex = parseInt(i / gameConfig.width)

			const image = this.add.image(
				rowIndex * this.partWidth,
				columnIndex * this.partHeight,
				'daf',
				i
			)

			const part = {
				originX: rowIndex,
				originY: columnIndex,
				x: rowIndex,
				y: columnIndex,
				image
			}

			image.setOrigin(0)
			image.displayWidth = this.partWidth
			image.displayHeight = this.partHeight

			image.setInteractive()
			image.on('pointerover', (...args) => this.onPointOverHandler(part, ...args))
			image.on('pointermove', (...args) => this.onPointMoveHandler(part, ...args))
			image.on('pointerdown', (...args) => this.onPointDownHandler(part, ...args))
			image.on('pointerup', (...args) => this.onPointUpHandler(part, ...args))
			image.on('pointerout', (...args) => this.onPointOutHandler(part, ...args))

			parts.push(part)
		}

		this.parts = parts
	}

	partsShuffle (times) {
		const directions = ['up', 'down', 'left', 'right']

		for (let i = 0; i < times; i++) {
			const random = Math.floor(Math.random() * directions.length)
			const direction = directions[random]

			this.move(direction, true)
		}
	}

	getPart (x, y) {
		for (const part of this.parts) {
			if (part.x === x && part.y === y) {
				return part
			}
		}

		return false
	}

	move (direction, isForce = false) {
		let offsetX = 0
		let offsetY = 0

		if (direction === 'up') {
			offsetY = 1
		}

		else if (direction === 'down') {
			offsetY = -1
		}

		else if (direction === 'left') {
			offsetX = 1
		}

		else if (direction === 'right') {
			offsetX = -1
		}

		const part = this.getPart(
			this.emptyPoint.x + offsetX,
			this.emptyPoint.y + offsetY
		)

		if (!part) {
			return false
		}

		this.emptyPoint.x = part.x
		this.emptyPoint.y = part.y

		part.x -= offsetX
		part.y -= offsetY

		if (!isForce) {
			this.add.tween({
				targets: part.image,
				x: part.x * this.partWidth,
				y: part.y * this.partHeight,
				duration: 750,
				ease: Phaser.Math.Easing.Bounce.Out
			})

			this.checkWin()
		} else {
			part.image.setPosition(
				part.x * this.partWidth,
				part.y * this.partHeight
			)
		}

	}

	handleKey (event) {
		switch(event.code) {
			case "KeyA":
			case "ArrowLeft":
				this.move('left')
				break
			case "KeyD":
			case "ArrowRight":
				this.move('right')
				break
			case "KeyW":
			case "ArrowUp":
				this.move('up')
				break
			case "KeyS":
			case "ArrowDown":
				this.move('down')
				break
		}
	}

	onPointOverHandler (part) {
		part.image.setAlpha(0.5)
	}

	onPointDownHandler (part) {
		if (part.x !== this.emptyPoint.x && part.y !== this.emptyPoint.y) {
			return
		}

		const number = Math.abs(this.emptyPoint.x - part.x) + Math.abs(this.emptyPoint.y - part.y)
		let action = ''

		if (this.emptyPoint.x > part.x) {
			action = 'right'
		}

		else if (this.emptyPoint.x < part.x) {
			action = 'left'
		}

		else if (this.emptyPoint.y > part.y) {
			action = 'down'
		}

		else if (this.emptyPoint.y < part.y) {
			action = 'up'
		}

		for (let i = 0; i < number; i++) {
			this.move(action)
		}
	}

	onPointUpHandler (part) {}

	onPointMoveHandler (part) {}

	onPointOutHandler (part) {
		part.image.setAlpha(1)
	}

	checkWin () {
		let isWin = true

		for (const part of this.parts) {
			if (part.originY !== part.y || part.originX !== part.x) {
				isWin = false
			}
		}

		if (isWin) {
			this.alert.setVisible(true)
		}
	}
}

export default Game
