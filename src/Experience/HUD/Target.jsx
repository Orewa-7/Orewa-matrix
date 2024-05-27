import { useMemo, useRef, useState, useEffect } from "react";
import useWeapons from "../../stores/useWeapons";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import usePoints from "../../stores/usePoints";
import * as THREE from "three";
import Particles from "./Particles";
import { useGLTF } from "@react-three/drei";
import useGame from "../../stores/useGame";
import gsap from "gsap";

const Target = () => {
  const meshRef = useRef();
  const [targetPosition, setTargetPosition] = useState(
    new Vector3(-0.05, -0.6, -1.45)
  );
  const maxX = 1.8;
  const maxY = 0.6;
  const centerX = 0.865;
  const centerY = 0;
  const points = usePoints((state) => state.points);

  const lerpSpeed = 0.01 * points * 0.6; // Adjust this value to control the speed of interpolation

  const weapon = useWeapons((state) => state.weapon);
  const scale = weapon === "sniper" ? 1.25 : weapon === "rifle" ? 0.75 : 0.5;
  const size = 0.25;
  const initialPosition = [centerX, centerY, -1.45];

  const [particlePosition, setParticlePosition] = useState(null);

  // Function to generate a random position
  const randomPosition = () => {
    const x = Math.random() * maxX; // Random x from -1 to 1
    const y = Math.random() * maxY * 2 - maxY; // Random y from -1 to 1
    return new Vector3(x, y, -1.45); // Keep z constant as in initialPosition
  };

  useFrame(() => {
    if (!meshRef.current) return;

    // Lerp (linear interpolate) current position towards the target position
    meshRef.current.position.lerp(targetPosition, lerpSpeed);

    // Check if the plane is close to the target position
    if (meshRef.current.position.distanceTo(targetPosition) < 0.05) {
      // Update the target position
      setTargetPosition(randomPosition());
    }
  });

  const addPoints = usePoints((state) => state.addPoints);
  const isGameOver = useGame((state) => state.isGameOver);

  const pistolAudio = useMemo(() => new Audio("/audios/pistol.mp3"), []);
  pistolAudio.volume = 0.2;
  const rifleAudio = useMemo(() => new Audio("/audios/rifle.mp3"), []);
  rifleAudio.volume = 0.2;
  const sniperAudio = useMemo(() => new Audio("/audios/sniper.mp3"), []);
  sniperAudio.volume = 0.2;

  const handleClick = (e) => {
    if (isGameOver) return;
    e.stopPropagation();
    weapon === "sniper" && addPoints(1);
    weapon === "rifle" && addPoints(2);
    weapon === "pistol" && addPoints(3);

    if (weapon === "sniper") {
      sniperAudio.pause();
      sniperAudio.currentTime = 0;
      sniperAudio.play();
    }
    if (weapon === "rifle") {
      rifleAudio.pause();
      rifleAudio.currentTime = 0;
      rifleAudio.play();
    }
    if (weapon === "pistol") {
      pistolAudio.pause();
      pistolAudio.currentTime = 0;
      pistolAudio.play();
    }

    // Set the particle position to the current position of the mesh
    if (meshRef.current) {
      setParticlePosition(meshRef.current.position.clone());
    }
  };

  const verticesCount = 1 * 3;
  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);

    positions[0] = -0.1;
    positions[1] = -0.05;
    positions[2] = 0;

    positions[3] = 0.1;
    positions[4] = -0.05;
    positions[5] = 0;

    positions[6] = 0;
    positions[7] = 0.1;
    positions[8] = 0;
    return positions;
  }, []);

  return (
    <group ref={meshRef} position={initialPosition}>
      <mesh scale={scale} onClick={handleClick}>
        {/* <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={verticesCount}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color="#ff7300"
          emissive="#ff7300"
          emissiveIntensity={6.65}
          toneMapped={false}
        /> */}
        <Model />
      </mesh>
      {particlePosition && <Particles position={particlePosition} />}
    </group>
  );
};

export default Target;

