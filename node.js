import {AABB} from "./aabb";

export class Node {

  /**
   * If the node can be split further (not a leaf).
   *
   * @type {boolean}
   */
  canBeSplit

  /**
   * Depth of node in tree.
   *
   * @type {number}
   */
  depth

  /**
   * Unique binary encoding for the node.
   *
   * @type {number}
   */
  code

  /**
   * Boundary of the node.
   *
   * @type {AABB}
   */
  aabb;

  /**
   *
   * @param {Quadtree} quadtree used to access constants and lookup other nodes in the tree
   * @param {AABB} aabb
   * @param {number} code
   * @param {number} depth
   * @param canBeSplit
   * @param {number | null} east
   * @param {number | null} north
   * @param {number | null} west
   * @param {number | null} south
   */
  constructor(
    quadtree,
    aabb,
    code,
    depth,
    canBeSplit,
    east,
    north,
    west,
    south
  ) {
    this.quadtree = quadtree
    this.aabb = aabb;
    this.code = code ? code : 0;
    this.depth = depth ? depth : 0;
    this.canBeSplit = canBeSplit === true
    this.east = east != null ? east : null
    this.north = north != null ? north : null
    this.west = west != null ? west : null
    this.south = south != null ? south : null
  }

  updateNeighbors() {
    const shift = 2 * (this.quadtree.maxDepth - this.depth)
    const east = this.east != null ? this.quadtree.qlao(this.code, this.quadtree.e << shift) : null
    const north = this.north != null ? this.quadtree.qlao(this.code, this.quadtree.n << shift) : null
    const west = this.west != null ? this.quadtree.qlao(this.code, this.quadtree.tx << shift) : null
    const south = this.south != null ? this.quadtree.qlao(this.code, this.quadtree.ty << shift) : null
    const eastNeighbor = this.quadtree.tree.get(east)
    if (eastNeighbor != null && eastNeighbor.depth === this.depth) {
      eastNeighbor.west = eastNeighbor.west ? eastNeighbor.west + 1 : eastNeighbor.west
    }
    const northNeighbor = this.quadtree.tree.get(north)
    if (northNeighbor != null && northNeighbor.depth === this.depth) {
      northNeighbor.south = northNeighbor.south ? northNeighbor.south + 1 : northNeighbor.south
    }
    const westNeighbor = this.quadtree.tree.get(west)
    if (westNeighbor != null && westNeighbor.depth === this.depth) {
      westNeighbor.east = westNeighbor.east? westNeighbor.east + 1 : westNeighbor.east
    }
    const southNeighbor = this.quadtree.tree.get(south)
    if (southNeighbor != null && southNeighbor.depth === this.depth) {
      southNeighbor.north = southNeighbor.north ? southNeighbor.north + 1 : southNeighbor.north
    }
  }

  getNeighbor(direction) {
    let neighborDelta = null
    let directionCode = null
    switch (direction) {
      case "E":
        neighborDelta = this.east;
        directionCode = this.quadtree.e
        break
      case "N":
        neighborDelta = this.north;
        directionCode = this.quadtree.n
        break
      case "W":
        neighborDelta = this.west;
        directionCode = this.quadtree.tx
        break
      case "S":
        neighborDelta = this.south;
        directionCode = this.quadtree.ty
        break
    }

    if (neighborDelta) {
      const nq = this.code
      const l = this.depth
      const shift = 2 * (this.quadtree.maxDepth - l - neighborDelta)
      let neighborCode
      if (neighborDelta < 0) {
        neighborCode = this.quadtree.qlao(nq >> shift << shift, directionCode << shift)
      } else {
        neighborCode = this.quadtree.qlao(this.code, directionCode << (2 * (this.quadtree.maxDepth - l)))
      }
      return this.quadtree.tree.get(neighborCode)
    }

    return null
  }

  getNeighbors() {
    return [
      this.getNeighbor("N"),
      this.getNeighbor("E"),
      this.getNeighbor("S"),
      this.getNeighbor("W")
    ]
  }
}
