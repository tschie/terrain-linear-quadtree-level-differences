import {
  Clock,
  DirectionalLight,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Quaternion,
  Scene,
  ShaderMaterial,
  UniformsLib,
  Vector3,
  WebGLRenderer
} from "three";
import {Quadtree} from "./quadtree";
import {terrainFragmentShader} from "./fragmentShader.glsl";
import {terrainVertexShader} from "./vertexShader.glsl";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import {AABB} from "./aabb";

const minLOD = 6
const maxLOD = 14
const boundsScale = Math.pow(2, maxLOD)
const terrainBounds = new AABB(new Vector3(-1 * boundsScale, 0, -1 * boundsScale), new Vector3(boundsScale, 0, boundsScale))
const maxDepth = maxLOD - minLOD + 1

const canvas = document.querySelector("canvas")

const renderer = new WebGLRenderer({canvas});

const clock = new Clock()

const scene = new Scene();

// directional light to demonstrate normals
const directionalLight = new DirectionalLight();
directionalLight.position.set(1000, 1000, 1000)

const camera = new PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100000);
camera.position.set(0, 40, 40);

// add directional light to camera to ironically keep constant while moving
camera.add(directionalLight)
scene.add(camera)

// resize canvas on window resize
const resize = () => {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener("resize", resize)
resize()

// camera fly controls
const controls = new FlyControls(camera, renderer.domElement);
controls.dragToLook = true
controls.movementSpeed = 150
controls.rollSpeed = 1

// create some offsets to vary the noise (could use a seed instead of random)
const offsets = () => {
  // 5 is the number of noise "octaves"
  return [...Array(5)].flatMap(() => {
    const offsetX = -100000.0 + Math.random() * 100000.0;
    const offsetY = -100000.0 + Math.random() * 100000.0;
    return [offsetX, offsetY];
  })
}

// single plane geometry shared by each terrain tile
const geometry = new PlaneBufferGeometry(1, 1, 64, 64) // 1x1 with 64x64 cells
geometry.rotateX(-Math.PI / 2); // flip to xz plane

// store side length of each terrain tile
const sideLengthAttribute = new InstancedBufferAttribute(new Float32Array(1000), 1, false, 1);
// store 4 neighbor's side lengths for each terrain tile
const neighborSideLengthsAttribute = new InstancedBufferAttribute(new Float32Array(1000 * 4), 4, false, 1)

geometry.setAttribute("sideLength", sideLengthAttribute)
geometry.setAttribute("neighborSideLengths", neighborSideLengthsAttribute)

const material = new ShaderMaterial({
  uniforms: {
    minSideLength: {value: Math.pow(2, minLOD)},
    offsets: {type: "v2v", value: offsets()},
    ...UniformsLib['lights'], // include uniforms for directional light
  },
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
  lights: true, // directional light
})

// instanced mesh to reuse same geometry and material for each terrain tile
// pick a count > max number of tiles expected
const instancedMesh = new InstancedMesh(geometry, material, 1000);
scene.add(instancedMesh)

const stats = Stats()
document.body.appendChild(stats.domElement)

const gui = new GUI();
const materialFolder = gui.addFolder('Material')
materialFolder.add(material, 'wireframe', false)
materialFolder.open()

const animate = () => {
  requestAnimationFrame(animate);

  // update camera
  controls.update(clock.getDelta());

  // generate new quadtree from updated camera position
  const quadtree = new Quadtree(terrainBounds, maxDepth, aabb => {
    // split tree if it's larger than the minimum tile size and it's close to the camera
    return aabb.max.x - aabb.min.x > Math.pow(2, minLOD) && aabb.center.distanceTo(camera.position) < aabb.size
  });

  // create an "instance" of the instanced mesh for each quadtree node (a terrain tile)
  [...quadtree.tree.values()].forEach((node, i) => {
    const sideLength = node.aabb.max.x - node.aabb.min.x
    // use the constant time neighbor lookup to get the neighbor side lengths
    const neighborSideLengths = node.getNeighbors().map(neighbor =>
      neighbor ? neighbor.aabb.max.x - neighbor.aabb.min.x : sideLength // assume same scale for missing neighbors
    )
    // update transform and attributes for each tile
    instancedMesh.setMatrixAt(i, new Matrix4().compose(node.aabb.center, new Quaternion(), new Vector3(sideLength, 1, sideLength)))
    sideLengthAttribute.set(Float32Array.from([sideLength]), i);
    neighborSideLengthsAttribute.set(Float32Array.from(neighborSideLengths), i * 4)
  })

  for(let i = quadtree.tree.size; i < 1000; i++) {
    // hide unused instances below terrain and set scale to 0
    instancedMesh.setMatrixAt(i, new Matrix4().compose(new Vector3(0, -1000, 0), new Quaternion(), new Vector3(0, 0, 0)))
  }

  // mark to update
  neighborSideLengthsAttribute.needsUpdate = true // comment out to see seams
  sideLengthAttribute.needsUpdate = true;
  instancedMesh.instanceMatrix.needsUpdate = true;

  renderer.render(scene, camera);

  stats.update()
};

animate();
