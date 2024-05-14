import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new GUI();

/**
 * Base
 */

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log("loading progressing", url, itemsLoaded, itemsTotal);
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const envLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/5.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMapTexture = envLoader.load([
  "/textures/environmentMaps/2/px.jpg",
  "/textures/environmentMaps/2/nx.jpg",
  "/textures/environmentMaps/2/py.jpg",
  "/textures/environmentMaps/2/ny.jpg",
  "/textures/environmentMaps/2/pz.jpg",
  "/textures/environmentMaps/2/nz.jpg",
])

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial();
// material.map = (doorColorTexture)
// material.color.set("pink")
// material.color = new THREE.Color('rgb(0,255,0)')
// material.transparent = true
// material.wireframe = true
// material.opacity = 0.5
// material.alphaMap = alphaTexture
// material.side = THREE.DoubleSide  // to show both side of plane.

// const material = new THREE.MeshNormalMaterial()
// material.flatShading  = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()
// const material = new THREE.MeshLambertMaterial()
// const material = new THREE.MeshPhongMaterial()
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// material.shininess = 100;
// // warm yellow
// material.specular = new THREE.Color("#e0e0e0");

const parameter = {
  normalMapX: 0.5,
  normalMapY: 0.5,
};
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 1;
// material.metalness = 0;
// material.map = doorColorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.displacementScale = 0.05
// material.normalMap = normalTexture;
// material.normalScale.set(parameter.normalMapX,parameter.normalMapY)
// material.transparent
// material.alphaMap = alphaTexture
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;
/**
 * GUI
 */

gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.01);
gui.add(material, "displacementScale").min(0).max(1).step(0.01);
gui.add(parameter, "normalMapX").min(0).max(1).step(0.01);
gui.add(parameter, "normalMapY").min(0).max(1).step(0.01);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 62, 64), material);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere.position.set(-1.5, 0, 0);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.set(1.5, 0, 0);
scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);

scene.add(pointLight);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update Object

  // sphere.rotation.y = (elapsedTime * Math.PI) / 2;
  // plane.rotation.y = (elapsedTime * Math.PI) / 2;
  // torus.rotation.y = (elapsedTime * Math.PI) / 2;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
