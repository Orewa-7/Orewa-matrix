import { useFrame } from "@react-three/fiber";
import soundFragmentShader from "./shaders/sound/fragment.glsl";
import soundVertexShader from "./shaders/sound/vertex.glsl";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Html, useCursor } from "@react-three/drei";
import gsap from "gsap";
import useGame from "../stores/useGame";
import { motion } from "framer-motion";
import useLoader from "../stores/useLoader";

const Sound = () => {
  const animation = useRef();
  const [clicked, setClicked] = useState(true);
  const [hovered, set] = useState();
  useCursor(hovered /*'pointer', 'auto', document.body*/);
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: soundVertexShader,
      fragmentShader: soundFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: 1 },
        uColor: { value: new THREE.Color(0xec2d2d) },
      },
    });
  }, []);

  const setSoundOn = useGame((state) => state.setSoundOn);

  const handleCLick = () => {
    // if (animation.current) {
    //   animation.current.kill();
    // }
    if (!clicked) {
      animation.current = gsap.to(material.uniforms.uFrequency, {
        value: 1,
        duration: 1,
        onComplete: () => {
          setClicked(!clicked);
        },
      });
      setSoundOn(true);
    } else {
      animation.current = gsap.to(material.uniforms.uFrequency, {
        value: 0,
        duration: 1,
        onComplete: () => {
          setClicked(!clicked);
        },
      });
      setSoundOn(false);
    }
  };

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });
  return (
    <mesh
      position={[-0.9, -0.55, -1]}
      material={material}
      onPointerOver={() => set(true)}
      onPointerOut={() => set(false)}
      onClick={handleCLick}
    >
      <planeGeometry args={[0.35, 0.35]} />
      <Text handleCLick={handleCLick} />
    </mesh>
  );
};

export default Sound;

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const CHARS = "!@#$%^&*():{};|,.<>/?";

const Text = ({ handleCLick }) => {
  const soundOn = useGame((state) => state.soundOn);

  const TARGET_TEXT = soundOn ? "Sound ON" : "Sound OFF";
  const intervalRef = useRef(null);

  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);

    setText(TARGET_TEXT);
  };

  useEffect(() => {
    scramble();

    return () => {
      stopScramble();
    };
  }, [soundOn]);

  return (
    <Html position={[-0.55, -0.1, 0]} transform distanceFactor={0.5}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 5, duration: 1 },
        }}
        onClick={handleCLick}
        className="encrypted-text"
      >
        <h1
          style={{
            fontWeight: "initial",
          }}
        >
          {text}
        </h1>
        <div
          style={{
            width: "300px",
            height: "3px",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "3px",
              backgroundColor: "white",
              position: "absolute",
              top: "50%",
              left: "100%",
              transform: " translate(-30px, -72px) rotate(-45deg)",
            }}
          />
        </div>
      </motion.div>
    </Html>
  );
};
