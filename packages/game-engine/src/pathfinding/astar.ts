import { NavigationGrid, GridNode } from './grid';
import { Vector2 } from '../math/vector2';

export class AStarPathfinder {
  public static findPath(
    grid: NavigationGrid,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    allowDiagonal: boolean = false
  ): Vector2[] {
    const startNode = grid.getNode(startX, startY);
    const targetNode = grid.getNode(endX, endY);

    if (!startNode || !targetNode || !startNode.walkable || !targetNode.walkable) {
      return [];
    }

    const openSet: GridNode[] = [startNode];
    const closedSet: Set<GridNode> = new Set();

    startNode.gCost = 0;
    startNode.hCost = this.heuristic(startNode, targetNode);
    startNode.fCost = startNode.hCost;
    startNode.parent = undefined;

    while (openSet.length > 0) {
      let lowestIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fCost < openSet[lowestIndex].fCost) {
          lowestIndex = i;
        }
      }

      const current = openSet.splice(lowestIndex, 1)[0];
      closedSet.add(current);

      if (current.x === targetNode.x && current.y === targetNode.y) {
        return this.reconstructPath(current);
      }

      const neighbors = grid.getNeighbors(current, allowDiagonal);
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue;

        const isDiag = neighbor.x !== current.x && neighbor.y !== current.y;
        const moveCost = isDiag ? 1.414 : 1.0;
        const tentativeG = current.gCost + moveCost * neighbor.cost;

        const inOpenSet = openSet.includes(neighbor);
        if (!inOpenSet || tentativeG < neighbor.gCost) {
          neighbor.parent = current;
          neighbor.gCost = tentativeG;
          neighbor.hCost = this.heuristic(neighbor, targetNode);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;

          if (!inOpenSet) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return [];
  }

  private static heuristic(a: GridNode, b: GridNode): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return dx + dy;
  }

  private static reconstructPath(endNode: GridNode): Vector2[] {
    const path: Vector2[] = [];
    let current: GridNode | undefined = endNode;

    while (current) {
      path.unshift(new Vector2(current.x, current.y));
      current = current.parent;
    }

    return path;
  }
}
