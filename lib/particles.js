import state from './state'
import { Emitter } from "pixi-particles"
import { ParticleContainer } from "pixi.js"
import dustEmitterConfig from "../dust-emitter.json"
import bloodEmitterConfig from "../blood-emitter.json"

const types = {
    dust: dustEmitterConfig,
    blood: bloodEmitterConfig,
}

export default class Particles {
    constructor(type, {zIndex}) {
        const container = new ParticleContainer()
        container.zIndex = zIndex
        container.setProperties({
          scale: true,
          position: true,
          rotation: true,
          uvs: true,
          alpha: true,
        })
        state.viewport.addChild(container)
        this.container = container
    
        const emitter = new Emitter(
          container,
          state.textures.dust,
          types[type]
        )
        this.particleEmitter = emitter
        emitter.emit = false
      }

      update(dt, zIndex) {
        this.particleEmitter.update((dt * 16) / 1000)
        this.container.zIndex = zIndex
      }
    
      spawn(pos) {
        this.particleEmitter.emit = true
        this.particleEmitter.resetPositionTracking()
        this.move(pos)
      }

      move(pos) {
        this.particleEmitter.updateOwnerPos(pos.x, pos.y)
      }
    
}