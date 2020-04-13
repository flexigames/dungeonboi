import { remove, isArray } from "lodash"

const entities = []

export function updateEntities(dt) {
  entities.forEach((it) => it.update(dt))
}

export function findEntities(tag) {
  if (!isArray(tag)) tag = [tag]
  return entities.filter((entity) => entity.tags.some((it) => tag.includes(it)))
}

export function createEntity(entity) {
  entities.push(entity)
  return entity
}

export function destroyEntity(entity) {
  entities.splice(entities.indexOf(entity), 1)
}

export function clearEntities(survivingEntities = []) {
  entities.forEach((entity) => {
    if (!survivingEntities.includes(entity)) {
      entity.destroy()
    }
  })

  remove(entities, (it) => !survivingEntities.includes(it))
}

export function getSurvivingEntities() {
  return entities.filter((entity) => entity.survivesBetweenLevels())
}

export function renderEntities() {
  entities.forEach((entity) => entity.render())
}