const Model = (props) => {
  const { nodes } = useGLTF("/models/target.glb");
  const group = useRef();
  const explositonAudio = useMemo(() => new Audio("/audios/explosion.mp3"), []);
  explositonAudio.volume = 0.3;
  useEffect(() => {
    const material = new THREE.MeshStandardMaterial();
    material.color = new THREE.Color("#ff7300");
    material.emissive = new THREE.Color("#ff7300");
    material.emissiveIntensity = 6.65;
    material.toneMapped = false;
    material.transparent = true;
    const groupWorldPosition = new THREE.Vector3();
    group.current.getWorldPosition(groupWorldPosition);
    group.current.children.forEach((child) => {
      if (child instanceof THREE.Group) {
        child.children.forEach((child) => {
          child.material = material;
          child.originalPosition = child.position.clone();
          const childWorldPosition = new THREE.Vector3();
          child.getWorldPosition(childWorldPosition);

          child.directionVector = childWorldPosition
            .clone()
            .sub(groupWorldPosition)
            .normalize();
          child.targetPosition = child.originalPosition
            .clone()
            .add(child.directionVector.clone().multiplyScalar(3));
        });
      } else {
        child.material = material;
        child.originalPosition = child.position.clone();
        const childWorldPosition = new THREE.Vector3();
        child.getWorldPosition(childWorldPosition);

        child.directionVector = childWorldPosition
          .clone()
          .sub(groupWorldPosition)
          .normalize();
        child.targetPosition = child.originalPosition
          .clone()
          .add(child.directionVector.clone().multiplyScalar(3));
      }
    });
  }, []);

  const isGameOver = useGame((state) => state.isGameOver);
  useEffect(() => {
    if (isGameOver) {
      const tl = gsap.timeline();
      for (let i = 0; i < 10; i++) {
        tl.to(group.current.position, {
          x: "+=0.01",
          y: "+=0.01",
          z: "+=0.01",
          duration: 0.05,
          ease: "power4.inOut",
          yoyoEase: "power4.inOut",
        });
        tl.to(group.current.position, {
          x: "-=0.01",
          y: "-=0.01",
          z: "-=0.01",
          duration: 0.05,
          ease: "power4.inOut",
          yoyoEase: "power4.inOut",
        });
      }
      setTimeout(() => {
        explositonAudio.pause();
        explositonAudio.currentTime = 0;
        explositonAudio.play();
      }, 1000);
      // Add the animation for each child to move to its target position
      group.current.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.children.forEach((nestedChild) => {
            tl.to(
              nestedChild.material,
              {
                opacity: 0,
                duration: 2,
                ease: "power1.inOut",
              },
              "<"
            ); // '<' indicates to start at the same time for all children
            tl.to(
              nestedChild.position,
              {
                x: nestedChild.targetPosition.z,
                y: nestedChild.targetPosition.y,
                z: nestedChild.targetPosition.x,
                duration: 2,
                ease: "power1.inOut",
              },
              "<"
            ); // '<' indicates to start at the same time for all children
          });
        } else {
          tl.to(
            child.position,
            {
              x: child.targetPosition.z,
              y: child.targetPosition.y,
              z: child.targetPosition.x,
              duration: 2,
              ease: "power1.inOut",
            },
            "<"
          ); // '<' indicates to start at the same time for all children
        }
      });
      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === "Original-circle") {
            child.visible = false;
          } else {
            child.visible = true;
          }
        }
      });
    } else {
      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === "Original-circle") {
            child.visible = true;
          } else {
            child.visible = false;
          }
        }
      });
    }
  }, [isGameOver]);
  return (
    <group
      {...props}
      dispose={null}
      scale={0.13}
      ref={group}
      rotation={[0, Math.PI * 0.5, 0]}
    >
      <mesh
        name="Original-circle"
        geometry={nodes["Original-circle"].geometry}
        material={nodes["Original-circle"].material}
        position={[0, 0.5, 0]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        name="Original-circle_cell"
        geometry={nodes["Original-circle_cell"].geometry}
        material={nodes["Original-circle_cell"].material}
        position={[-0.054, 1.469, -0.006]}
      />
      <mesh
        name="Original-circle_cell001"
        geometry={nodes["Original-circle_cell001"].geometry}
        material={nodes["Original-circle_cell001"].material}
        position={[-0.02, 0.018, -0.738]}
      />
      <mesh
        name="Original-circle_cell002"
        geometry={nodes["Original-circle_cell002"].geometry}
        material={nodes["Original-circle_cell002"].material}
        position={[-0.071, 0.512, 0.053]}
      />
      <mesh
        name="Original-circle_cell003"
        geometry={nodes["Original-circle_cell003"].geometry}
        material={nodes["Original-circle_cell003"].material}
        position={[-0.045, 0.054, -0.81]}
      />
      <mesh
        name="Original-circle_cell004"
        geometry={nodes["Original-circle_cell004"].geometry}
        material={nodes["Original-circle_cell004"].material}
        position={[-0.02, 0.574, 0.381]}
      />
      <group name="Original-circle_cell005" position={[-0.039, 1.116, 0.168]}>
        <mesh
          name="Original-circle_cell012_1"
          geometry={nodes["Original-circle_cell012_1"].geometry}
          material={nodes["Original-circle_cell012_1"].material}
        />
        <mesh
          name="Original-circle_cell012_2"
          geometry={nodes["Original-circle_cell012_2"].geometry}
          material={nodes["Original-circle_cell012_2"].material}
        />
      </group>
      <group name="Original-circle_cell006" position={[-0.046, 0.092, 0.57]}>
        <mesh
          name="Original-circle_cell013_1"
          geometry={nodes["Original-circle_cell013_1"].geometry}
          material={nodes["Original-circle_cell013_1"].material}
        />
        <mesh
          name="Original-circle_cell013_2"
          geometry={nodes["Original-circle_cell013_2"].geometry}
          material={nodes["Original-circle_cell013_2"].material}
        />
      </group>
      <group name="Original-circle_cell007" position={[-0.129, 0.008, 0.212]}>
        <mesh
          name="Original-circle_cell014_1"
          geometry={nodes["Original-circle_cell014_1"].geometry}
          material={nodes["Original-circle_cell014_1"].material}
        />
        <mesh
          name="Original-circle_cell014_2"
          geometry={nodes["Original-circle_cell014_2"].geometry}
          material={nodes["Original-circle_cell014_2"].material}
        />
      </group>
      <mesh
        name="Original-circle_cell008"
        geometry={nodes["Original-circle_cell008"].geometry}
        material={nodes["Original-circle_cell008"].material}
        position={[-0.004, 0.652, 0.333]}
      />
      <mesh
        name="Original-circle_cell009"
        geometry={nodes["Original-circle_cell009"].geometry}
        material={nodes["Original-circle_cell009"].material}
        position={[-0.009, 0.763, 0.03]}
      />
      <mesh
        name="Original-circle_cell010"
        geometry={nodes["Original-circle_cell010"].geometry}
        material={nodes["Original-circle_cell010"].material}
        position={[-0.027, 1.061, -0.023]}
      />
      <group name="Original-circle_cell011" position={[-0.054, 1.343, -0.033]}>
        <mesh
          name="Original-circle_cell018"
          geometry={nodes["Original-circle_cell018"].geometry}
          material={nodes["Original-circle_cell018"].material}
        />
        <mesh
          name="Original-circle_cell018_1"
          geometry={nodes["Original-circle_cell018_1"].geometry}
          material={nodes["Original-circle_cell018_1"].material}
        />
      </group>
      <mesh
        name="Original-circle_cell012"
        geometry={nodes["Original-circle_cell012"].geometry}
        material={nodes["Original-circle_cell012"].material}
        position={[-0.022, 0.088, -0.315]}
      />
      <mesh
        name="Original-circle_cell013"
        geometry={nodes["Original-circle_cell013"].geometry}
        material={nodes["Original-circle_cell013"].material}
        position={[-0.039, 0.318, 0.527]}
      />
      <group name="Original-circle_cell014" position={[-0.058, 0.09, -0.653]}>
        <mesh
          name="Original-circle_cell021_1"
          geometry={nodes["Original-circle_cell021_1"].geometry}
          material={nodes["Original-circle_cell021_1"].material}
        />
        <mesh
          name="Original-circle_cell021_2"
          geometry={nodes["Original-circle_cell021_2"].geometry}
          material={nodes["Original-circle_cell021_2"].material}
        />
      </group>
      <mesh
        name="Original-circle_cell015"
        geometry={nodes["Original-circle_cell015"].geometry}
        material={nodes["Original-circle_cell015"].material}
        position={[-0.016, 0.322, -0.367]}
      />
      <mesh
        name="Original-circle_cell016"
        geometry={nodes["Original-circle_cell016"].geometry}
        material={nodes["Original-circle_cell016"].material}
        position={[-0.086, 0.314, -0.216]}
      />
      <group name="Original-circle_cell017" position={[-0.118, 0.91, -0.097]}>
        <mesh
          name="Original-circle_cell024"
          geometry={nodes["Original-circle_cell024"].geometry}
          material={nodes["Original-circle_cell024"].material}
        />
        <mesh
          name="Original-circle_cell024_1"
          geometry={nodes["Original-circle_cell024_1"].geometry}
          material={nodes["Original-circle_cell024_1"].material}
        />
      </group>
      <group name="Original-circle_cell019" position={[-0.131, 0.513, -0.501]}>
        <mesh
          name="Original-circle_cell025_1"
          geometry={nodes["Original-circle_cell025_1"].geometry}
          material={nodes["Original-circle_cell025_1"].material}
        />
        <mesh
          name="Original-circle_cell025_2"
          geometry={nodes["Original-circle_cell025_2"].geometry}
          material={nodes["Original-circle_cell025_2"].material}
        />
      </group>
      <mesh
        name="Original-circle_cell020"
        geometry={nodes["Original-circle_cell020"].geometry}
        material={nodes["Original-circle_cell020"].material}
        position={[-0.089, 0.534, 0.465]}
      />
      <mesh
        name="Original-circle_cell021"
        geometry={nodes["Original-circle_cell021"].geometry}
        material={nodes["Original-circle_cell021"].material}
        position={[-0.128, 0.845, 0.361]}
      />
      <mesh
        name="Original-circle_cell022"
        geometry={nodes["Original-circle_cell022"].geometry}
        material={nodes["Original-circle_cell022"].material}
        position={[-0.115, 0.303, 0.425]}
      />
      <mesh
        name="Original-circle_cell025"
        geometry={nodes["Original-circle_cell025"].geometry}
        material={nodes["Original-circle_cell025"].material}
        position={[-0.124, 1.15, 0.167]}
      />
      <mesh
        name="Original-circle_cell026"
        geometry={nodes["Original-circle_cell026"].geometry}
        material={nodes["Original-circle_cell026"].material}
        position={[-0.089, 1.25, 0.012]}
      />
      <mesh
        name="Original-circle_cell027"
        geometry={nodes["Original-circle_cell027"].geometry}
        material={nodes["Original-circle_cell027"].material}
        position={[-0.096, 0.037, -0.379]}
      />
      <mesh
        name="Original-circle_cell028"
        geometry={nodes["Original-circle_cell028"].geometry}
        material={nodes["Original-circle_cell028"].material}
        position={[-0.061, 0.113, 0.026]}
      />
      <mesh
        name="Original-circle_cell029"
        geometry={nodes["Original-circle_cell029"].geometry}
        material={nodes["Original-circle_cell029"].material}
        position={[-0.11, 0.094, 0.688]}
      />
      <mesh
        name="Original-circle_cell030"
        geometry={nodes["Original-circle_cell030"].geometry}
        material={nodes["Original-circle_cell030"].material}
        position={[-0.011, 0.012, -0.465]}
      />
      <mesh
        name="Original-circle_cell031"
        geometry={nodes["Original-circle_cell031"].geometry}
        material={nodes["Original-circle_cell031"].material}
        position={[-0.073, 0.17, -0.427]}
      />
      <mesh
        name="Original-circle_cell032"
        geometry={nodes["Original-circle_cell032"].geometry}
        material={nodes["Original-circle_cell032"].material}
        position={[-0.122, 0.128, -0.255]}
      />
      <mesh
        name="Original-circle_cell033"
        geometry={nodes["Original-circle_cell033"].geometry}
        material={nodes["Original-circle_cell033"].material}
        position={[-0.079, 1.094, -0.163]}
      />
      <mesh
        name="Original-circle_cell034"
        geometry={nodes["Original-circle_cell034"].geometry}
        material={nodes["Original-circle_cell034"].material}
        position={[-0.016, 0.752, -0.394]}
      />
      <mesh
        name="Original-circle_cell037"
        geometry={nodes["Original-circle_cell037"].geometry}
        material={nodes["Original-circle_cell037"].material}
        position={[-0.129, 1.452, -0.002]}
      />
      <mesh
        name="Original-circle_cell040"
        geometry={nodes["Original-circle_cell040"].geometry}
        material={nodes["Original-circle_cell040"].material}
        position={[-0.093, 0.029, -0.771]}
      />
      <mesh
        name="Original-circle_cell041"
        geometry={nodes["Original-circle_cell041"].geometry}
        material={nodes["Original-circle_cell041"].material}
        position={[-0.073, 0.051, 0.801]}
      />
      <mesh
        name="Original-circle_cell043"
        geometry={nodes["Original-circle_cell043"].geometry}
        material={nodes["Original-circle_cell043"].material}
        position={[-0.134, 0.001, 0.848]}
      />
      <mesh
        name="Original-circle_cell044"
        geometry={nodes["Original-circle_cell044"].geometry}
        material={nodes["Original-circle_cell044"].material}
        position={[-0.107, 1.159, 0.195]}
      />
      <mesh
        name="Original-circle_cell045"
        geometry={nodes["Original-circle_cell045"].geometry}
        material={nodes["Original-circle_cell045"].material}
        position={[-0.026, 0.888, -0.035]}
      />
      <mesh
        name="Original-circle_cell046"
        geometry={nodes["Original-circle_cell046"].geometry}
        material={nodes["Original-circle_cell046"].material}
        position={[-0.111, 1.035, 0.127]}
      />
      <mesh
        name="Original-circle_cell047"
        geometry={nodes["Original-circle_cell047"].geometry}
        material={nodes["Original-circle_cell047"].material}
        position={[-0.079, 0.75, 0.336]}
      />
      <mesh
        name="Original-circle_cell048"
        geometry={nodes["Original-circle_cell048"].geometry}
        material={nodes["Original-circle_cell048"].material}
        position={[-0.028, 0.625, 0.47]}
      />
      <mesh
        name="Original-circle_cell050"
        geometry={nodes["Original-circle_cell050"].geometry}
        material={nodes["Original-circle_cell050"].material}
        position={[-0.027, 0.315, 0.677]}
      />
      <mesh
        name="Original-circle_cell051"
        geometry={nodes["Original-circle_cell051"].geometry}
        material={nodes["Original-circle_cell051"].material}
        position={[-0.11, 0.166, 0.551]}
      />
      <mesh
        name="Original-circle_cell052"
        geometry={nodes["Original-circle_cell052"].geometry}
        material={nodes["Original-circle_cell052"].material}
        position={[-0.12, 0.387, 0.605]}
      />
      <mesh
        name="Original-circle_cell053"
        geometry={nodes["Original-circle_cell053"].geometry}
        material={nodes["Original-circle_cell053"].material}
        position={[-0.104, 0.01, 0.42]}
      />
      <mesh
        name="Original-circle_cell054"
        geometry={nodes["Original-circle_cell054"].geometry}
        material={nodes["Original-circle_cell054"].material}
        position={[-0.114, 0.024, 0.473]}
      />
      <mesh
        name="Original-circle_cell055"
        geometry={nodes["Original-circle_cell055"].geometry}
        material={nodes["Original-circle_cell055"].material}
        position={[-0.111, 0.034, 0.08]}
      />
      <mesh
        name="Original-circle_cell056"
        geometry={nodes["Original-circle_cell056"].geometry}
        material={nodes["Original-circle_cell056"].material}
        position={[-0.08, 0.054, -0.148]}
      />
      <mesh
        name="Original-circle_cell060"
        geometry={nodes["Original-circle_cell060"].geometry}
        material={nodes["Original-circle_cell060"].material}
        position={[-0.066, 0.46, -0.531]}
      />
      <mesh
        name="Original-circle_cell061"
        geometry={nodes["Original-circle_cell061"].geometry}
        material={nodes["Original-circle_cell061"].material}
        position={[-0.078, 0.331, -0.557]}
      />
      <mesh
        name="Original-circle_cell063"
        geometry={nodes["Original-circle_cell063"].geometry}
        material={nodes["Original-circle_cell063"].material}
        position={[-0.063, 0.629, -0.315]}
      />
      <mesh
        name="Original-circle_cell064"
        geometry={nodes["Original-circle_cell064"].geometry}
        material={nodes["Original-circle_cell064"].material}
        position={[-0.077, 0.63, -0.476]}
      />
      <mesh
        name="Original-circle_cell065"
        geometry={nodes["Original-circle_cell065"].geometry}
        material={nodes["Original-circle_cell065"].material}
        position={[-0.086, 0.826, -0.364]}
      />
      <mesh
        name="Original-circle_cell071"
        geometry={nodes["Original-circle_cell071"].geometry}
        material={nodes["Original-circle_cell071"].material}
        position={[-0.078, 0.472, -0.306]}
      />
      <mesh
        name="Original-circle_cell072"
        geometry={nodes["Original-circle_cell072"].geometry}
        material={nodes["Original-circle_cell072"].material}
        position={[-0.054, 0.466, -0.083]}
      />
      <mesh
        name="Original-circle_cell073"
        geometry={nodes["Original-circle_cell073"].geometry}
        material={nodes["Original-circle_cell073"].material}
        position={[-0.077, 0.274, 0.052]}
      />
      <mesh
        name="Original-circle_cell074"
        geometry={nodes["Original-circle_cell074"].geometry}
        material={nodes["Original-circle_cell074"].material}
        position={[-0.077, 0.168, 0.268]}
      />
      <mesh
        name="Original-circle_cell075"
        geometry={nodes["Original-circle_cell075"].geometry}
        material={nodes["Original-circle_cell075"].material}
        position={[-0.027, 0.396, 0.369]}
      />
      <mesh
        name="Original-circle_cell076"
        geometry={nodes["Original-circle_cell076"].geometry}
        material={nodes["Original-circle_cell076"].material}
        position={[-0.078, 0.699, -0.004]}
      />
      <mesh
        name="Original-circle_cell077"
        geometry={nodes["Original-circle_cell077"].geometry}
        material={nodes["Original-circle_cell077"].material}
        position={[-0.004, 0.595, -0.177]}
      />
      <mesh
        name="Original-circle_cell078"
        geometry={nodes["Original-circle_cell078"].geometry}
        material={nodes["Original-circle_cell078"].material}
        position={[-0.064, 0.854, -0.212]}
      />
      <mesh
        name="Original-circle_cell079"
        geometry={nodes["Original-circle_cell079"].geometry}
        material={nodes["Original-circle_cell079"].material}
        position={[-0.073, 0.035, 0.31]}
      />
      <mesh
        name="Original-circle_cell080"
        geometry={nodes["Original-circle_cell080"].geometry}
        material={nodes["Original-circle_cell080"].material}
        position={[-0.069, 0.439, 0.207]}
      />
      <mesh
        name="Original-circle_cell081"
        geometry={nodes["Original-circle_cell081"].geometry}
        material={nodes["Original-circle_cell081"].material}
        position={[-0.066, 0.193, -0.174]}
      />
      <mesh
        name="Original-circle_cell082"
        geometry={nodes["Original-circle_cell082"].geometry}
        material={nodes["Original-circle_cell082"].material}
        position={[-0.069, 0.883, 0.186]}
      />
      <mesh
        name="Original-circle_cell083"
        geometry={nodes["Original-circle_cell083"].geometry}
        material={nodes["Original-circle_cell083"].material}
        position={[-0.033, 0.636, 0.218]}
      />
      <mesh
        name="Original-circle_cell084"
        geometry={nodes["Original-circle_cell084"].geometry}
        material={nodes["Original-circle_cell084"].material}
        position={[-0.013, 0.556, 0.528]}
      />
    </group>
  );
};

useGLTF.preload("/models/target.glb");
