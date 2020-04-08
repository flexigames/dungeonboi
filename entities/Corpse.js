import Entity from "./Entity"

export default class Corpse extends Entity {
  constructor(x, y) {
    super(x, y, { sprites: "skelet_dead" })
  }
}
