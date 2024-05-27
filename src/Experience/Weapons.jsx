import { PerspectiveCamera, RenderTexture, Text } from "@react-three/drei";
import * as THREE from "three";

import Platform from "./Weapons/Platform";
import HoloLight from "./Weapons/HoloLight";
import useWeapons from "../stores/useWeapons";
import Arrows from "./Weapons/Arrows";
import Weapon from "./Weapons/Weapon";

const weapons = ["sniper", "rifle", "pistol"];

const Weapons = () => {
  const weapon = useWeapons((state) => state.weapon);
  return (
    <>
      <mesh position={[-1, 0.6, -1]}>
        <planeGeometry args={[1.5, 1.5, 1, 1]} />
        <meshBasicMaterial
          transparent
          blending={THREE.AdditiveBlending}
          // color={"cyan"}
        >
          <RenderTexture attach="map" anisotropy={16}>
            <directionalLight position={[0, -1, 1]} intensity={5} />
            {/* <color attach="background" args={["red"]} /> */}
            <PerspectiveCamera
              makeDefault
              manual
              aspect={1 / 1}
              position={[0, 0, 2]}
              lookAt={[0, 0, 0]}
            />

            <Platform />
            <HoloLight />
            <Arrows />
            {weapons.map((weaponItem, index) => (
              <Weapon
                key={index}
                weapon={weaponItem}
                visible={weaponItem === weapon}
              />
            ))}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
    </>
  );
};
export default Weapons;
