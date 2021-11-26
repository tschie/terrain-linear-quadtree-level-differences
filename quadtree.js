import { Box3, Vector3 } from "three";
import { Node } from "./node";

/**
 * Linear Quadtree with Level Differences. Allows for constant time neighbor lookups. Based on the following resources:
 * http://www.lcad.icmc.usp.br/~jbatista/procimg/quadtree_neighbours.pdf
 * https://github.com/dwrodri/LQTLD3/blob/master/quadtrees/trees.py
 */
export class Quadtree {
  /**
   * @type {Box3}
   */
  root;

  /**
   * @type {number}
   */
  maxDepth;

  /**
   * @callback splitConditionCallback
   * @param {Box3} aabb
   * @return boolean
   */
  splitCondition;

  /**
   * @type {Map}
   */
  tree;

  /**
   * @type {number}
   */
  tx;

  /**
   * @type {number}
   */
  ty;

  /**
   * @type {number}
   */
  e;

  /**
   * @type {number}
   */
  n;

  /**
   *
   * @param {Box3} root
   * @param {number} maxDepth
   * @param {splitConditionCallback} splitCondition
   */
  constructor(root, maxDepth, splitCondition) {
    this.root = root;
    this.maxDepth = maxDepth;
    this.splitCondition = splitCondition;
    this.tree = new Map(); // use map to keep insertion order
    this.tree.set(
      0,
      new Node(this, this.root, 0, 0, true, null, null, null, null)
    );
    this.tx = parseInt("01".repeat(maxDepth), 2);
    this.ty = parseInt("10".repeat(maxDepth), 2);
    this.e = parseInt("01", 2);
    this.n = parseInt("10", 2);

    while ([...this.tree.values()].some((node) => node.canBeSplit)) {
      const firstNonLeaf = [...this.tree.values()].find(
        (node) => node.canBeSplit
      );
      firstNonLeaf.updateNeighbors();
      this.tree.delete(firstNonLeaf.code);
      if (firstNonLeaf.depth < maxDepth) {
        firstNonLeaf.east =
          firstNonLeaf.east != null ? firstNonLeaf.east - 1 : null;
        firstNonLeaf.north =
          firstNonLeaf.north != null ? firstNonLeaf.north - 1 : null;
        firstNonLeaf.west =
          firstNonLeaf.west != null ? firstNonLeaf.west - 1 : null;
        firstNonLeaf.south =
          firstNonLeaf.south != null ? firstNonLeaf.south - 1 : null;

        const { depth, code, aabb, east, west, north, south } = firstNonLeaf;

        // split
        const shift = 2 * (maxDepth - (depth + 1));

        const swBox3 = swQuadrant(aabb);
        const sw = new Node(
          this,
          swBox3,
          code | (0 << shift),
          depth + 1,
          splitCondition(swBox3),
          0,
          0,
          west,
          south
        );
        const seBox3 = seQuadrant(aabb);
        const se = new Node(
          this,
          seBox3,
          code | (1 << shift),
          depth + 1,
          splitCondition(seBox3),
          east,
          0,
          0,
          south
        );
        const nwBox3 = nwQuadrant(aabb);
        const nw = new Node(
          this,
          nwBox3,
          code | (2 << shift),
          depth + 1,
          splitCondition(nwBox3),
          0,
          north,
          west,
          0
        );
        const neBox3 = neQuadrant(aabb);
        const ne = new Node(
          this,
          neBox3,
          code | (3 << shift),
          depth + 1,
          splitCondition(neBox3),
          east,
          north,
          0,
          0
        );

        const newNodes = [sw, se, nw, ne];

        // update
        newNodes.forEach((node) => node.updateNeighbors());

        // enqueue
        newNodes.forEach((node) => this.tree.set(node.code, node));
      }
    }
  }

  qlao(code, direction) {
    return (
      (((code | this.ty) + (direction & this.tx)) & this.tx) |
      (((code | this.tx) + (direction & this.ty)) & this.ty)
    );
  }
}

/**
 *
 * @param {Box3} box
 * @returns {Box3}
 */
export function swQuadrant(box) {
  if (box.min.x === box.max.x) {
    return new Box3(box.min, box.getCenter(new Vector3()));
  } else if (box.min.z === box.max.z) {
    return new Box3(box.min, box.getCenter(new Vector3()));
  } else {
    return new Box3(
      new Vector3(box.min.x, box.min.y, box.getCenter(new Vector3()).z),
      new Vector3(box.getCenter(new Vector3()).x, box.max.y, box.max.z)
    );
  }
}

/**
 *
 * @param {Box3} box
 * @returns {Box3}
 */
export function seQuadrant(box) {
  if (box.min.x === box.max.x) {
    return new Box3(
      new Vector3(
        box.getCenter(new Vector3()).x,
        box.min.y,
        box.getCenter(new Vector3()).z
      ),
      new Vector3(box.max.x, box.getCenter(new Vector3()).y, box.max.z)
    );
  } else if (box.min.z === box.max.z) {
    return new Box3(
      new Vector3(box.getCenter(new Vector3()).x, box.min.y, box.min.z),
      new Vector3(box.max.x, box.getCenter(new Vector3()).y, box.max.z)
    );
  } else {
    return new Box3(box.getCenter(new Vector3()), box.max);
  }
}

/**
 *
 * @param {Box3} box
 * @returns {Box3}
 */
export function nwQuadrant(box) {
  if (box.min.x === box.max.x) {
    return new Box3(
      new Vector3(
        box.getCenter(new Vector3()).x,
        box.getCenter(new Vector3()).y,
        box.min.z
      ),
      new Vector3(
        box.getCenter(new Vector3()).x,
        box.max.y,
        box.getCenter(new Vector3()).z
      )
    );
  } else if (box.min.z === box.max.z) {
    return new Box3(
      new Vector3(box.min.x, box.getCenter(new Vector3()).y, box.min.z),
      new Vector3(box.getCenter(new Vector3()).x, box.max.y, box.max.z)
    );
  } else {
    return new Box3(box.min, box.getCenter(new Vector3()));
  }
}

/**
 *
 * @param {Box3} box
 * @returns {Box3}
 */
export function neQuadrant(box) {
  if (box.min.x === box.max.x) {
    return new Box3(box.getCenter(new Vector3()), box.max);
  } else if (box.min.z === box.max.z) {
    return new Box3(box.getCenter(new Vector3()), box.max);
  } else {
    return new Box3(
      new Vector3(box.getCenter(new Vector3()).x, box.min.y, box.min.z),
      new Vector3(box.max.x, box.max.y, box.getCenter(new Vector3()).z)
    );
  }
}
