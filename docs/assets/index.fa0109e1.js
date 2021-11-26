var _ = Object.defineProperty;
var K = (e, i, n) =>
  i in e
    ? _(e, i, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[i] = n);
var h = (e, i, n) => (K(e, typeof i != "symbol" ? i + "" : i, n), n);
import {
  B as g,
  V as o,
  W as $,
  C as J,
  S as ee,
  P as te,
  F as ne,
  a as oe,
  I as X,
  b as ie,
  c as re,
  d as se,
  G as le,
  e as ae,
  M as L,
  Q as R,
} from "./vendor.c9073afa.js";
const he = function () {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload")) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) l(t);
  new MutationObserver((t) => {
    for (const r of t)
      if (r.type === "childList")
        for (const s of r.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && l(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(t) {
    const r = {};
    return (
      t.integrity && (r.integrity = t.integrity),
      t.referrerpolicy && (r.referrerPolicy = t.referrerpolicy),
      t.crossorigin === "use-credentials"
        ? (r.credentials = "include")
        : t.crossorigin === "anonymous"
        ? (r.credentials = "omit")
        : (r.credentials = "same-origin"),
      r
    );
  }
  function l(t) {
    if (t.ep) return;
    t.ep = !0;
    const r = n(t);
    fetch(t.href, r);
  }
};
he();
class m {
  constructor(i, n, l, t, r, s, a, c, d) {
    h(this, "canBeSplit");
    h(this, "depth");
    h(this, "code");
    h(this, "aabb");
    (this.quadtree = i),
      (this.aabb = n),
      (this.code = l || 0),
      (this.depth = t || 0),
      (this.canBeSplit = r === !0),
      (this.east = s != null ? s : null),
      (this.north = a != null ? a : null),
      (this.west = c != null ? c : null),
      (this.south = d != null ? d : null);
  }
  updateNeighbors() {
    const i = 2 * (this.quadtree.maxDepth - this.depth),
      n =
        this.east != null
          ? this.quadtree.qlao(this.code, this.quadtree.e << i)
          : null,
      l =
        this.north != null
          ? this.quadtree.qlao(this.code, this.quadtree.n << i)
          : null,
      t =
        this.west != null
          ? this.quadtree.qlao(this.code, this.quadtree.tx << i)
          : null,
      r =
        this.south != null
          ? this.quadtree.qlao(this.code, this.quadtree.ty << i)
          : null,
      s = this.quadtree.tree.get(n);
    s != null &&
      s.depth === this.depth &&
      (s.west = s.west ? s.west + 1 : s.west);
    const a = this.quadtree.tree.get(l);
    a != null &&
      a.depth === this.depth &&
      (a.south = a.south ? a.south + 1 : a.south);
    const c = this.quadtree.tree.get(t);
    c != null &&
      c.depth === this.depth &&
      (c.east = c.east ? c.east + 1 : c.east);
    const d = this.quadtree.tree.get(r);
    d != null &&
      d.depth === this.depth &&
      (d.north = d.north ? d.north + 1 : d.north);
  }
  getNeighbor(i) {
    let n = null,
      l = null;
    switch (i) {
      case "E":
        (n = this.east), (l = this.quadtree.e);
        break;
      case "N":
        (n = this.north), (l = this.quadtree.n);
        break;
      case "W":
        (n = this.west), (l = this.quadtree.tx);
        break;
      case "S":
        (n = this.south), (l = this.quadtree.ty);
        break;
    }
    if (n) {
      const t = this.code,
        r = this.depth,
        s = 2 * (this.quadtree.maxDepth - r - n);
      let a;
      return (
        n < 0
          ? (a = this.quadtree.qlao((t >> s) << s, l << s))
          : (a = this.quadtree.qlao(
              this.code,
              l << (2 * (this.quadtree.maxDepth - r))
            )),
        this.quadtree.tree.get(a)
      );
    }
    return null;
  }
  getNeighbors() {
    return [
      this.getNeighbor("N"),
      this.getNeighbor("E"),
      this.getNeighbor("S"),
      this.getNeighbor("W"),
    ];
  }
}
class ge {
  constructor(i, n, l) {
    h(this, "root");
    h(this, "maxDepth");
    h(this, "splitCondition");
    h(this, "tree");
    h(this, "tx");
    h(this, "ty");
    h(this, "e");
    h(this, "n");
    for (
      this.root = i,
        this.maxDepth = n,
        this.splitCondition = l,
        this.tree = new Map(),
        this.tree.set(
          0,
          new m(this, this.root, 0, 0, !0, null, null, null, null)
        ),
        this.tx = parseInt("01".repeat(n), 2),
        this.ty = parseInt("10".repeat(n), 2),
        this.e = parseInt("01", 2),
        this.n = parseInt("10", 2);
      [...this.tree.values()].some((t) => t.canBeSplit);

    ) {
      const t = [...this.tree.values()].find((r) => r.canBeSplit);
      if ((t.updateNeighbors(), this.tree.delete(t.code), t.depth < n)) {
        (t.east = t.east != null ? t.east - 1 : null),
          (t.north = t.north != null ? t.north - 1 : null),
          (t.west = t.west != null ? t.west - 1 : null),
          (t.south = t.south != null ? t.south - 1 : null);
        const {
            depth: r,
            code: s,
            aabb: a,
            east: c,
            west: d,
            north: N,
            south: A,
          } = t,
          w = 2 * (n - (r + 1)),
          M = ce(a),
          U = new m(this, M, s | (0 << w), r + 1, l(M), 0, 0, d, A),
          I = de(a),
          G = new m(this, I, s | (1 << w), r + 1, l(I), c, 0, 0, A),
          F = fe(a),
          V = new m(this, F, s | (2 << w), r + 1, l(F), 0, N, d, 0),
          B = ue(a),
          Y = new m(this, B, s | (3 << w), r + 1, l(B), c, N, 0, 0),
          b = [U, G, V, Y];
        b.forEach((p) => p.updateNeighbors()),
          b.forEach((p) => this.tree.set(p.code, p));
      }
    }
  }
  qlao(i, n) {
    return (
      (((i | this.ty) + (n & this.tx)) & this.tx) |
      (((i | this.tx) + (n & this.ty)) & this.ty)
    );
  }
}
function ce(e) {
  return e.min.x === e.max.x
    ? new g(e.min, e.getCenter(new o()))
    : e.min.z === e.max.z
    ? new g(e.min, e.getCenter(new o()))
    : new g(
        new o(e.min.x, e.min.y, e.getCenter(new o()).z),
        new o(e.getCenter(new o()).x, e.max.y, e.max.z)
      );
}
function de(e) {
  return e.min.x === e.max.x
    ? new g(
        new o(e.getCenter(new o()).x, e.min.y, e.getCenter(new o()).z),
        new o(e.max.x, e.getCenter(new o()).y, e.max.z)
      )
    : e.min.z === e.max.z
    ? new g(
        new o(e.getCenter(new o()).x, e.min.y, e.min.z),
        new o(e.max.x, e.getCenter(new o()).y, e.max.z)
      )
    : new g(e.getCenter(new o()), e.max);
}
function fe(e) {
  return e.min.x === e.max.x
    ? new g(
        new o(e.getCenter(new o()).x, e.getCenter(new o()).y, e.min.z),
        new o(e.getCenter(new o()).x, e.max.y, e.getCenter(new o()).z)
      )
    : e.min.z === e.max.z
    ? new g(
        new o(e.min.x, e.getCenter(new o()).y, e.min.z),
        new o(e.getCenter(new o()).x, e.max.y, e.max.z)
      )
    : new g(e.min, e.getCenter(new o()));
}
function ue(e) {
  return e.min.x === e.max.x
    ? new g(e.getCenter(new o()), e.max)
    : e.min.z === e.max.z
    ? new g(e.getCenter(new o()), e.max)
    : new g(
        new o(e.getCenter(new o()).x, e.min.y, e.min.z),
        new o(e.max.x, e.max.y, e.getCenter(new o()).z)
      );
}
const me = `
precision mediump float;

varying vec3 vNormal;

void main() {
    // calculate lighting based on normal and hardcoded light
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    float brightness = max(dot(vNormal, light), 0.05);
    vec3 diffuse = brightness * vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4(diffuse, 1.0);
}
`,
  we = `
    precision mediump float;

    attribute float sideLength;
    attribute vec4 neighborSideLengths;

    varying vec3 vNormal;

    uniform vec2 offsets[5];
    uniform float minSideLength;

    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289((x * 34.0 + 1.0) * x);
    }

    vec4 taylorInvSqrt(vec4 v) {
        return 1.79284291400159 - 0.85373472095314 * v;
    }

    vec3 fade(vec3 t) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    float perlinNoise(vec3 v) {
        vec3 i0 = mod289(floor(v));
        vec3 i1 = mod289(i0 + vec3(1.0));
        vec3 f0 = fract(v);
        vec3 f1 = f0 - vec3(1.0);
        vec3 f = fade(f0);
        vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x);
        vec4 iy = vec4(i0.y, i0.y, i1.y, i1.y);
        vec4 iz0 = vec4(i0.z);
        vec4 iz1 = vec4(i1.z);
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        gx1 = fract(gx1);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
        vec3 g0 = vec3(gx0.x, gy0.x, gz0.x);
        vec3 g1 = vec3(gx0.y, gy0.y, gz0.y);
        vec3 g2 = vec3(gx0.z, gy0.z, gz0.z);
        vec3 g3 = vec3(gx0.w, gy0.w, gz0.w);
        vec3 g4 = vec3(gx1.x, gy1.x, gz1.x);
        vec3 g5 = vec3(gx1.y, gy1.y, gz1.y);
        vec3 g6 = vec3(gx1.z, gy1.z, gz1.z);
        vec3 g7 = vec3(gx1.w, gy1.w, gz1.w);
        vec4 norm0 = taylorInvSqrt(vec4(dot(g0, g0), dot(g2, g2), dot(g1, g1), dot(g3, g3)));
        vec4 norm1 = taylorInvSqrt(vec4(dot(g4, g4), dot(g6, g6), dot(g5, g5), dot(g7, g7)));
        g0 *= norm0.x;
        g2 *= norm0.y;
        g1 *= norm0.z;
        g3 *= norm0.w;
        g4 *= norm1.x;
        g6 *= norm1.y;
        g5 *= norm1.z;
        g7 *= norm1.w;
        vec4 nz = mix(
          vec4(
            dot(g0, vec3(f0.x, f0.y, f0.z)),
            dot(g1, vec3(f1.x, f0.y, f0.z)),
            dot(g2, vec3(f0.x, f1.y, f0.z)),
            dot(g3, vec3(f1.x, f1.y, f0.z))
          ),
          vec4(
            dot(g4, vec3(f0.x, f0.y, f1.z)),
            dot(g5, vec3(f1.x, f0.y, f1.z)),
            dot(g6, vec3(f0.x, f1.y, f1.z)),
            dot(g7, vec3(f1.x, f1.y, f1.z))
          ),
          f.z
        );
        return 2.2 * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
    }
    
    float perlinNoise(float x, float y) {
        return perlinNoise(vec3(x, y, 0.0));
    }

    // apply fractal brownian motion to noise
    float fbm(float x, float y) {
        float scale = 50.0;
        float lacunarity = 5.6;
        float persistence = 0.3;
        float amplitude = 1.0;
        float frequency = 1.0;
        float noiseHeight = 0.0;
        // 5 "octaves"
        for (int i = 0; i < 5; i++) {
            float sampleX = (x + offsets[i].x) / scale * frequency;
            float sampleY = (y + offsets[i].y) / scale * frequency;
            float sampleHeight = perlinNoise(sampleX, sampleY);
            noiseHeight += sampleHeight * amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return noiseHeight;
    }

    float easeInCubic(float x) {
        return x * x * x;
    }

    float height(float x, float z) {
        return 20.0 * abs(easeInCubic(fbm(x, z)));
    }

    /**
      On edges of tile (determined in local space), interpolate between heights calculated at nearest points on neighboring tile.
      Interpolation only needs to occur if neighbor tile is larger than current tile.
    **/
    float heightBlended(vec3 localPos, vec3 worldPos) {
        float topSideLength = neighborSideLengths.x;
        float rightSideLength = neighborSideLengths.y;
        float bottomSideLength = neighborSideLengths.z;
        float leftSideLength = neighborSideLengths.w;
        // tile is 1x1 (-.5, 5) in local space
        if (topSideLength > sideLength && localPos.z < -0.4999) {
            // determine closest vertices on top neighbor to current vertex
            float cellLength = sideLength / minSideLength; // length of one cell of this tile
            float topCellLength = topSideLength / minSideLength; // length of one cell of top tile
            float lengthAlongTopCell = mod(localPos.x * sideLength, topCellLength); // distance from closest previous cell of top tile
            float a = lengthAlongTopCell / topCellLength; // ratio across cell
            float prevX = worldPos.x - lengthAlongTopCell; // closest previous vertex on top tile
            float nextX = worldPos.x + (topCellLength - lengthAlongTopCell); // closest next vertex on top tle
            return mix(height(prevX, worldPos.z), height(nextX, worldPos.z), a); // linearly interpolate between to points
        } else if (rightSideLength > sideLength && localPos.x > 0.4999) {
            float cellLength = sideLength / minSideLength;
            float rightCellLength = rightSideLength / minSideLength;
            float lengthAlongRightCell = mod(localPos.z * sideLength, rightCellLength);
            float a = lengthAlongRightCell / rightCellLength;
            float prevZ = worldPos.z - lengthAlongRightCell;
            float nextZ = worldPos.z + (rightCellLength - lengthAlongRightCell);

            return mix(height(worldPos.x, prevZ), height(worldPos.x, nextZ), a);
        } else if (bottomSideLength > 1.0 && localPos.z > 0.4999) {
            float cellLength = sideLength / minSideLength;
            float bottomCellLength = bottomSideLength / minSideLength;
            float lengthAlongTopCell = mod(localPos.x * sideLength, bottomCellLength);
            float a = lengthAlongTopCell / bottomCellLength;
            float prevX = worldPos.x - lengthAlongTopCell;
            float nextX = worldPos.x + (bottomCellLength - lengthAlongTopCell);

            return mix(height(prevX, worldPos.z), height(nextX, worldPos.z), a);
        } else if (leftSideLength > sideLength && localPos.x < -0.4999) {
            float cellLength = sideLength / minSideLength;
            float leftCellLength = leftSideLength / minSideLength;
            float lengthAlongRightCell = mod(localPos.z * sideLength, leftCellLength);
            float a = lengthAlongRightCell / leftCellLength;
            float prevZ = worldPos.z - lengthAlongRightCell;
            float nextZ = worldPos.z + (leftCellLength - lengthAlongRightCell);

            return mix(height(worldPos.x, prevZ), height(worldPos.x, nextZ), a);
        } else {
            return height(worldPos.x, worldPos.z);
        }
    }

    // calculate using finite differences of neighbors
    vec3 calcNormal(vec3 pos) {
        float x = pos.x;
        float z = pos.z;
        float heightLeft = height(x - 1.0, z);
        float heightRight = height(x + 1.0, z);
        float heightDown = height(x, z - 1.0);
        float heightUp = height(x, z + 1.0);
        return normalize(vec3(heightLeft - heightRight, 2.0, heightDown - heightUp));
    }

    void main() {
        // world position for the vertex in this instance
        vec3 worldPosition = (instanceMatrix * vec4(position, 1.0)).xyz;
        // adjust y value with noise height
        vec3 finalPosition = vec3(worldPosition.x, heightBlended(position, worldPosition), worldPosition.z);
        // pass calculated normal to fragment shader
        vNormal = calcNormal(worldPosition);
        gl_Position = projectionMatrix * viewMatrix * vec4(finalPosition, 1.0);
    }
`,
  C = 6,
  T = 14,
  v = Math.pow(2, T),
  pe = new g(new o(-1 * v, 0, -1 * v), new o(v, 0, v)),
  ve = T - C + 1,
  f = document.querySelector("canvas"),
  S = new $({ canvas: f }),
  xe = new J(),
  E = new ee(),
  u = new te(75, f.offsetWidth / f.offsetHeight, 0.1, 1e5);
u.position.set(0, 40, 40);
const H = () => {
  (f.width = f.offsetWidth),
    (f.height = f.offsetHeight),
    (u.aspect = f.offsetWidth / f.offsetHeight),
    u.updateProjectionMatrix(),
    S.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", H);
H();
const x = new ne(u, S.domElement);
x.dragToLook = !0;
x.movementSpeed = 150;
x.rollSpeed = 1;
const ye = () =>
    [...Array(5)].flatMap(() => {
      const e = -1e5 + Math.random() * 1e5,
        i = -1e5 + Math.random() * 1e5;
      return [e, i];
    }),
  y = new oe(1, 1, 64, 64);
y.rotateX(-Math.PI / 2);
const P = new X(new Float32Array(1e3), 1, !1, 1),
  q = new X(new Float32Array(1e3 * 4), 4, !1, 1);
y.setAttribute("sideLength", P);
y.setAttribute("neighborSideLengths", q);
const W = new ie({
    uniforms: {
      minSideLength: { value: Math.pow(2, C) },
      offsets: { type: "v2v", value: ye() },
    },
    vertexShader: we,
    fragmentShader: me,
  }),
  z = new re(y, W, 1e3);
E.add(z);
const D = se();
document.body.appendChild(D.domElement);
const Q = new le(),
  Z = { update: !0 },
  k = Q.addFolder("Quadtree");
k.add(Z, "update", !0);
k.open();
const O = Q.addFolder("Material");
O.add(W, "wireframe", !1);
O.open();
const j = () => {
  if ((requestAnimationFrame(j), x.update(xe.getDelta()), Z.update)) {
    const e = new ae().setFromProjectionMatrix(
        new L().multiply(u.projectionMatrix, u.matrixWorldInverse)
      ),
      i = new ge(
        pe,
        ve,
        (n) =>
          e.intersectsBox(n) &&
          n.max.x - n.min.x > Math.pow(2, C) &&
          n.getCenter(new o()).distanceTo(u.position) <
            n.getSize(new o()).length()
      );
    [...i.tree.values()].forEach((n, l) => {
      const t = n.aabb.max.x - n.aabb.min.x,
        r = n.getNeighbors().map((s) => (s ? s.aabb.max.x - s.aabb.min.x : t));
      z.setMatrixAt(
        l,
        new L().compose(n.aabb.getCenter(new o()), new R(), new o(t, 1, t))
      ),
        P.set(Float32Array.from([t]), l),
        q.set(Float32Array.from(r), l * 4);
    });
    for (let n = i.tree.size; n < 1e3; n++)
      z.setMatrixAt(
        n,
        new L().compose(new o(0, -1e3, 0), new R(), new o(0, 0, 0))
      );
    (q.needsUpdate = !0),
      (P.needsUpdate = !0),
      (z.instanceMatrix.needsUpdate = !0);
  }
  S.render(E, u), D.update();
};
j();
