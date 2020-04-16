import { createEntity } from "../lib/entities"
import Enemy from "../entities/Enemy"
import Ladder from "../entities/Ladder"
import { random, slice, partition, groupBy, times, find, sample, compact } from "lodash"
import { createSprite } from "./sprite"
import Chest from "../entities/Chest"
import { Room, Corridor } from "./dungeon"

const TILE_SIZE = 16

export function createLevel(tiles, player) {
  createFloorsAndWalls(tiles)
  populateLevel(tiles, player)
}

function populateLevel(tiles, player, opts = {}) {
  const {
    roomEnemyRate = 0.025,
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
      if (tile.x !== ladderRoom.centerX && tile.y !== ladderRoom.centerY) {
        const { create } =
        pickRandom([
          { rate: roomEnemyRate, create: (x, y) => Enemy.createRandom(x, y) },
          { rate: roomChestRate, create: (x, y) => new Chest(x, y) },
        ]) || {}

      if (create)
        createEntity(
          create(
            TILE_SIZE * tile.x + TILE_SIZE / 2,
            TILE_SIZE * tile.y + TILE_SIZE / 2
          )
        )
      }
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
  const width = 100
  const height = 100
  const bannerColor = sample(['red', 'blue', 'green'])

  const tileArray = createTileArray(tiles, width, height)

  times(width).map((x) =>
    times(height).map((y) => {
      createTile(getLevelTile(x, y), x, y)
    })
  )
  function getLevelTile(x, y) {
    return tileArray[x] && tileArray[x][y]
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

    const tileBelow = getLevelTile(x, y + 1)
    if (tileBelow) return createWallTopTile(x, y, tileBelow, bannerColor)
    const tileAbove = getLevelTile(x, y - 1)
    if (tileAbove) return createWallBottomTile(x, y, tileAbove)
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
    const rnd = Math.random()
    const id =
      rnd < 1 - brokenTilesFrequency
        ? 1
        : Math.ceil(
            ((rnd - 1 + brokenTilesFrequency) / brokenTilesFrequency) * 8
          )

    const sprite = createSprite("floor_" + id, x * TILE_SIZE, y * TILE_SIZE)

    if (id == 1 && Math.random() < 0.01) {
      const skull = createSprite("skull", x * TILE_SIZE + random(-2, 2), y * TILE_SIZE + random(-2, 2))
      skull.scale.x = Math.random() < 0.5 ? 1 : -1
    }

    return sprite
  }

  function createWallTopTile(x, y, tile, bannerColor) {
    if (Math.random() > 0.7 && x % 2 === 0 && tile.belongsTo instanceof Room)return createRandomDecoratedWallTopTile(x, y, bannerColor)
    if (Math.random() > 0.1 && x % 2 === 0 && tile.belongsTo instanceof Corridor) return [createWallTopTileColumn(x, y)]
    return [
      createSprite("wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE),
      createSprite("wall_mid", x * TILE_SIZE, y * TILE_SIZE),
    ]
  }

  function createRandomDecoratedWallTopTile(x, y, bannerColor) {
    const sprites = [
      'wall_hole_1',
      'wall_hole_2',
      'wall_banner_' + bannerColor,
      'wall_banner_' + bannerColor,
      'wall_goo'
    ]

    const sprite = sample(sprites)

    return compact([
      createSprite("wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE),
      createSprite(sprite, x * TILE_SIZE, y * TILE_SIZE),
      sprite === 'wall_goo' && createSprite('wall_goo_base', x * TILE_SIZE, (y + 1) * TILE_SIZE, {zIndex: y * TILE_SIZE})
    ])
    
  }

  function createFountainWall(x, y) {
    return [
      createSprite("wall_fountain_top", x * TILE_SIZE, (y - 1) * TILE_SIZE),
      createSprite("wall_fountain_mid_red_anim", x * TILE_SIZE, y * TILE_SIZE),
      createSprite("wall_fountain_basin_red_anim", x * TILE_SIZE, (y +1) * TILE_SIZE, {zIndex: y * TILE_SIZE}),
    ] 
  }


  function createWallTopTileColumn(x, y) {
    return [
      createSprite("wall_column_base", x * TILE_SIZE, (y + 2) * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite("wall_column_mid", x * TILE_SIZE, (y + 1) * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite("wall_column_top", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE +1,
      }),
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

  function createWallBottomTile(x, y, tile) {
    if (Math.random() > 0.1 && x % 2 === 0 && tile.belongsTo instanceof Corridor) return [createWallBottomTileColumn(x, y)]
    return [
      createSprite("wall_mid", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite("wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE +1,
      }),
    ]
  }

  function createWallBottomTileColumn(x, y) {
    return [
      createSprite("column_base", x * TILE_SIZE, (y + 1) * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite("wall_column_mid", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite("wall_column_top", x * TILE_SIZE, (y - 1) * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE +1,
      }),
    ]
  }

  function createWallCornerBottomLeftTile(x, y) {
    return [
      createSprite("wall_corner_front_left", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite(
        "wall_corner_bottom_left",
        x * TILE_SIZE,
        (y - 1) * TILE_SIZE,
        { anchor: [0, 1], zIndex: y * TILE_SIZE +1 }
      ),
    ]
  }

  function createWallCornerBottomRightTile(x, y) {
    return [
      createSprite("wall_corner_front_right", x * TILE_SIZE, y * TILE_SIZE, {
        anchor: [0, 1],
        zIndex: y * TILE_SIZE + 1,
      }),
      createSprite(
        "wall_corner_bottom_right",
        x * TILE_SIZE,
        (y - 1) * TILE_SIZE,
        { anchor: [0, 1], zIndex: y * TILE_SIZE + 1}
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

function createTileArray(tiles, width, height) {
  const matrix = times(width).map((x) => times(height).map((y) => false))
  tiles.forEach((tile) => (matrix[tile.x][tile.y] = tile))
  return matrix
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
