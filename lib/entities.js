import { sortBy } from "lodash"

const entities = []

export function updateEntities(dt) {
  entities.forEach((it) => it.update(dt))
}

export function findEntities(tag) {
  return entities.filter((entity) => entity.tags.some((it) => it === tag))
}

export function createEntity(entity) {
  entities.push(entity)
}

export function destroyEntity(entity) {
  entities.splice(entities.indexOf(entity), 1)
}
