import { useFrame } from "@react-three/fiber";
import playGroundFragmentShader from "./shaders/playGround/fragment.glsl";
import playGroundVertexShader from "./shaders/playGround/vertex.glsl";
import * as THREE from "three";
const PlayGround = () => {
  const material = new THREE.ShaderMaterial({
    vertexShader: playGroundVertexShader,
    fragmentShader: playGroundFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: new THREE.Uniform(0),
    },
    // wireframe: true,
  });
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0, -2]}
        material={material}
      >
        <planeGeometry args={[1, 1, 10, 10]} />
      </mesh>
    </>
  );
};

export default PlayGround;
