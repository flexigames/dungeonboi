const keysDown = {}

export function initInput(player) {
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !keysDown["Space"]) {
      player.attack()
    }
    keysDown[e.code] = true
  })

  document.addEventListener("keyup", (e) => {
    keysDown[e.code] = false
  })
}

export function controlPlayer(player) {
  let horizontal = 0
  let vertical = 0
  if (keysDown["ArrowLeft"]) {
    horizontal -= 1
  }
  if (keysDown["ArrowRight"]) {
    horizontal += 1
  }
  if (keysDown["ArrowUp"]) {
    vertical -= 1
  }
  if (keysDown["ArrowDown"]) {
    vertical += 1
  }

  player.setDirection(horizontal, vertical)
}
