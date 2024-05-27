import { useFrame } from "@react-three/fiber";
import randomGraphFragmentShader from "./shaders/randomGraph/fragment.glsl";
import randomGraphVertexShader from "./shaders/randomGraph/vertex.glsl";
import * as THREE from "three";
const RandomGraph = () => {
  const material = new THREE.ShaderMaterial({
    vertexShader: randomGraphVertexShader,
    fragmentShader: randomGraphFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color("#ff7300")),
    },
    // wireframe: true,
  });
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <mesh position={[-0.81, -0.15, 0]} material={material} scale={0.5}>
        <planeGeometry args={[1.5, 0.3, 1, 1]} />
      </mesh>
    </>
  );
};

export default RandomGraph;
