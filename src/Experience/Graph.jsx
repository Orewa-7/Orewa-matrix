import graphVertexShader from "./shaders/graph/vertex.glsl";
import graphFragmentShader from "./shaders/graph/fragment2.glsl";
import { useMemo } from "react";
import * as THREE from "three";

const Graph = () => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: graphVertexShader,
      fragmentShader: graphFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uYLevel: new THREE.Uniform(0.5),
        uAmplitude: new THREE.Uniform(0.15),
      },
    });
  }, []);
  return (
    <>
      <group position={[0, 0, 0]}>
        <mesh material={material} position={[0, 0, -2]}>
          <planeGeometry args={[2.5, 1.75, 1, 1]} />
        </mesh>
        {/* <mesh position={[0, 0, -1]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh> */}
      </group>
    </>
  );
};

export default Graph;
