import { useEffect, useMemo, useState } from "react";
import useWeapons from "../../stores/useWeapons";
import { useCursor } from "@react-three/drei";
import arrowsFragmentShader from "../shaders/weapons/arrows/fragment.glsl";
import arrowsVertexShader from "../shaders/weapons/arrows/vertex.glsl";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const Arrows = () => {
  const size = 0.2;
  const x = 0.5;
  const z = 0.5;
  const addIndexWeapon = useWeapons((state) => state.addIndexWeapon);
  const decreaseIndexWeapon = useWeapons((state) => state.decreaseIndexWeapon);
  const [hovered, set] = useState();
  useCursor(hovered /*'pointer', 'auto', document.body*/);

  const clickAudio = useMemo(() => new Audio("/audios/click.mp3"), []);
  clickAudio.volume = 0.2;

  const handleClick = (direction) => {
    clickAudio.pause();
    clickAudio.currentTime = 0;
    clickAudio.play();
    if (direction === "left") {
      decreaseIndexWeapon();
    } else {
      addIndexWeapon();
    }
  };

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xec2d2d) },
      uHoveredColor: { value: new THREE.Color(0xff7300) },
    },
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader: arrowsVertexShader,
    fragmentShader: arrowsFragmentShader,
  });

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <>
      <mesh
        position={[x, 0, z]}
        onClick={() => handleClick("right")}
        onPointerOver={() => set(true)}
        onPointerOut={() => set(false)}
        material={material}
      >
        <planeGeometry args={[size, size, 1, 1]} />
      </mesh>
      <mesh
        position={[-x, 0, z]}
        onClick={() => handleClick("left")}
        onPointerOver={() => set(true)}
        onPointerOut={() => set(false)}
        material={material}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[size, size, 1, 1]} />
      </mesh>
    </>
  );
};

export default Arrows;
