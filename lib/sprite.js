import tilesList from "../tiles_list_v1.3.txt"

const tileset = new Image(512, 512)
tileset.src = "assets/img/dungeon_tileset.png"

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
  const {
    flipped = false,
    delay = 100,
    rotation = 0,
    anchor = [0, 0],
    scale = 1,
  } = opts
  const sprite = sprites[name]

  if (sprite) {
    const { sx, sy, swidth, sheight, frames } = sprite
    const frame = frames ? Math.round(Date.now() / delay) % frames : 0
    const width = swidth * scale
    const height = sheight * scale

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(((flipped ? -1 : 1) * (rotation * Math.PI)) / 180)

    if (flipped) ctx.scale(-1, 1)
    ctx.drawImage(
      tileset,
      sx + frame * width,
      sy,
      swidth,
      sheight,
      (flipped ? -width : 0) - (flipped ? -1 : 1) * anchor[0],
      0 - anchor[1],
      width,
      height
    )
    ctx.restore()
  }
}

export default drawSprite
