import { clamp, isEmpty, times, random } from "lodash"

export default function generateDungeon(opts = {}) {
  const {
    worldWidth = 100,
    worldHeight = 100,
    minRoomSize = 5,
    maxRoomSize = 15,
    maxRooms = 20,
    corridorMinSize = 2,
    corridorMaxSize = 5,
  } = opts

  let rooms = []

  times(maxRooms).map((_) => {
    const width = random(minRoomSize, maxRoomSize)
    const height = random(minRoomSize, maxRoomSize)
    const x = random(1, worldWidth - width)
    const y = random(1, worldHeight - height)

    const room = new Room(x, y, width, height)

    if (rooms.every((otherRoom) => !room.intersects(otherRoom))) {
      rooms.push(room)
    }
  })

  let corridors = []

  times(rooms.length - 1).forEach((i) => {
    const room = rooms[i]
    const otherRoom = rooms[i + 1]

    corridors.push(
      new Corridor(room, otherRoom, random(corridorMinSize, corridorMaxSize))
    )
  })

  const tiles = []

  rooms.forEach((room) => {
    times(room.width).forEach((relativeX) => {
      times(room.height).forEach((relativeY) => {
        const x = room.x + relativeX
        const y = room.y + relativeY
        addTile(new Tile(x, y))
      })
    })
  })

  corridors.forEach((corridor) => {
    times(corridor.height).forEach((relativeY) => {
      times(corridor.size).forEach((relativeX) => {
        const x = clamp(
          corridor.fromX + relativeX - Math.floor(corridor.size / 2),
          0,
          worldWidth
        )

        const y = clamp(
          corridor.fromY + (corridor.downToUp ? relativeY : -relativeY),
          0,
          worldHeight
        )

        addTile(new Tile(x, y))
      })
    })

    times(corridor.width).forEach((relativeX) => {
      times(corridor.size).forEach((relativeY) => {
        const x = clamp(
          corridor.fromX +
            (corridor.leftToRight ? relativeX : -relativeX) -
            Math.floor(corridor.size / 2),
          0,
          worldWidth
        )

        const y = clamp(
          corridor.fromY + relativeY - Math.floor(corridor.size / 2),
          0,
          worldHeight
        )

        addTile(new Tile(x, y))
      })
    })
  })

  return tiles

  function addTile(tile) {
    if (
      isEmpty(tiles.filter((other) => other.x === tile.x && other.y === tile.y))
    ) {
      tiles.push(tile)
    }
  }
}

class Room {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.centerX = x + Math.floor(width / 2)
    this.centerY = y + Math.floor(height / 2)
  }

  intersects(other) {
    return (
      this.x <= other.x + other.width &&
      this.x + this.width >= other.x &&
      this.y <= other.y + other.height &&
      this.y + this.height >= other.y
    )
  }
}

class Corridor {
  constructor(fromRoom, toRoom, size) {
    this.fromX = fromRoom.centerX
    this.fromY = fromRoom.centerY
    this.toX = toRoom.centerX
    this.toY = toRoom.centerY
    this.width = Math.abs(fromRoom.centerX - toRoom.centerX)
    this.height = Math.abs(fromRoom.centerY - toRoom.centerY)
    this.downToUp = fromRoom.centerY < toRoom.centerY
    this.leftToRight = fromRoom.centerX < toRoom.centerX
    this.size = size
  }
}

class Tile {
  constructor(x, y, type = "floor") {
    this.x = x
    this.y = y
    this.type = type
  }
}
