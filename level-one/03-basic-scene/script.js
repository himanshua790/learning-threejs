const canvas = document.querySelector(".webgl");
console.log(canvas);
// Scene
const scene = new THREE.Scene();

// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: false,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// Blue Cube
const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material2 = new THREE.MeshBasicMaterial({
  color: "blue",
  wireframe: false,
});
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.x = 2;
scene.add(cube2);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.x = 1;
scene.add(camera);
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
