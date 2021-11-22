import {Node} from "./node"

/**
 * Linear Quadtree with Level Differences. Allows for constant time neighbor lookups. Based on the following resources:
 * http://www.lcad.icmc.usp.br/~jbatista/procimg/quadtree_neighbours.pdf
 * https://github.com/dwrodri/LQTLD3/blob/master/quadtrees/trees.py
 */
export class Quadtree {

  /**
   * @type {AABB}
   */
  root

  /**
   * @type {number}
   */
  maxDepth

  /**
   * @callback splitConditionCallback
   * @param {AABB} aabb
   * @return boolean
   */
  splitCondition

  /**
   * @type {Map}
   */
  tree

  /**
   * @type {number}
   */
  tx

  /**
   * @type {number}
   */
  ty

  /**
   * @type {number}
   */
  e

  /**
   * @type {number}
   */
  n

  /**
   *
   * @param {AABB} root
   * @param {number} maxDepth
   * @param {splitConditionCallback} splitCondition
   */
  constructor(root, maxDepth, splitCondition) {
    this.root = root;
    this.maxDepth = maxDepth;
    this.splitCondition = splitCondition;
    this.tree = new Map(); // use map to keep insertion order
    this.tree.set(0, new Node(this, this.root, 0, 0, true, null, null, null, null))
    this.tx = parseInt("01".repeat(maxDepth), 2)
    this.ty = parseInt("10".repeat(maxDepth), 2)
    this.e = parseInt("01", 2)
    this.n = parseInt("10", 2)

    while ([...this.tree.values()].some(node => node.canBeSplit)) {
      const firstNonLeaf = [...this.tree.values()].find(node => node.canBeSplit)
      firstNonLeaf.updateNeighbors()
      this.tree.delete(firstNonLeaf.code)
      if (firstNonLeaf.depth < maxDepth) {

        firstNonLeaf.east = firstNonLeaf.east != null ? firstNonLeaf.east - 1 : null
        firstNonLeaf.north = firstNonLeaf.north != null ? firstNonLeaf.north - 1 : null
        firstNonLeaf.west = firstNonLeaf.west != null ? firstNonLeaf.west - 1 : null
        firstNonLeaf.south = firstNonLeaf.south != null ? firstNonLeaf.south - 1 : null

        const {depth, code, aabb, east, west, north, south} = firstNonLeaf

        // split
        const shift = 2 * (maxDepth - (depth + 1))

        const swAABB = aabb.swQuadrant
        const sw = new Node(this, swAABB, code | (0 << shift), depth + 1, splitCondition(swAABB), 0, 0, west, south)
        const seAABB = aabb.seQuadrant
        const se = new Node(this, seAABB, code | (1 << shift), depth + 1, splitCondition(seAABB), east, 0, 0, south)
        const nwAABB = aabb.nwQuadrant
        const nw = new Node(this, nwAABB, code | (2 << shift), depth + 1, splitCondition(nwAABB), 0, north, west, 0)
        const neAABB = aabb.neQuadrant
        const ne = new Node(this, neAABB, code | (3 << shift), depth + 1, splitCondition(neAABB), east, north, 0, 0)

        const newNodes = [sw, se, nw, ne]

        // update
        newNodes.forEach(node => node.updateNeighbors())

        // enqueue
        newNodes.forEach(node => this.tree.set(node.code, node))
      }
    }
  }

  qlao(code, direction) {
    return (((code | this.ty) + (direction & this.tx)) & this.tx) | (((code | this.tx) + (direction & this.ty)) & this.ty)
  }
}

