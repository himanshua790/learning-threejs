import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

export default function CustomObject() {
  const geometryRef = useRef();
  const verticesCount = 10 * 3;

  const positions = useMemo(() => {
    const pos = new Float32Array(verticesCount * 3);
    for (let i = 0; i < verticesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 3;
    }

    return pos;
  }, [verticesCount]);
  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial color="cyan" side={THREE.DoubleSide} />
    </mesh>
  );
}
