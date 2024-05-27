import circlesFragmentShader from "./shaders/circles/fragment.glsl";
import circlesVertexShader from "./shaders/circles/vertex.glsl";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

const CircleOfPoints = ({
  radius,
  points,
  count,
  position = [0, 0, 0],
  scalePoint = 1,
  rotationSpeed = 1,
}) => {
  return (
    <>
      <group position={position}>
        {[...Array(count)].map((_, i) => (
          <ParticleLayer
            key={i}
            radius={radius + i * 0.025 * scalePoint}
            numPoints={points}
            scalePoint={scalePoint}
            rotationSpeed={rotationSpeed}
          />
        ))}
      </group>
    </>
  );
};

const ParticleLayer = ({ radius, numPoints, scalePoint, rotationSpeed }) => {
  const pointsRef = useRef();
  useEffect(() => {
    gsap.to(pointsRef.current.scale, {
      duration: 2,
      x: 1,
      y: 1,
      z: 1,
      ease: "power4.out",
    });
  }, []);
  const material = new THREE.ShaderMaterial({
    vertexShader: circlesVertexShader,
    fragmentShader: circlesFragmentShader,
    uniforms: {
      uScale: { value: scalePoint },
    },
    transparent: true,
    depthWrite: false,
  });
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(numPoints * 3);

    for (let i = 0; i < numPoints; i++) {
      const theta = (i / numPoints) * 2 * Math.PI; // Divide the circle into equal parts
      const x = radius * Math.cos(theta); // X-coordinate
      const y = radius * Math.sin(theta); // Y-coordinate
      const z = 0; // Z-coordinate stays 0 to keep it 2D

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [radius, numPoints]);

  useFrame((state) => {
    pointsRef.current.rotation.z =
      ((state.clock.getElapsedTime() * 0.25) % Math.PI) * rotationSpeed;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      scale={0}
    ></points>
  );
};

export default CircleOfPoints;
