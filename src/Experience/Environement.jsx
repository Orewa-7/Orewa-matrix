import { CameraControls, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import useLoader from "../stores/useLoader";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

import backgroundFragmentShader from "./shaders/background/fragment.glsl";
import backgroundVertexShader from "./shaders/background/vertex.glsl";
import * as THREE from "three";
import useGame from "../stores/useGame";

const Environment = () => {
  const cameraRef = useRef();
  const isLoaderComplete = useLoader((state) => state.isLoaderComplete);
  const setIsLoaderVisible = useLoader((state) => state.setIsLoaderVisible);
  const isLoaderVisible = useLoader((state) => state.isLoaderVisible);

  const moodAudio = useMemo(() => new Audio("/audios/mood.mp3"), []);
  moodAudio.loop = true;

  useEffect(() => {
    cameraRef.current.disconnect();
    cameraRef.current.moveTo(0, 0, 8, false);
  }, []);

  useEffect(() => {
    if (isLoaderComplete) {
      setIsLoaderVisible();
      moodAudio.volume = 0.15;
      moodAudio.play();
    }
  }, [isLoaderComplete]);

  const soundOn = useGame((state) => state.soundOn);
  useEffect(() => {
    if (soundOn && isLoaderComplete) {
      gsap.to(moodAudio, { volume: 0.15, duration: 1 });
    } else {
      gsap.to(moodAudio, { volume: 0, duration: 1 });
    }
  }, [soundOn]);

  useEffect(() => {
    if (!isLoaderVisible) {
      cameraRef.current.smoothTime = 2;
      cameraRef.current.moveTo(0, 0, 0, true);
    }
  }, [isLoaderVisible]);
  return (
    <>
      <CameraControls
        ref={cameraRef}
        makeDefault
        enabled={true}
        maxZoom={0.01}
        minZoom={0.01}
      />
      <Background isLoaderVisible={isLoaderVisible} />
    </>
  );
};

export default Environment;

const Background = ({ isLoaderVisible }) => {
  const meshRef = useRef();
  const { camera, viewport } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -5]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: 0.5 },
        uColor: { value: new THREE.Color(0x2929ff) },
      },
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  useEffect(() => {
    if (!isLoaderVisible) {
      meshRef.current.position.set(0, 0, -5);
    }
  }, [isLoaderVisible]);
  return (
    <mesh ref={meshRef} position={[100, 0, -5]} material={material}>
      <planeGeometry args={[width * 2, height * 2]} />
    </mesh>
  );
};
