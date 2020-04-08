import level from "../level.txt"
import { createEntity } from "../lib/entities"
import Enemy from "../entities/Enemy"
import Potion from "../entities/Potion"
import { createSprite } from "../lib/sprite"
import { flattenDeep } from "lodash"

const TILE_SIZE = 16

const levelMatrix = level.split("\n").map((line) => line.split(""))

export function createLevel() {
  return flattenDeep(
    levelMatrix.map((line, y) => line.map((tile, x) => createTile(tile, x, y)))
  )
}

function createTile(tile, x, y) {
  if (tile === "e" || tile === "p") {
    return createFloorTile(x, y)
  }
  if (tile === "d") {
    return createSprite("doors_frame_left", x * TILE_SIZE, (y - 1) * TILE_SIZE)
  }
  if (tile === "r") {
    return createSprite("doors_frame_right", x * TILE_SIZE, (y - 1) * TILE_SIZE)
  }
  if (tile === "o" && getLevelTile(x + 1, y) === "o") {
    return [
      createSprite("doors_leaf_closed", x * TILE_SIZE, (y - 1) * TILE_SIZE),
      createSprite("doors_frame_top", x * TILE_SIZE, (y - 1) * TILE_SIZE - 3),
    ]
  }
  if (tile === "_") {
    return createFloorTile(x, y)
  } else if (tile === ".") {
    if (
      getLevelTile(x - 1, y + 1) === "_" &&
      getLevelTile(x - 1, y) === "_" &&
      getLevelTile(x, y + 1) === "_"
    )
      return createWallInnerRightCorner(x, y)

    if (
      getLevelTile(x + 1, y + 1) === "_" &&
      getLevelTile(x + 1, y) === "_" &&
      getLevelTile(x, y + 1) === "_"
    )
      return createWallInnerLeftCorner(x, y)

    if (
      getLevelTile(x + 1, y - 1) === "_" &&
      getLevelTile(x + 1, y) === "_" &&
      getLevelTile(x, y - 1) === "_"
    )
      return createWallInnerLeftTopCorner(x, y)

    if (
      getLevelTile(x - 1, y - 1) === "_" &&
      getLevelTile(x - 1, y) === "_" &&
      getLevelTile(x, y - 1) === "_"
    )
      return createWallInnerRightTopCorner(x, y)

    if (getLevelTile(x, y + 1) === "_") return createWallTopTile(x, y)
    if (getLevelTile(x, y - 1) === "_") return createWallBottomTile(x, y)
    if (getLevelTile(x + 1, y) === "_") return createWallLeftTile(x, y)
    if (getLevelTile(x - 1, y) === "_") return createWallRightTile(x, y)
    if (getLevelTile(x - 1, y - 1) === "_")
      return createWallCornerBottomRightTile(x, y)
    if (getLevelTile(x - 1, y + 1) === "_")
      return createWallCornerTopRightTile(x, y)
    if (getLevelTile(x + 1, y - 1) === "_")
      return createWallCornerBottomLeftTile(x, y)
    if (getLevelTile(x + 1, y + 1) === "_")
      return createWallCornerTopLeftTile(x, y)
  }
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

function createWallInnerLeftTopCorner(x, y) {
  return [
    createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
    createSprite("wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE),
    createSprite("wall_side_top_right", x * TILE_SIZE, (y - 1) * TILE_SIZE),
  ]
}

function createWallInnerRightTopCorner(x, y) {
  return [
    createSprite("floor_1", x * TILE_SIZE, y * TILE_SIZE),
    createSprite("wall_side_mid_left", x * TILE_SIZE, y * TILE_SIZE),
    createSprite("wall_side_top_left", x * TILE_SIZE, (y - 1) * TILE_SIZE),
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

function createWallCornerBottomRightTile(x, y) {
  return [
    createSprite("wall_corner_front_right", x * TILE_SIZE, y * TILE_SIZE),
    createSprite(
      "wall_corner_bottom_right",
      x * TILE_SIZE,
      (y - 1) * TILE_SIZE
    ),
  ]
}

function createWallCornerBottomLeftTile(x, y) {
  return [
    createSprite("wall_corner_front_left", x * TILE_SIZE, y * TILE_SIZE),
    createSprite("wall_corner_bottom_left", x * TILE_SIZE, (y - 1) * TILE_SIZE),
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
    createSprite("wall_mid", x * TILE_SIZE, y * TILE_SIZE),
    createSprite("wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE),
  ]
}

function getLevelTile(x, y) {
  return levelMatrix[y] && levelMatrix[y][x]
}

export function populateLevel() {
  levelMatrix.forEach((line, y) =>
    line.forEach((tile, x) => {
      if (tile === "e") {
        createEntity(new Enemy(x * TILE_SIZE, y * TILE_SIZE))
      }
      if (tile === "p") {
        createEntity(new Potion(x * TILE_SIZE, y * TILE_SIZE))
      }
    })
  )
}
