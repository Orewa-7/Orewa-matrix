import { Perf } from "r3f-perf";
import Graph from "./Experience/Graph";
import NoisyBackground from "./Experience/NoisyBackground";
import CircleOfPoints from "./Experience/CircleOfPoints";
import PlayGround from "./Experience/PlayGround";
import WavyLine from "./Experience/WavyLine";
import Weapons from "./Experience/Weapons";
import RandomGraph from "./Experience/RandomGraph";
import HUD from "./Experience/HUD";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Score from "./Experience/Score";
import Target from "./Experience/HUD/Target";
import {
  Bloom,
  EffectComposer,
  Glitch,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { GlitchMode, BlendFunction, ToneMappingMode } from "postprocessing";
import useGame from "./stores/useGame";
import Loader from "./Experience/Loader";
import Environment from "./Experience/Environement";
import useLoader from "./stores/useLoader";
import GameOver from "./Experience/GameOver";
import Sound from "./Experience/Sound";
import { Html } from "@react-three/drei";

export default function Experience() {
  const isGameOver = useGame((state) => state.isGameOver);
  const isLoaderVisible = useLoader((state) => state.isLoaderVisible);

  const isRestart = useGame((state) => state.isRestart);
  const setRestart = useGame((state) => state.setRestart);
  const [targetKey, setTargetKey] = useState(0);

  const groupRef = useRef();

  useEffect(() => {
    if (!isLoaderVisible) {
      groupRef.current.position.set(0, 0, 0);
    }
  }, [isLoaderVisible]);

  useEffect(() => {
    if (isRestart) {
      setTargetKey((prevKey) => prevKey + 1); // Increment key to force re-render of Target
      setRestart(false); // Set isRestart to false after reinitialization
    }
  }, [isRestart, setRestart]);

  const isMobile = matchMedia("(max-width: 768px)").matches;
  return (
    <>
      {isMobile ? (
        <Mobile />
      ) : (
        <>
          <Loader />
          <Environment />
          {/* <Perf /> */}
          <GameOver isGameOver={isGameOver} />
          <color attach="background" args={["#000"]} />
          <EffectComposer enableNormalPass>
            <Bloom luminanceThreshold={2} luminanceSmoothing={0.9} mipmapBlur />
            <Glitch
              delay={[1, 2]}
              duration={[0.1, 0.2]}
              strength={[0.1, 0.2]}
              mode={GlitchMode.SPORADIC}
              active={isGameOver}
            />
            <ToneMapping mode={ToneMappingMode.UNCHARTED2} />
          </EffectComposer>
          <group
            ref={groupRef}
            // scale={0.6}
            position={[200, 2, 0]}
          >
            <group position={[1, 0, 0]}>
              <Graph />
              <NoisyBackground />
              <PlayGround />
              <CircleOfPoints
                radius={0.7}
                count={7}
                points={100}
                position={[0, 0.1, -1.9]}
              />
            </group>
            <WavyLine />
            <RandomGraph />
            <Weapons />
            <HUD />

            <Target key={targetKey} />
            <Score />
            <Sound />
          </group>
        </>
      )}
    </>
  );
}

const Mobile = () => {
  return (
    <Html>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          color: "white",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1>Sorry!</h1>
        <p>This experience is not yet optimized for mobile</p>
        <p style={{ color: "cyan", margin: "2em" }}>Try it on a desktop</p>
      </div>
    </Html>
  );
};
