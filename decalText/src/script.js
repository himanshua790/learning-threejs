import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
 * Particles
 */
const parameter = {};
parameter.count = 10000;
parameter.size = 0.02;
parameter.radius = 5;
parameter.branch = 4;
parameter.spin = 1;
parameter.randomness = 0.2;
parameter.randomnessPower = 3;
parameter.insideColor = "#ff6030";
parameter.outsideColor = "#1b3984";

let particleGeometry = null;
let points = null;
let particleMaterial = null;

function generateGalaxy() {
  if (points !== null) {
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(points);
  }
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameter.count * 3);
  const colors = new Float32Array(parameter.count * 3);

  const colorInside = new THREE.Color(parameter.insideColor);
  const colorOutside = new THREE.Color(parameter.outsideColor);
 
  
  for (let i = 0; i < parameter.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameter.radius;
    const spiningAngle = radius * parameter.spin;
    const branchAngle =
      ((i % parameter.branch) / parameter.branch) * Math.PI * 2;
      const randomX = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameter.randomness * radius
      const randomY = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameter.randomness * radius
      const randomZ = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameter.randomness * radius
    positions[i3] = Math.cos(branchAngle + spiningAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spiningAngle) * radius + randomZ;

    // Color

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius/parameter.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  particleMaterial = new THREE.PointsMaterial({
    size: parameter.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(points);
}
generateGalaxy();
/**
 * GUI
 */

gui
  .add(parameter, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "radius")
  .min(0.01)
  .max(20)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameter, "branch")
  .min(2)
  .max(20)
  .step(2)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui.addColor(parameter, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameter, "outsideColor").onFinishChange(generateGalaxy);
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
camera.position.x = 12;
camera.position.y = 12;
camera.position.z = 4;
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
  points.rotation.y = elapsedTime * Math.PI * 0.1;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
