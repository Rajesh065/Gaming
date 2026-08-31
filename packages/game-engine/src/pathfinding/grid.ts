export interface GridNode {
  x: number;
  y: number;
  walkable: boolean;
  cost: number;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: GridNode;
}

export class NavigationGrid {
  public width: number;
  public height: number;
  public nodes: GridNode[][];

  constructor(width: number, height: number, defaultWalkable: boolean = true) {
    this.width = width;
    this.height = height;
    this.nodes = [];

    for (let x = 0; x < width; x++) {
      this.nodes[x] = [];
      for (let y = 0; y < height; y++) {
        this.nodes[x][y] = {
          x,
          y,
          walkable: defaultWalkable,
          cost: 1.0,
          gCost: 0,
          hCost: 0,
          fCost: 0
        };
      }
    }
  }

  public setWalkable(x: number, y: number, walkable: boolean): void {
    if (this.isValidCoord(x, y)) {
      this.nodes[x][y].walkable = walkable;
    }
  }

  public getNode(x: number, y: number): GridNode | null {
    if (!this.isValidCoord(x, y)) return null;
    return this.nodes[x][y];
  }

  public isValidCoord(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public getNeighbors(node: GridNode, allowDiagonal: boolean = false): GridNode[] {
    const neighbors: GridNode[] = [];
    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 }
    ];

    if (allowDiagonal) {
      directions.push(
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
      );
    }

    for (const dir of directions) {
      const nx = node.x + dir.x;
      const ny = node.y + dir.y;
      if (this.isValidCoord(nx, ny)) {
        const neighbor = this.nodes[nx][ny];
        if (neighbor.walkable) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }
}
