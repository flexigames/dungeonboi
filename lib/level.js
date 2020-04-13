import { createEntity } from "../lib/entities"
import Enemy from "../entities/Enemy"
import Potion from "../entities/Potion"
import Ladder from "../entities/Ladder"
import { slice, partition, groupBy, times, find } from "lodash"
import { createSprite } from "./sprite"
import Chest from "../entities/Chest"
import { Room } from "./dungeon"

const TILE_SIZE = 16

export function createLevel(tiles, player) {
  createFloorsAndWalls(tiles)
  populateLevel(tiles, player)
}

function populateLevel(tiles, player, opts = {}) {
  const {
    roomEnemyRate = 0.025,
    roomPotionRate = 0.002,
    roomChestRate = 0.007,
    corridorEnemyRate = 0.005,
  } = opts

  const [roomTiles, corridorTiles] = partition(
    tiles,
    (tile) => tile.belongsTo instanceof Room
  )

  const rooms = Object.values(groupBy(roomTiles, "belongsTo.id"))

  const playerRoomTiles = rooms[0]
  const playerRoom = playerRoomTiles[0].belongsTo
  player.pos.x = playerRoom.centerX * TILE_SIZE + TILE_SIZE / 2
  player.pos.y = playerRoom.centerY * TILE_SIZE + TILE_SIZE / 2

  const ladderRoomTiles = rooms[rooms.length - 1]
  const ladderRoom = ladderRoomTiles[0].belongsTo
  createEntity(
    new Ladder(
      ladderRoom.centerX * TILE_SIZE + TILE_SIZE / 2,
      ladderRoom.centerY * TILE_SIZE + TILE_SIZE / 2
    )
  )

  const corridors = Object.values(groupBy(corridorTiles, "belongsTo.id"))

  slice(rooms, Math.min(1, rooms.length - 1)).forEach((tilesInRoom) => {
    tilesInRoom.forEach((tile) => {
      const { create } =
        pickRandom([
          { rate: roomEnemyRate, create: (x, y) => Enemy.createRandom(x, y) },
          { rate: roomPotionRate, create: (x, y) => new Potion(x, y) },
          { rate: roomChestRate, create: (x, y) => new Chest(x, y) },
        ]) || {}

      if (create)
        createEntity(
          create(
            TILE_SIZE * tile.x + TILE_SIZE / 2,
            TILE_SIZE * tile.y + TILE_SIZE / 2
          )
        )
    })
  })

  corridors.forEach((tilesInCorridor) => {
    tilesInCorridor.forEach((tile) => {
      const { create } =
        pickRandom([
          {
            rate: corridorEnemyRate,
            create: (x, y) => Enemy.createRandom(x, y),
          },
        ]) || {}

      if (create) createEntity(create(TILE_SIZE * tile.x, TILE_SIZE * tile.y))
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

function pickRandom(array) {
  const rnd = Math.random()

  let baseRate = 0

  for (let i = 0; i < array.length; i++) {
    if (rnd <= baseRate + array[i].rate) return array[i]
    baseRate += array[i].rate
  }
  return null
}
