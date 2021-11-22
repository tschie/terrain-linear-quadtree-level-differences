import {Vector3} from "three";

/**
 * 3D axis-aligned bounding box.
 */
export class AABB {
  /**
   * @type {Vector3}
   */
  min

  /**
   * @type {Vector3}
   */
  max

  /**
   * @type {Vector3}
   */
  center

  /**
   *
   * @param {Vector3} min
   * @param {Vector3} max
   */
  constructor(min, max) {
    this.min = min
    this.max = max
    this.center = this.min.clone().add(this.max.clone()).multiplyScalar(0.5)
  }

  get swQuadrant() {
    if (this.min.x === this.max.x) {
      return new AABB(this.min, this.center)
    } else if (this.min.z === this.max.z) {
      return new AABB(this.min, this.center)
    } else {
      return new AABB(new Vector3(this.min.x, this.min.y, this.center.z), new Vector3(this.center.x, this.max.y, this.max.z))
    }
  }

  get seQuadrant() {
    if (this.min.x === this.max.x) {
      return new AABB(new Vector3(this.center.x, this.min.y, this.center.z), new Vector3(this.max.x, this.center.y, this.max.z))
    } else if (this.min.z === this.max.z) {
      return new AABB(new Vector3(this.center.x, this.min.y, this.min.z), new Vector3(this.max.x, this.center.y, this.max.z));
    } else {
      return new AABB(this.center, this.max)
    }
  }

  get nwQuadrant() {
    if (this.min.x === this.max.x) {
      return new AABB(new Vector3(this.center.x, this.center.y, this.min.z), new Vector3(this.center.x, this.max.y, this.center.z))
    } else if (this.min.z === this.max.z) {
      return new AABB(new Vector3(this.min.x, this.center.y, this.min.z), new Vector3(this.center.x, this.max.y, this.max.z))
    } else {
      return new AABB(this.min, this.center)
    }
  }

  get neQuadrant() {
    if (this.min.x === this.max.x) {
      return new AABB(this.center, this.max)
    } else if (this.min.z === this.max.z) {
      return new AABB(this.center, this.max)
    } else {
      return new AABB(new Vector3(this.center.x, this.min.y, this.min.z), new Vector3(this.max.x, this.max.y, this.center.z))
    }
  }

  get size() {
    return this.max.distanceTo(this.min)
  }
}
