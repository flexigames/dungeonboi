import Entity from './Entity'
import { createSprite } from "../lib/sprite"
import { findEntities, createEntity } from "../lib/entities"
import Weapon from './Weapon'

export default class Chest extends Entity {
    constructor(x, y) {
        super(x, y, { sprites: "chest_empty_open_anim" })
        this.sprites.main.stop()
        this.sprites.main.loop = false
        this.pickupRadius = 10
        this.open = false
    }

    update(dt) {
        super.update(dt)
        this.checkPlayerInteraction()
    }

    checkPlayerInteraction() {
        const player = findEntities("player")[0]

        if (
            !this.open &&
            player &&
            this.pos.distance(player.pos) < this.pickupRadius &&
            player.pickupIntent
        ) {
            this.sprites.main.play()
            this.sprites.main.onComplete = () => createEntity(Weapon.createRandom(this.pos.x, this.pos.y + 16))
            this.open = true
        }
    }
}