import * as THREE from "three";
let renderer, scene, camera, particleGroup, planetGroup, wireframeGroup;

window.onload = function () {
  init();
  animate();
};

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById("canvas").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 400;
  scene.add(camera);

  particleGroup = new THREE.Object3D();
  planetGroup = new THREE.Object3D();
  wireframeGroup = new THREE.Object3D();

  scene.add(particleGroup);
  scene.add(planetGroup);
  scene.add(wireframeGroup);

  const geometry = new THREE.TetrahedronGeometry(2, 0);
  const geom = new THREE.TorusGeometry(7, 2, 3, 5);
  const geom2 = new THREE.IcosahedronGeometry(15, 1);

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: THREE.FlatShading,
  });

  for (let i = 0; i < 1000; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 700);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particleGroup.add(mesh);
  }
  dynamicData.forEach((data) => {
    const currentFormFieldName = dynamicFieldsValue.find(
      (field) => field.id === data.formFieldId
    )?.field_name;

    updatedResourceData = resourceData.map((resource) => {
      if (Number(resource.id) === data.resourceId) {
        return { ...resource, [currentFormFieldName]: data.value };
      } else {
        return { ...resource, [currentFormFieldName]: "" };
      }
    });
  });

  const updatedResourceData = [];
  for (const data of dynamicData) {
    const currentFormFieldName = dynamicFieldsValue.find(
      (field) => field.id === data.formFieldId
    )?.field_name;
    for (const resource of resourceData) {
      if (Number(resource.id) === data.resourceId) {
        updatedResourceData.push({
          ...resource,
          [currentFormFieldName]: data.value,
        });
      } else {
        updatedResourceData.push({ ...resource, [currentFormFieldName]: "" });
      }
    }
  }
  const mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: THREE.FlatShading,
  });

  const mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide,
  });

  const planet = new THREE.Mesh(geom, mat);
  planet.scale.setScalar(16);
  planetGroup.add(planet);

  const planet2 = new THREE.Mesh(geom2, mat2);
  planet2.scale.setScalar(10);
  wireframeGroup.add(planet2);

  const ambientLight = new THREE.AmbientLight(0x999999);
  scene.add(ambientLight);

  const lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 1);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
  lights[2].position.set(-0.75, -1, 0.5);
  lights.forEach((light) => scene.add(light));

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  particleGroup.rotation.x += 0.0;
  particleGroup.rotation.y -= 0.004;
  planetGroup.rotation.x -= 0.002;
  planetGroup.rotation.y -= 0.003;
  wireframeGroup.rotation.x -= 0.001;
  wireframeGroup.rotation.y += 0.002;

  renderer.clear();
  renderer.render(scene, camera);
}
