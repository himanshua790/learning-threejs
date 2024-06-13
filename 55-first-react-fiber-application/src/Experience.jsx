import React from "react";
import * as THREE from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./CustomObject";
extend({ OrbitControls });

export default function Experience() {
  const cubeRef = React.useRef(null);
  const { camera, gl } = useThree();
  useFrame((state, delta) => {
        console.log(state)
    const angle = state.clock.elapsedTime;

    state.camera.position.x = Math.sin(angle) * 5;
    state.camera.position.z = Math.cos(angle) * 5;
    state.camera.lookAt(0, 0, 0);
    cubeRef.current.rotation.y += delta;
  });
  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />
      {/* <directionalLight position={[1, 2, 3]} intensity={4.5} /> */}
      {/* <ambientLight intensity={1.5} /> */}
      <group ref={cubeRef}>
        <mesh position={[3.0, 0, 0]}>
          <sphereGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[-3.0, 0, 0]}>
          <boxGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
      </mesh>
      <CustomObject />
    </>
  );
}
