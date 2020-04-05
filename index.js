import createGame from "crtrdg-gameloop"
import level from "./level.txt"
import tilesList from "./tiles_list_v1.3.txt"

const TILE_SIZE = 16

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

const tileset = new Image(512, 512)
tileset.src =
  "https://cdn.glitch.com/8804483f-7435-434d-ab8d-d8d811696a6a%2F0x72_DungeonTilesetII_v1.3.png?v=1586091258409"

game.on("draw", function(ctx, dt) {
  drawLevel(ctx)
  drawSprite(ctx, 'wizzard_m_idle_anim', 10 * TILE_SIZE, 10 * TILE_SIZE)
})

game.start()

function drawLevel(ctx) {
  level.split("\n").forEach((line, y) =>
    line.split("").forEach((tile, x) => {
      if (tile === "_") {
        drawFloorTile(ctx, x, y)
      } else if (tile === "-") {
        drawWallTopTile(ctx, x, y)
      } else if (tile === "|") {
        drawWallRightTile(ctx, x, y)
      } else if (tile === "x") {
        drawWallCornerTopRightTile(ctx, x, y)
      } else if (tile === "b") {
        drawWallBottomTile(ctx, x, y)
      } else if (tile === 'l') {
        drawWallLeftTile(ctx, x, y)
      }
    })
  )
}

function drawFloorTile(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallTopTile(ctx, x, y) {
  drawSprite(ctx, "wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE)
  drawSprite(ctx, "wall_mid", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallRightTile(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallCornerTopRightTile(ctx, x, y) {
  drawSprite(ctx, "wall_corner_top_right", x * TILE_SIZE, y * TILE_SIZE)
}

function drawWallLeftTile(ctx, x, y) {
  drawSprite(ctx, "wall_side_mid_left", x * TILE_SIZE, y * TILE_SIZE)
}


function drawWallBottomTile(ctx, x, y) {
  drawSprite(ctx, "wall_mid", x * TILE_SIZE, y * TILE_SIZE)
  drawSprite(ctx, "wall_top_mid", x * TILE_SIZE, (y - 1) * TILE_SIZE)
}

const sprites = tilesList
  .split("\n")
  .map(line => {
    const [name, sx, sy, swidth, sheight] = line.split(" ")
    return {
      name,
      sx: parseInt(sx),
      sy: parseInt(sy),
      swidth: parseInt(swidth),
      sheight: parseInt(sheight)
    }
  })
  .reduce((prev, { name, ...rest }) => ({ ...prev, [name]: { ...rest } }), {})

function drawSprite(ctx, name, x, y) {
  const sprite = sprites[name]

  if (sprite) {
    const { sx, sy, swidth, sheight } = sprite
    ctx.drawImage(tileset, sx, sy, swidth, sheight, x, y, swidth, sheight)
  }
}
