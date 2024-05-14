import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import typefaceFont from "../static/Brotherland_Signature_Bold.json"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
/**
 * Font Loader
 */
const loader = new FontLoader();
const font = loader.load(
  // resource URL
  "droid_sans_mono_regular.typeface.json",

  // onLoad callback
  function (font) {
    // do something with the font
    console.log(font);
    const geometry = new TextGeometry("Hello three.js!", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3,
    });

    geometry.center();
    const textMaterial = new THREE.MeshMatcapMaterial();
    // textMaterial.wireframe = true;
    textMaterial.matcap = matcapTexture;
    const text = new THREE.Mesh(geometry, textMaterial);
    scene.add(text);

    console.time("donuts");
    // Optimized geometry and material creation
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const torusMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });

    // Array to hold torus meshes
    const torusMeshes = [];

    for (let i = 0; i < 100; i++) {
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.x = (Math.random() - 0.5) * 10;
      torus.position.y = (Math.random() - 0.5) * 10;
      torus.position.z = (Math.random() - 0.5) * 10;

      torus.rotation.x = Math.random() * Math.PI;
      torus.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      torus.scale.set(scale, scale, scale);

      // Check for overlapping with text geometry
      const textBoundingBox = new THREE.Box3().setFromObject(text);
      const torusBoundingBox = new THREE.Box3().setFromObject(torus);
      if (!textBoundingBox.intersectsBox(torusBoundingBox)) {
        torusMeshes.push(torus);
      }
    }

    // Add torus meshes to the scene
    torusMeshes.forEach((torus) => {
      scene.add(torus);
    });
    console.timeEnd("donuts");
  },

  // onProgress callback
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  // onError callback
  function (err) {
    console.log("An error happened");
  }
);
/**
 * Object
 */

// Axes Helper
const axesHelper = new THREE.AxesHelper();

scene.add(axesHelper);
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
camera.position.z = 2;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
