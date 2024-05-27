import CircleOfPoints from "./CircleOfPoints";
import layer1VertexShader from "./shaders/score/layer1/vertex.glsl";
import layer1FragmentShader from "./shaders/score/layer1/fragment.glsl";
import layer2VertexShader from "./shaders/score/layer2/vertex.glsl";
import layer2FragmentShader from "./shaders/score/layer2/fragment.glsl";
import layer3VertexShader from "./shaders/score/layer3/vertex.glsl";
import layer3FragmentShader from "./shaders/score/layer3/fragment.glsl";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import usePoints from "../stores/usePoints";
import gsap from "gsap";
import useGame from "../stores/useGame";

const Score = ({}) => {
  const points = usePoints((state) => state.points);
  const removePoints = usePoints((state) => state.removePoints);
  const layer1Material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: layer1VertexShader,
    fragmentShader: layer1FragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
  });
  const layer2Material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: layer2VertexShader,
    fragmentShader: layer2FragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
  });
  const layer3Material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: layer3VertexShader,
    fragmentShader: layer3FragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSize: new THREE.Uniform(1),
      uColor: new THREE.Uniform(new THREE.Color("#ff7300")),
    },
  });
  const animationRef = useRef(); // Ref to store the GSAP animation
  const setGameOver = useGame((state) => state.setGameOver);
  const setScore = usePoints((state) => state.setScore);
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }
    if (points != 0) {
      layer3Material.uniforms.uSize.value = 1;
      animationRef.current = gsap.to(layer3Material.uniforms.uSize, {
        value: 0,
        duration: 10,
        onComplete: () => {
          setGameOver(true);
          const highScore = localStorage.getItem("highScore") || 0;
          if (highScore < points) localStorage.setItem("highScore", points);
          setScore(points);
          removePoints(points);
        },
      });
    }
  }, [points]);
  useFrame((state) => {
    layer2Material.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    layer3Material.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    // check if we scored
  });
  return (
    <>
      <group position={[-0.45, -0.55, -1]}>
        <CircleOfPoints
          radius={0.125}
          points={50}
          count={5}
          scalePoint={0.5}
          rotationSpeed={0}
        />
        <mesh material={layer1Material} position={[0, 0, -0.01]}>
          <planeGeometry args={[0.4, 0.4]} />
          <mesh material={layer2Material} position={[0, 0, 0.02]}>
            <planeGeometry args={[0.4, 0.4]} />
            <mesh material={layer3Material} position={[0, 0, 0.02]}>
              <planeGeometry args={[0.4, 0.4]} />
            </mesh>
          </mesh>
        </mesh>
        <Text position={[0, 0.01, 0.02]} fontSize={0.05} letterSpacing={0}>
          {points}
        </Text>
      </group>
    </>
  );
};

export default Score;
