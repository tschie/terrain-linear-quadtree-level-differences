// language=glsl
export const terrainVertexShader = `
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
`;
