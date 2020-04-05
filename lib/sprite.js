import tilesList from "../tiles_list_v1.3.txt"

const tileset = new Image(512, 512)

tileset.src =
  "https://cdn.glitch.com/8804483f-7435-434d-ab8d-d8d811696a6a%2F0x72_DungeonTilesetII_v1.3.png?v=1586091258409"

const sprites = tilesList
  .split("\n")
  .map(line => {
    const [name, sx, sy, swidth, sheight, frames] = line.split(" ")
    return {
      name,
      sx: parseInt(sx),
      sy: parseInt(sy),
      swidth: parseInt(swidth),
      sheight: parseInt(sheight),
      frames: parseInt(frames)
    }
  })
  .reduce((prev, { name, ...rest }) => ({ ...prev, [name]: { ...rest } }), {})

function drawSprite(ctx, name, x, y, flipped = false) {
  const sprite = sprites[name]

  if (sprite) {
    const { sx, sy, swidth, sheight } = sprite
    ctx.save()
    if (flipped) ctx.scale(-1, 1)
    ctx.drawImage(tileset, sx, sy, swidth, sheight, x, y, swidth, sheight)
    ctx.restore()
  }
}

export function animateSprite(ctx, name, x, y, flipped = false, delay = 100) {
  const sprite = sprites[name]

  if (sprite) {
    const { sx, sy, swidth, sheight, frames } = sprite
    const frame = Math.round(Date.now() / delay) % frames
    ctx.save()
    if (flipped) {
      ctx.translate(document.getElementById('game').width, 0);
      ctx.scale(-1, 1)
    }
    ctx.drawImage(
      tileset,
      sx + frame * swidth,
      sy,
      swidth,
      sheight,
      x /*+ (flipped ? swidth * frames: 0)*/,
      y,
      swidth,
      sheight
    )
    ctx.restore()
  }
}

export default drawSprite
