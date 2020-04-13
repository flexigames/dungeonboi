import state from './state'
import { Emitter } from "pixi-particles"
import { ParticleContainer } from "pixi.js"
import dustEmitterConfig from "../dust-emitter.json"

export default class Particles {
    constructor({zIndex}) {
        const particleContainer = new ParticleContainer()
        particleContainer.zIndex = zIndex // this.pos.y - 1
        particleContainer.setProperties({
          scale: true,
          position: true,
          rotation: true,
          uvs: true,
          alpha: true,
        })
        state.viewport.addChild(particleContainer)
        this.particleContainer = particleContainer
    
        const emitter = new Emitter(
          particleContainer,
          state.textures.dust,
          dustEmitterConfig
        )
        this.particleEmitter = emitter
      }

      update(dt, zIndex) {
        this.particleEmitter.update((dt * 16) / 1000)
        this.particleContainer.zIndex = zIndex
      }
    
      spawn(pos) {
        this.particleEmitter.emit = true
        this.particleEmitter.resetPositionTracking()
        this.particleEmitter.updateOwnerPos(pos.x, pos.y)
      }
    
}