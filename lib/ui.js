function drawUI(ctx) {
  ctx.save()
  ctx.fillStyle = "#eee"
  ctx.fillText("Score: 0", 0, 20);
  ctx.restore()
}

export default drawUI