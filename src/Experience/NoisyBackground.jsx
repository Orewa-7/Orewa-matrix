import { useFrame } from "@react-three/fiber";
import noisyBackgroundFragmentShader from "./shaders/noisyBackground/fragment.glsl";
import noisyBackgroundVertexShader from "./shaders/noisyBackground/vertex.glsl";
import * as THREE from "three";
const NoisyBackground = () => {
  const material = new THREE.ShaderMaterial({
    vertexShader: noisyBackgroundVertexShader,
    fragmentShader: noisyBackgroundFragmentShader,
    transparent: true,
    // depthWrite: false,
    uniforms: {
      uTime: new THREE.Uniform(0),
    },
  });
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <>
      <mesh material={material} position={[0, 0, -2]}>
        <planeGeometry args={[2, 1, 1, 1]} />
      </mesh>
    </>
  );
};

export default NoisyBackground;
