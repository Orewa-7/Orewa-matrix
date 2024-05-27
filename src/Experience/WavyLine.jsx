import { useFrame } from "@react-three/fiber";
import wavyLineFragmentShader from "./shaders/wavyLine/fragment.glsl";
import wavyLineVertexShader from "./shaders/wavyLine/vertex.glsl";
import * as THREE from "three";
const WavyLine = () => {
  const material = new THREE.ShaderMaterial({
    vertexShader: wavyLineVertexShader,
    fragmentShader: wavyLineFragmentShader,
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
      <mesh position={[-0.3, -0.15, 0]} material={material} scale={0.5}>
        <planeGeometry args={[0.5, 0.25, 1, 1]} />
      </mesh>
    </>
  );
};

export default WavyLine;
