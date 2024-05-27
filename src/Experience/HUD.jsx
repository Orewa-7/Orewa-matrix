import { useEffect, useRef, useState } from "react";
import { BaseCircle, SecondCircle, ThirdCircle, Mire } from "./HUD/BaseCircle";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const HUD = ({ scaleDown }) => {
  const initialPosition = [0.75, 0.0, -1];
  // const initialPosition = [0.8125, 0.0, -1];

  const baseScale = 0.25;

  const width = 2.5;
  const height = 1.725;

  const uv = useRef(new THREE.Vector2(0, 0));
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(initialPosition);

  const mouseMove = (e) => {
    const scaleHUD = 0.25;
    let x = (e.uv.x * 2 - 1) * width * 0.3675;
    let y = (e.uv.y * 2 - 1) * height * 0.3675;
    if (scaleDown) {
      const x = (e.uv.x * 2 - 1) * width * 1.1 * 0.3675;
      const y = (e.uv.y * 2 - 1) * height * 1.1 * 0.3675;
    }
    const realX = x - Math.sign(x) * scaleHUD * 0.01;
    const realY = y - Math.sign(y) * scaleHUD * 0.01;
    uv.current.set(realX, realY);
  };
  useEffect(() => {
    document.body.style.cursor = hovered ? "none" : "auto";
  }, [hovered]);
  useFrame((state) => {
    if (hovered) {
      setPosition([
        THREE.MathUtils.lerp(
          position[0],
          uv.current.x + initialPosition[0],
          0.75
        ),
        THREE.MathUtils.lerp(
          position[1],
          uv.current.y + initialPosition[1],
          0.75
        ),
        initialPosition[2],
      ]);
    } else {
      setPosition([
        THREE.MathUtils.lerp(position[0], initialPosition[0], 0.05),
        THREE.MathUtils.lerp(position[1], initialPosition[1], 0.05),
        initialPosition[2],
      ]);
    }
  });

  return (
    <>
      <mesh
        position={[1, 0, -2]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerMove={mouseMove}
      >
        <planeGeometry args={[width, height, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group>
        <BaseCircle position={position} scale={baseScale} />
      </group>
    </>
  );
};

export default HUD;
