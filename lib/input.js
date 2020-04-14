const keysDown = {}

export function initInput(player, {onPause, onEnter}) {
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !keysDown["Space"]) {
      player.attack()
    }
    if (e.code === "KeyF" && !keysDown["KeyF"]) {
      player.setPickupIntent(true)
    }
    if (e.code === "KeyP" && !keysDown["KeyP"]) {
      onPause()
    }
    if  (e.code === "Enter" && !keysDown["Enter"]) {
      onEnter()
    }
    keysDown[e.code] = true
  })

  document.addEventListener("keyup", (e) => {
    keysDown[e.code] = false
    if (e.code === "KeyF") {
      player.setPickupIntent(false)
    }
  })
}

export function controlPlayer(player) {
  let horizontal = 0
  let vertical = 0
  if (keysDown["ArrowLeft"] || keysDown["KeyA"]) {
    horizontal -= 1
  }
  if (keysDown["ArrowRight"] || keysDown["KeyD"]) {
    horizontal += 1
  }
  if (keysDown["ArrowUp"] || keysDown["KeyW"]) {
    vertical -= 1
  }
  if (keysDown["ArrowDown"] || keysDown["KeyS"]) {
    vertical += 1
  }

  player.setDirection(horizontal, vertical)
}
