import level from "../level.txt"
import drawSprite from "./sprite"
import seedrandom from "seedrandom"

const TILE_SIZE = 16

export default drawLevel

function drawLevel(ctx) {
  const rng = seedrandom("bois")
  levelMatrix.forEach((line, y) =>
    line.forEach((tile, x) => {
      if (tile === "d") {
        return drawSprite(
          ctx,
          "doors_frame_left",
          x * TILE_SIZE,
          (y - 1) * TILE_SIZE
        )
      }
      if (tile === "r") {
        return drawSprite(
          ctx,
          "doors_frame_right",
          x * TILE_SIZE,
          (y - 1) * TILE_SIZE
        )
      }
      if (tile === "o" && getLevelTile(x + 1, y) === "o") {
        drawSprite(ctx, "doors_leaf_closed", x * TILE_SIZE, (y - 1) * TILE_SIZE)
        return drawSprite(
          ctx,
          "doors_frame_top",
          x * TILE_SIZE,
          (y - 1) * TILE_SIZE - 3
        )
      }
      if (tile === "_") {
        drawFloorTile(ctx, x, y, rng())
      } else if (tile === ".") {
        if (
          getLevelTile(x - 1, y + 1) === "_" &&
          getLevelTile(x - 1, y) === "_" &&
          getLevelTile(x, y + 1) === "_"
        )
          return drawWallInnerRightCorner(ctx, x, y)

        if (
          getLevelTile(x + 1, y + 1) === "_" &&
          getLevelTile(x + 1, y) === "_" &&
          getLevelTile(x, y + 1) === "_"
        )
          return drawWallInnerLeftCorner(ctx, x, y)

        if (
          getLevelTile(x + 1, y - 1) === "_" &&
          getLevelTile(x + 1, y) === "_" &&
          getLevelTile(x, y - 1) === "_"
        )
          return drawWallInnerLeftTopCorner(ctx, x, y)

        if (
          getLevelTile(x - 1, y - 1) === "_" &&
          getLevelTile(x - 1, y) === "_" &&
          getLevelTile(x, y - 1) === "_"
        )
          return drawWallInnerRightTopCorner(ctx, x, y)

        if (getLevelTile(x, y + 1) === "_") return drawWallTopTile(ctx, x, y)
        if (getLevelTile(x, y - 1) === "_") return drawWallBottomTile(ctx, x, y)
        if (getLevelTile(x + 1, y) === "_") return drawWallLeftTile(ctx, x, y)
        if (getLevelTile(x - 1, y) === "_") return drawWallRightTile(ctx, x, y)
        if (getLevelTile(x - 1, y - 1) === "_")
          return drawWallCornerBottomRightTile(ctx, x, y)
        if (getLevelTile(x - 1, y + 1) === "_")
          return drawWallCornerTopRightTile(ctx, x, y)
        if (getLevelTile(x + 1, y - 1) === "_")
          return drawWallCornerBottomLeftTile(ctx, x, y)
        if (getLevelTile(x + 1, y + 1) === "_")
          return drawWallCornerTopLeftTile(ctx, x, y)
      }
    })
  )
}

function drawWallInnerRightCorner(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_front_left", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallInnerLeftCorner(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_front_right", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallInnerLeftTopCorner(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_top_right", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

function drawWallInnerRightTopCorner(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_mid_left", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_top_left", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

function drawFloorTile(ctx, x, y, random) {
  const brokenTilesFrequency = 0.1
  const id =
    random < 1 - brokenTilesFrequency
      ? 1
      : Math.ceil(
          ((random - 1 + brokenTilesFrequency) / brokenTilesFrequency) * 8
        )

  drawSprite(ctx, "floor_" + id, x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallTopTile(ctx, x, y) {
  drawSprite(ctx, "wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE)
  drawSprite(ctx, "wall_mid", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallCornerTopLeftTile(ctx, x, y) {
  drawSprite(ctx, "wall_corner_left", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_corner_top_left", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

function drawWallCornerTopRightTile(ctx, x, y) {
  drawSprite(ctx, "wall_corner_right", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_corner_top_right", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

function drawWallCornerBottomRightTile(ctx, x, y) {
  drawSprite(ctx, "wall_corner_front_right", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(
    ctx,
    "wall_corner_bottom_right",
    x * TILE_SIZE,
    (y - 1) * TILE_SIZE
  )
}

function drawWallCornerBottomLeftTile(ctx, x, y) {
  drawSprite(ctx, "wall_corner_front_left", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_corner_bottom_left", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

function drawWallLeftTile(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallRightTile(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_mid_left", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallBottomTile(ctx, x, y) {
  drawSprite(ctx, "wall_mid", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

const levelMatrix = level.split("\n").map((line) => line.split(""))

function getLevelTile(x, y) {
  return levelMatrix[y] && levelMatrix[y][x]
}
