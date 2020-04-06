import tilesList from "../tiles_list_v1.3.txt"

const tileset = new Image(512, 512)

tileset.src =
  "https://cdn.glitch.com/8804483f-7435-434d-ab8d-d8d811696a6a%2F0x72_DungeonTilesetII_v1.3.png"

const sprites = tilesList
  .split("\n")
  .map((line) => {
    const [name, sx, sy, swidth, sheight, frames] = line.split(" ")
    return {
      name,
      sx: parseInt(sx),
      sy: parseInt(sy),
      swidth: parseInt(swidth),
      sheight: parseInt(sheight),
      frames: parseInt(frames),
    }
  })
  .reduce((prev, { name, ...rest }) => ({ ...prev, [name]: { ...rest } }), {})

export function drawSprite(ctx, name, x, y, opts = {}) {
  const { flipped = false, delay = 100, rotation = 0, anchor = [0, 0] } = opts
  const sprite = sprites[name]

  if (sprite) {
    const { sx, sy, swidth, sheight, frames } = sprite
    const frame = frames ? Math.round(Date.now() / delay) % frames : 0

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)

    if (flipped) ctx.scale(-1, 1)
    ctx.drawImage(
      tileset,
      sx + frame * swidth,
      sy,
      swidth,
      sheight,
      (flipped ? -swidth : 0) - anchor[0],
      0 - anchor[1],
      swidth,
      sheight
    )
    ctx.restore()
  }
}

export default drawSprite
