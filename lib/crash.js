import Crash from 'crash-colliders'
import { isEqual } from 'lodash'
import * as PIXI from 'pixi.js'
import state from './state'

const crash = new Crash()

export default crash

export class SpriteCollider {
    constructor(sprite, info = {}) {
        this.sprite = sprite
        this.debugMode = false

        this.collider = new crash.Polygon(new crash.V(sprite.x, sprite.y), getSpriteCornersPoints(sprite), true, { sprite, ...info })

        if (this.debugMode) this.startDebug()
    }

    update() {
        if (this.spriteHasChanged()) {
            this.collider.setPoints(getSpriteCornersPoints(this.sprite)) // TODO: should only be run if width/height change
            this.collider.setAngle(this.sprite.rotation) // TODO: should only be run if rotation changed
            this.collider.pos.x = this.sprite.x
            this.collider.pos.y = this.sprite.y
            crash.moved(this.collider)
            crash.updateAABBPolygon(this.collider)
            this.setChangeValues()
        }
        if (this.debugMode) this.updateDebug()
    }

    destroy() {
        state.viewport.removeChild(this.debugRectangle)
        this.collider.remove()
    }

    spriteHasChanged() {
        return !isEqual(this.getChangeValues(), this.previous)
    }

    setChangeValues() {
        this.previous = this.getChangeValues()
    }


    getChangeValues() {
        return [this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.sprite.rotation]
    }

    startDebug() {
        const debugRect = new PIXI.Graphics()
        debugRect.beginFill(0xffffff, 0.5)
        debugRect.drawPolygon(this.collider.sat.calcPoints.map(p => new PIXI.Point(p.x, p.y)))
        // const { x1, y1, x2, y2, sat} = this.collider.aabb
        // debugRect.drawRect(0, 0, Math.abs(x1 - x2), Math.abs(y1 - y2))
        debugRect.endFill()
        debugRect.x = this.collider.sat.pos.x
        debugRect.y = this.collider.sat.pos.y
        debugRect.zIndex = 1000000
        this.debugRectangle = debugRect
        state.viewport.addChild(debugRect)
    }

    updateDebug() {
        this.debugRectangle.x = this.collider.sat.pos.x
        this.debugRectangle.y = this.collider.sat.pos.y
        this.debugRectangle.rotation = this.sprite.rotation
    }
}

function getSpriteCornersPoints(sprite) {
    const offset = new crash.V(sprite.anchor.x * sprite.width, sprite.anchor.y * sprite.height)
    return [
        new crash.V(0, 0),
        new crash.V(0, sprite.height),
        new crash.V(sprite.width, sprite.height),
        new crash.V(sprite.width, 0)
    ].map(corner => corner.sub(offset))
}