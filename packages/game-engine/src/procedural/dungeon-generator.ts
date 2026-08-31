export interface DungeonRoom {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export enum TileType {
  VOID = 0,
  WALL = 1,
  FLOOR = 2,
  DOOR = 3,
  SPAWN = 4,
  CHEST = 5,
  BOSS = 6,
  EXIT = 7
}

export interface GeneratedDungeon {
  width: number;
  height: number;
  tiles: TileType[][];
  rooms: DungeonRoom[];
  spawnPoint: { x: number; y: number };
  exitPoint: { x: number; y: number };
  chests: Array<{ x: number; y: number; tier: number }>;
}

export class DungeonGenerator {
  public static generate(
    width: number = 50,
    height: number = 50,
    maxRooms: number = 12,
    minRoomSize: number = 5,
    maxRoomSize: number = 10
  ): GeneratedDungeon {
    const tiles: TileType[][] = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => TileType.WALL)
    );
    const rooms: DungeonRoom[] = [];

    for (let r = 0; r < maxRooms * 3 && rooms.length < maxRooms; r++) {
      const rw = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      const rh = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      const rx = Math.floor(Math.random() * (width - rw - 2)) + 1;
      const ry = Math.floor(Math.random() * (height - rh - 2)) + 1;

      const newRoom: DungeonRoom = {
        x: rx,
        y: ry,
        width: rw,
        height: rh,
        centerX: Math.floor(rx + rw / 2),
        centerY: Math.floor(ry + rh / 2)
      };

      let overlaps = false;
      for (const other of rooms) {
        if (
          rx < other.x + other.width + 1 &&
          rx + rw + 1 > other.x &&
          ry < other.y + other.height + 1 &&
          ry + rh + 1 > other.y
        ) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        // Carve room
        for (let x = rx; x < rx + rw; x++) {
          for (let y = ry; y < ry + rh; y++) {
            tiles[x][y] = TileType.FLOOR;
          }
        }

        if (rooms.length > 0) {
          // Carve corridor to previous room
          const prev = rooms[rooms.length - 1];
          let cx = newRoom.centerX;
          let cy = newRoom.centerY;

          while (cx !== prev.centerX) {
            tiles[cx][cy] = TileType.FLOOR;
            cx += cx < prev.centerX ? 1 : -1;
          }
          while (cy !== prev.centerY) {
            tiles[cx][cy] = TileType.FLOOR;
            cy += cy < prev.centerY ? 1 : -1;
          }
        }

        rooms.push(newRoom);
      }
    }

    const spawnPoint = rooms[0]
      ? { x: rooms[0].centerX, y: rooms[0].centerY }
      : { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    const lastRoom = rooms[rooms.length - 1] || rooms[0];
    const exitPoint = { x: lastRoom.centerX, y: lastRoom.centerY };

    tiles[spawnPoint.x][spawnPoint.y] = TileType.SPAWN;
    tiles[exitPoint.x][exitPoint.y] = TileType.EXIT;

    const chests: Array<{ x: number; y: number; tier: number }> = [];
    for (let i = 1; i < rooms.length - 1; i++) {
      if (Math.random() > 0.3) {
        const room = rooms[i];
        tiles[room.centerX][room.centerY] = TileType.CHEST;
        chests.push({
          x: room.centerX,
          y: room.centerY,
          tier: Math.floor(Math.random() * 3) + 1
        });
      }
    }

    return {
      width,
      height,
      tiles,
      rooms,
      spawnPoint,
      exitPoint,
      chests
    };
  }
}
