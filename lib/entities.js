const entities = []

export function drawEntities(ctx) {
  entities.forEach((it) => it.draw(ctx))
}

export function updateEntities(dt) {
  entities.forEach((it) => it.update(dt))
}

export function findEntitiesWithTag(tag) {
  return entities.filter((entity) => entity.tags.some((it) => it === tag))
}

export function createEntity(entity) {
  entities.push(entity)
}
