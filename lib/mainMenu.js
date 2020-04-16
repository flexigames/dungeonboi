import * as PIXI from "pixi.js"
import state from './state'
import { createSprite } from "./sprite"

export default class MainMenu {
    constructor() {
        this.container = new PIXI.Container()
        state.app.stage.addChild(this.container)

        this.width = state.app.renderer.screen.width
        this.height = state.app.renderer.screen.height

        this.createBackground()
        this.createTitle()
        this.createButton('Start Game', this.height / 2 - 21)

        this.setVisible(false)

        this.onStart = () => {}
    }

    createTitle() {
        const titleText = new PIXI.Text('dungeonboi', {
            fontFamily: 'Press Start 2P',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center'
          })
        titleText.position.x = this.width / 2
        titleText.position.y = this.height / 2 - 122
        titleText.anchor.set(0.5)
        titleText.scale = {x: 2, y: 2}

        this.container.addChild(titleText)

        const knight  = createSprite('knight_m_run_anim', this.width / 2, this.height / 2 - 80)
        knight.anchor.set(0.5)
        knight.scale = {x: 4, y: 4}
        this.container.addChild(knight)

    }

    createButton(text, y = 49) {
        const rectangle = new PIXI.Graphics()
        rectangle.lineStyle(2, 0xFFFFFF, 1)
        rectangle.beginFill(0x483B3A)
        rectangle.interactive = true
        rectangle.buttonMode= true
        rectangle.drawRect(this.width / 2 - 100, y, 200, 32)
        rectangle.endFill()
        this.container.addChild(rectangle)

        rectangle.on('mouseup', () => this.onStart())

        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Press Start 2P',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center'
          })
          
        
        buttonText.position.x = this.width / 2
        buttonText.position.y = y + 17 
        buttonText.anchor.set(0.5)

        this.container.addChild(buttonText)
    }

    createBackground() {
        const rectangle = new PIXI.Graphics()
        rectangle.beginFill(0x483B3A)
        rectangle.alpha = 0.7
        rectangle.drawRect(0, 0, this.width, this.height)
        rectangle.endFill()
        this.container.addChild(rectangle)

    }

    setVisible(visible) {
        this.container.visible = visible
    }
}