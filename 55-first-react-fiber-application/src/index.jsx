import "./style.css";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
const root = ReactDOM.createRoot(document.querySelector("#root"));
import Experience from "./Experience";
root.render(
  <Canvas
    gl={{
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      outputColorSpace: THREE.SRGBColorSpace,
    }}
    camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}
  >
    <Experience />
   
  </Canvas>
);
