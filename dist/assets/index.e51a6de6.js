var V=Object.defineProperty;var Y=(c,e,n)=>e in c?V(c,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):c[e]=n;var a=(c,e,n)=>(Y(c,typeof e!="symbol"?e+"":e,n),n);import{V as l,W as K,C as $,S as J,P as B,F as _,a as ee,I as X,b as te,c as ne,d as ie,G as oe,M as Q,Q as R}from"./vendor.5696c99c.js";const se=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerpolicy&&(i.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?i.credentials="include":t.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(t){if(t.ep)return;t.ep=!0;const i=n(t);fetch(t.href,i)}};se();class h{constructor(e,n){a(this,"min");a(this,"max");a(this,"center");this.min=e,this.max=n,this.center=this.min.clone().add(this.max.clone()).multiplyScalar(.5)}get swQuadrant(){return this.min.x===this.max.x?new h(this.min,this.center):this.min.z===this.max.z?new h(this.min,this.center):new h(new l(this.min.x,this.min.y,this.center.z),new l(this.center.x,this.max.y,this.max.z))}get seQuadrant(){return this.min.x===this.max.x?new h(new l(this.center.x,this.min.y,this.center.z),new l(this.max.x,this.center.y,this.max.z)):this.min.z===this.max.z?new h(new l(this.center.x,this.min.y,this.min.z),new l(this.max.x,this.center.y,this.max.z)):new h(this.center,this.max)}get nwQuadrant(){return this.min.x===this.max.x?new h(new l(this.center.x,this.center.y,this.min.z),new l(this.center.x,this.max.y,this.center.z)):this.min.z===this.max.z?new h(new l(this.min.x,this.center.y,this.min.z),new l(this.center.x,this.max.y,this.max.z)):new h(this.min,this.center)}get neQuadrant(){return this.min.x===this.max.x?new h(this.center,this.max):this.min.z===this.max.z?new h(this.center,this.max):new h(new l(this.center.x,this.min.y,this.min.z),new l(this.max.x,this.max.y,this.center.z))}get size(){return this.max.distanceTo(this.min)}}class x{constructor(e,n,o,t,i,s,r,g,d){a(this,"canBeSplit");a(this,"depth");a(this,"code");a(this,"aabb");this.quadtree=e,this.aabb=n,this.code=o||0,this.depth=t||0,this.canBeSplit=i===!0,this.east=s!=null?s:null,this.north=r!=null?r:null,this.west=g!=null?g:null,this.south=d!=null?d:null}updateNeighbors(){const e=2*(this.quadtree.maxDepth-this.depth),n=this.east!=null?this.quadtree.qlao(this.code,this.quadtree.e<<e):null,o=this.north!=null?this.quadtree.qlao(this.code,this.quadtree.n<<e):null,t=this.west!=null?this.quadtree.qlao(this.code,this.quadtree.tx<<e):null,i=this.south!=null?this.quadtree.qlao(this.code,this.quadtree.ty<<e):null,s=this.quadtree.tree.get(n);s!=null&&s.depth===this.depth&&(s.west=s.west?s.west+1:s.west);const r=this.quadtree.tree.get(o);r!=null&&r.depth===this.depth&&(r.south=r.south?r.south+1:r.south);const g=this.quadtree.tree.get(t);g!=null&&g.depth===this.depth&&(g.east=g.east?g.east+1:g.east);const d=this.quadtree.tree.get(i);d!=null&&d.depth===this.depth&&(d.north=d.north?d.north+1:d.north)}getNeighbor(e){let n=null,o=null;switch(e){case"E":n=this.east,o=this.quadtree.e;break;case"N":n=this.north,o=this.quadtree.n;break;case"W":n=this.west,o=this.quadtree.tx;break;case"S":n=this.south,o=this.quadtree.ty;break}if(n){const t=this.code,i=this.depth,s=2*(this.quadtree.maxDepth-i-n);let r;return n<0?r=this.quadtree.qlao(t>>s<<s,o<<s):r=this.quadtree.qlao(this.code,o<<2*(this.quadtree.maxDepth-i)),this.quadtree.tree.get(r)}return null}getNeighbors(){return[this.getNeighbor("N"),this.getNeighbor("E"),this.getNeighbor("S"),this.getNeighbor("W")]}}class re{constructor(e,n,o){a(this,"root");a(this,"maxDepth");a(this,"splitCondition");a(this,"tree");a(this,"tx");a(this,"ty");a(this,"e");a(this,"n");for(this.root=e,this.maxDepth=n,this.splitCondition=o,this.tree=new Map,this.tree.set(0,new x(this,this.root,0,0,!0,null,null,null,null)),this.tx=parseInt("01".repeat(n),2),this.ty=parseInt("10".repeat(n),2),this.e=parseInt("01",2),this.n=parseInt("10",2);[...this.tree.values()].some(t=>t.canBeSplit);){const t=[...this.tree.values()].find(i=>i.canBeSplit);if(t.updateNeighbors(),this.tree.delete(t.code),t.depth<n){t.east=t.east!=null?t.east-1:null,t.north=t.north!=null?t.north-1:null,t.west=t.west!=null?t.west-1:null,t.south=t.south!=null?t.south-1:null;const{depth:i,code:s,aabb:r,east:g,west:d,north:q,south:C}=t,m=2*(n-(i+1)),N=r.swQuadrant,O=new x(this,N,s|0<<m,i+1,o(N),0,0,d,C),M=r.seQuadrant,U=new x(this,M,s|1<<m,i+1,o(M),g,0,0,C),A=r.nwQuadrant,j=new x(this,A,s|2<<m,i+1,o(A),0,q,d,0),I=r.neQuadrant,G=new x(this,I,s|3<<m,i+1,o(I),g,q,0,0),F=[O,U,j,G];F.forEach(p=>p.updateNeighbors()),F.forEach(p=>this.tree.set(p.code,p))}}}qlao(e,n){return(e|this.ty)+(n&this.tx)&this.tx|(e|this.tx)+(n&this.ty)&this.ty}}const le=`
precision mediump float;

varying vec3 vNormal;

void main() {
    // calculate lighting based on normal and hardcoded light
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    float brightness = max(dot(vNormal, light), 0.05);
    vec3 diffuse = brightness * vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4(diffuse, 1.0);
}
`,ae=`
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
    vec3 calcNormal(vec2 pos) {
        float x = pos.x;
        float z = pos.y;
        float heightLeft = height(x - 1.0, z);
        float heightRight = height(x + 1.0, z);
        float heightDown = height(x, z - 1.0);
        float heightUp = height(x, z + 1.0);
        return normalize(vec3(heightLeft - heightRight, 2.0, heightDown - heightUp));
    }

    void main() {
        // world position for the vertex in this instance
        vec3 worldPosition = (instanceMatrix * vec4(position, 1.0)).xyz;
        // calculate noise at world x,z coordinate
        vec2 noiseSamplePosition = vec2(worldPosition.x, worldPosition.z);
        // adjust y value with noise height
        vec3 finalPosition = vec3(worldPosition.x, heightBlended(position, worldPosition), worldPosition.z);
        // pass calculated normal to fragment shader
        vNormal = calcNormal(noiseSamplePosition);
        gl_Position = projectionMatrix * viewMatrix * vec4(finalPosition, 1.0);
    }
`,L=6,T=14,v=Math.pow(2,T),he=new h(new l(-1*v,0,-1*v),new l(v,0,v)),ce=T-L+1,f=document.querySelector("canvas"),b=new K({canvas:f}),ge=new $,E=new J,u=new B(75,f.offsetWidth/f.offsetHeight,.1,1e5);u.position.set(0,40,40);const H=()=>{f.width=f.offsetWidth,f.height=f.offsetHeight,u.aspect=f.offsetWidth/f.offsetHeight,u.updateProjectionMatrix(),b.setSize(window.innerWidth,window.innerHeight)};window.addEventListener("resize",H);H();const w=new _(u,b.domElement);w.dragToLook=!0;w.movementSpeed=150;w.rollSpeed=1;const de=()=>[...Array(5)].flatMap(()=>{const c=-1e5+Math.random()*1e5,e=-1e5+Math.random()*1e5;return[c,e]}),y=new ee(1,1,64,64);y.rotateX(-Math.PI/2);const S=new X(new Float32Array(1e3),1,!1,1),P=new X(new Float32Array(1e3*4),4,!1,1);y.setAttribute("sideLength",S);y.setAttribute("neighborSideLengths",P);const D=new te({uniforms:{minSideLength:{value:Math.pow(2,L)},offsets:{type:"v2v",value:de()}},vertexShader:ae,fragmentShader:le}),z=new ne(y,D,1e3);E.add(z);const W=ie();document.body.appendChild(W.domElement);const fe=new oe,Z=fe.addFolder("Material");Z.add(D,"wireframe",!1);Z.open();const k=()=>{requestAnimationFrame(k),w.update(ge.getDelta());const c=new re(he,ce,e=>e.max.x-e.min.x>Math.pow(2,L)&&e.center.distanceTo(u.position)<e.size);[...c.tree.values()].forEach((e,n)=>{const o=e.aabb.max.x-e.aabb.min.x,t=e.getNeighbors().map(i=>i?i.aabb.max.x-i.aabb.min.x:o);z.setMatrixAt(n,new Q().compose(e.aabb.center,new R,new l(o,1,o))),S.set(Float32Array.from([o]),n),P.set(Float32Array.from(t),n*4)});for(let e=c.tree.size;e<1e3;e++)z.setMatrixAt(e,new Q().compose(new l(0,-1e3,0),new R,new l(0,0,0)));P.needsUpdate=!0,S.needsUpdate=!0,z.instanceMatrix.needsUpdate=!0,b.render(E,u),W.update()};k();
