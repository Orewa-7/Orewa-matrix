import { useFrame } from "@react-three/fiber";
import platformFragmentShader from "../shaders/weapons/platform/fragment.glsl";
import platformVertexShader from "../shaders/weapons/platform/vertex.glsl";
import * as THREE from "three";
const Platform = () => {
  const material = new THREE.ShaderMaterial({
    vertexShader: platformVertexShader,
    fragmentShader: platformFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: new THREE.Uniform(0),
    },
  });
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <mesh
        material={material}
        rotation={[-Math.PI * 0.48, 0, 0]}
        position={[0, -0.5, 0]}
      >
        <planeGeometry args={[1.25, 1.25, 1, 1]} />
      </mesh>
    </>
  );
};

export default Platform;
