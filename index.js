import createGame from "crtrdg-gameloop";
import level from "./level.txt";

const TILE_SIZE = 16;

const game = createGame();

game.canvas.height = 512;
game.canvas.width = 512;

const tileset = new Image(512, 512); // Using optional size for image
tileset.src =
  "https://cdn.glitch.com/8804483f-7435-434d-ab8d-d8d811696a6a%2F0x72_DungeonTilesetII_v1.3.png?v=1586091258409";

game.on("draw", function(ctx, dt) {
  drawBackground(ctx);
  drawLevel(ctx);
});

game.start();

function drawBackground(ctx) {
  ctx.save();
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

function drawLevel(ctx) {
  level.split("\n").forEach((line, y) =>
    line.split("").forEach((tile, x) => {
      if (tile === "_") {
        drawFloorTile(ctx, x, y)
      }
      else if (tile === "-") {
        drawWallTopTile(ctx, x, y)
      }
    })
  );
}

function drawFloorTile(ctx, x, y) {
  ctx.drawImage(
    tileset,
    TILE_SIZE,
    4 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

function drawWallTopTile(ctx, x, y) {
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    1 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    0 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    (y - 1) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

function drawWallLeftTile(ctx, x, y) {
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    1 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    0 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    (y - 1) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

function drawWallRightTile(ctx, x, y) {
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    1 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    0 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    (y - 1) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

function drawWallBottomTile(ctx, x, y) {
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    1 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
  ctx.drawImage(
    tileset,
    2 * TILE_SIZE,
    0 * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x * TILE_SIZE,
    (y - 1) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

