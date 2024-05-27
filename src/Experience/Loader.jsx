import { useFrame, useThree } from "@react-three/fiber";
import loaderFragmentShader from "./shaders/loader/fragment.glsl";
import loaderVertexShader from "./shaders/loader/vertex.glsl";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import useLoader from "../stores/useLoader";
import { Html } from "@react-three/drei";
import { AnimatePresence, delay, motion } from "framer-motion";

const Loader = () => {
  const progress = RandomProgress();
  const meshRef = useRef();
  const isLoaderVisible = useLoader((state) => state.isLoaderVisible);
  const setIsLoaderComplete = useLoader((state) => state.setIsLoaderComplete);

  const { camera, viewport } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [
    camera.position.x,
    camera.position.y,
    camera.position.z - 1,
  ]);
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uAlpha: { value: 1 },
        uColor: { value: new THREE.Color(0xec2d2d) },
        uHoveredColor: { value: new THREE.Color(0xec2d2d) },
      },
      transparent: true,
      vertexShader: loaderVertexShader,
      fragmentShader: loaderFragmentShader,
    });
  }, []);
  useEffect(() => {
    material.uniforms.uProgress.value = progress / 100;
  }, [progress]);

  useEffect(() => {
    if (!isLoaderVisible) {
      gsap.to(material.uniforms.uAlpha, {
        value: 0,
        duration: 0.25,
        onComplete: () => {
          meshRef.current.scale.set(0, 0, 0);
        },
      });
    }
  }, [isLoaderVisible]);
  useFrame((state) => {
    const position = state.camera.position.clone();
    meshRef.current.position.set(position.x, position.y, position.z - 1);
  });

  return (
    <>
      <mesh ref={meshRef} material={material}>
        <planeGeometry args={[width, height]} />
      </mesh>
      <Html>
        <AnimatePresence>
          {isLoaderVisible && <LoaderDom progress={progress} />}
        </AnimatePresence>
      </Html>
    </>
  );
};

export default Loader;

const LoaderDom = ({ progress }) => {
  const [step, setStep] = useState(0);
  const setIsLoaderComplete = useLoader((state) => state.setIsLoaderComplete);
  const highScore = localStorage.getItem("highScore") || 0;

  useEffect(() => {
    if (progress === 100) {
      setStep(1);
    }
  }, [progress]);

  const baseVariants = {
    hidden: { opacity: 0, transition: { duration: 1 } },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1 } },
  };
  const completedVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const childrenVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="loader-container"
      style={{ color: "white" }}
    >
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key={"progress"}
            variants={baseVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="loader-progress">{progress}</div>
          </motion.div>
        ) : (
          <motion.div
            key={"completed"}
            variants={baseVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              variants={completedVariants}
              initial="hidden"
              animate="visible"
              className="loader-completed"
            >
              <motion.p
                variants={childrenVariants}
                style={{ textAlign: "center" }}
              >
                Choose your weapon wisely
                <span
                  style={{
                    display: "flex",
                    gap: "4rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span className="points-container">
                    Sniper <span className="points">1 point</span>
                  </span>
                  <span className="points-container">
                    Rifle <span className="points">2 points</span>
                  </span>
                  <span className="points-container">
                    Pistol <span className="points">3 points</span>
                  </span>
                </span>
              </motion.p>
              <motion.p
                variants={childrenVariants}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Last High Score
                <span>{highScore}</span>
              </motion.p>
              <motion.button
                onClick={setIsLoaderComplete}
                className="start-button"
                variants={childrenVariants}
              >
                Start
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RandomProgress = () => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const updateProgress = (newProgress) => {
      gsap.to(
        {},
        {
          // duration: Math.random() * 2 + 1, // Adjust the speed
          duration: Math.random() + 1, // Adjust the speed
          onUpdate: () => {
            setProgress((oldProgress) => {
              if (oldProgress < newProgress) {
                return oldProgress + 1;
              }
              return oldProgress;
            });
          },
          onComplete: () => {
            if (newProgress < 100) {
              setStep(newProgress);
            }
          },
        }
      );
    };

    const getRandomStep = (min, max) => {
      const randomStep = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomStep;
    };

    const animateProgress = () => {
      const newProgress = getRandomStep(progress + 1, 100);
      updateProgress(newProgress);
    };
    if (progress < 100) animateProgress();
  }, [step]);

  return progress;
};
