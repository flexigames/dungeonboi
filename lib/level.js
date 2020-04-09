import { createEntity } from "../lib/entities"
import Enemy from "../entities/Enemy"
import Potion from "../entities/Potion"
import Weapon from "../entities/Weapon"
import { times, find, shuffle } from "lodash"
import { createSprite } from "./sprite"

const TILE_SIZE = 16

export function createLevel(tiles, player, opts = {}) {
  const { enemyCount = 30, weaponCount = 10, potionCount = 20 } = opts

  createFloorsAndWalls(tiles)

  const randomizedTiles = shuffle(tiles)
  const playerTile = randomizedTiles[0]

  player.pos.x = playerTile.x * TILE_SIZE
  player.pos.y = playerTile.y * TILE_SIZE

  spawnEntities(
    [
      { create: (x, y) => new Enemy(x, y), count: enemyCount },
      {
        create: (x, y) => new Weapon(x, y, { sprites: "weapon_regular_sword" }),
        count: weaponCount,
      },
      { create: (x, y) => new Potion(x, y), count: potionCount },
    ],
    randomizedTiles
  )
}

function spawnEntities(entityList, tiles) {
  let tileCounter = 1
  entityList.forEach(({ create, count }) => {
    times(count).forEach(() => {
      const tile = tiles[tileCounter]
      createEntity(create(tile.x * TILE_SIZE, tile.y * TILE_SIZE))
      tileCounter++
    })
  })
}

function createFloorsAndWalls(tiles) {
  times(100).map((x) =>
    times(100).map((y) => {
      createTile(getLevelTile(x, y), x, y)
    })
  )
  function getLevelTile(x, y) {
    return find(tiles, (tile) => tile.x === x && tile.y === y)
  }

  function createTile(tile, x, y) {
    if (tile) return createFloorTile(x, y)

    if (
      getLevelTile(x - 1, y + 1) &&
      getLevelTile(x - 1, y) &&
      getLevelTile(x, y + 1)
    )
      return createWallInnerRightCorner(x, y)

    if (
      getLevelTile(x + 1, y + 1) &&
      getLevelTile(x + 1, y) &&
      getLevelTile(x, y + 1)
    )
      return createWallInnerLeftCorner(x, y)

    if (
      getLevelTile(x + 1, y - 1) &&
      getLevelTile(x + 1, y) &&
      getLevelTile(x, y - 1)
    )
      return createWallInnerLeftTopCorner(x, y)

    if (
      getLevelTile(x - 1, y - 1) &&
      getLevelTile(x - 1, y) &&
      getLevelTile(x, y - 1)
    )
      return createWallInnerRightTopCorner(x, y)

    if (getLevelTile(x, y + 1)) return createWallTopTile(x, y)
    if (getLevelTile(x, y - 1)) return createWallBottomTile(x, y)
    if (getLevelTile(x + 1, y)) return createWallLeftTile(x, y)
    if (getLevelTile(x - 1, y)) return createWallRightTile(x, y)
    if (getLevelTile(x - 1, y - 1)) return createWallCornerBottomRightTile(x, y)
    if (getLevelTile(x - 1, y + 1)) return createWallCornerTopRightTile(x, y)
    if (getLevelTile(x + 1, y - 1)) return createWallCornerBottomLeftTile(x, y)
    if (getLevelTile(x + 1, y + 1)) return createWallCornerTopLeftTile(x, y)

    return
  }

  function createWallInnerRightCorner(x, y) {
    return [
      createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_front_left", x * TILE_SIZE, y * TILE_SIZE),
    ]
  }

  function createWallInnerLeftCorner(x, y) {
    return [
      createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_front_right", x * TILE_SIZE, y * TILE_SIZE),
    ]
  }

  function createFloorTile(x, y) {
    const brokenTilesFrequency = 0.1
    const random = Math.random()
    const id =
      random < 1 - brokenTilesFrequency
        ? 1
        : Math.ceil(
            ((random - 1 + brokenTilesFrequency) / brokenTilesFrequency) * 8
          )

    return createSprite("floor_" + id, x * TILE_SIZE, y * TILE_SIZE)
  }

  function createWallTopTile(x, y) {
    return [
      createSprite("wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE),
      createSprite("wall_mid", x * TILE_SIZE, y * TILE_SIZE),
    ]
  }

  function createWallCornerTopLeftTile(x, y) {
    return [
      createSprite("wall_corner_left", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_corner_top_left", x * TILE_SIZE, (y - 1) * TILE_SIZE),
    ]
  }

  function createWallCornerTopRightTile(x, y) {
    return [
      createSprite("wall_corner_right", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_corner_top_right", x * TILE_SIZE, (y - 1) * TILE_SIZE),
    ]
  }

  function createWallLeftTile(x, y) {
    return [
      createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE),
    ]
  }

  function createWallRightTile(x, y) {
    return [
      createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_mid_left", x * TILE_SIZE, y * TILE_SIZE),
    ]
  }

  function createWallBottomTile(x, y) {
    return [
      createSprite("wall_mid", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE,
      }),
      createSprite("wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE,
      }),
    ]
  }

  function createWallCornerBottomLeftTile(x, y) {
    return [
      createSprite("wall_corner_front_left", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE,
      }),
      createSprite(
        "wall_corner_bottom_left",
        x * TILE_SIZE,
        (y - 1) * TILE_SIZE,
        { anchor: [0, 1], zIndex: y * TILE_SIZE }
      ),
    ]
  }

  function createWallCornerBottomRightTile(x, y) {
    return [
      createSprite("wall_corner_front_right", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE,
      }),
      createSprite(
        "wall_corner_bottom_right",
        x * TILE_SIZE,
        (y - 1) * TILE_SIZE,
        { anchor: [0, 1], zIndex: y * TILE_SIZE }
      ),
    ]
  }

  function createWallInnerLeftTopCorner(x, y) {
    return [
      createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_mid_right", x * TILE_SIZE, (y - 1) * TILE_SIZE, {
        zIndex: y * TILE_SIZE,
      }),
      createSprite("wall_side_top_right", x * TILE_SIZE, (y - 2) * TILE_SIZE, {
        zIndex: y * TILE_SIZE,
      }),
    ]
  }

  function createWallInnerRightTopCorner(x, y) {
    return [
      createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_mid_left", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_side_mid_left", x * TILE_SIZE, (y - 1) * TILE_SIZE, {
        zIndex: y * TILE_SIZE,
      }),
      createSprite("wall_side_top_left", x * TILE_SIZE, (y - 2) * TILE_SIZE, {
        zIndex: y * TILE_SIZE,
      }),
    ]
  }
}

export function createWalkableLevelMap(tiles, width, height) {
  const matrix = times(height).map((y) => times(width).map((x) => false))
  tiles.forEach((tile) => (matrix[tile.y][tile.x] = true))
  return matrix
}
