import { useFrame } from "@react-three/fiber";
import holoLightFragmentShader from "../shaders/weapons/holoLight/fragment.glsl";
import holoLightVertexShader from "../shaders/weapons/holoLight/vertex.glsl";
import * as THREE from "three";
const HoloLight = () => {
  const material = new THREE.ShaderMaterial({
    vertexShader: holoLightVertexShader,
    fragmentShader: holoLightFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color("#ff7300")),
    },
  });
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <mesh
        position={[0, -0.25, 0]}
        rotation={[Math.PI * 1.0, 0, 0]}
        scale={0.15}
        material={material}
      >
        <coneGeometry args={[7, 4, 10, 39, 2, true]} />
      </mesh>
    </>
  );
};

export default HoloLight;
