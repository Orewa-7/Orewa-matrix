import * as THREE from "three";
import hudVertexShader from "../shaders/hud/vertex.glsl";
import hudFragmentShader from "../shaders/hud/fragment.glsl";
import { useControls } from "leva";
import useWeapons from "../../stores/useWeapons";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const BaseCircle = (props) => {
  const { scale } = props;
  const meshRef = useRef();
  const weapon = useWeapons((state) => state.weapon);
  useEffect(() => {
    gsap.set(meshRef.current.scale, { x: 0, y: 0, z: 0 });
    gsap.to(meshRef.current.scale, {
      delay: 0.1,
      duration: 1,
      x: scale,
      y: scale,
      z: scale,
      ease: "elastic.out(1, 0.3)",
    });
  }, [weapon]);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: `
            varying vec2 vUv;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vUv = uv;
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            void main() {
                float d = distance(vUv, vec2(0.5));
                d= abs(d-0.45);
                d=1.-smoothstep(0., 0.025, d);
                vec3 color = vec3(d);
                gl_FragColor = vec4(color, d);
            }
        `,
  });
  return (
    <>
      <mesh material={material} {...props} ref={meshRef}>
        <planeGeometry args={[1, 1]} />
        <SecondCircle scale={0.8} position={[-0.025, 0, 0.1]} />
      </mesh>
    </>
  );
};

const SecondCircle = (props) => {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: `
              varying vec2 vUv;
              void main() {
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  vUv = uv;
              }
          `,
    fragmentShader: `
              varying vec2 vUv;
              void main() {
                  float d = distance(vUv, vec2(0.5));
                  d= abs(d-0.45);
                  d=1.-smoothstep(0., 0.05, d);
                  vec3 color = vec3(d) * 0.5;
                  gl_FragColor = vec4(color, d);
              }
          `,
  });
  return (
    <>
      <mesh material={material} {...props}>
        <planeGeometry args={[1, 1]} />
        <ThirdCircle scale={0.8} position={[-0.025, 0, 0.1]} />
      </mesh>
    </>
  );
};

const ThirdCircle = (props) => {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: `
              varying vec2 vUv;
              void main() {
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  vUv = uv;
              }
          `,
    fragmentShader: `
              varying vec2 vUv;
              void main() {
                  float d = distance(vUv, vec2(0.5));
                  d= abs(d-0.45);
                  d=1.-smoothstep(0., 0.026, d);
                  vec3 color = vec3(d) * 0.5;
                  gl_FragColor = vec4(color, d);
              }
          `,
  });
  return (
    <>
      <mesh material={material} {...props}>
        <planeGeometry args={[1, 1]} />
        <Mire scale={0.8} position={[-0.025, 0, 0.1]} />
      </mesh>
    </>
  );
};

const Mire = (props) => {
  const weapon = useWeapons((state) => state.weapon);
  const hud = weapon === "sniper" ? 0 : weapon === "rifle" ? 0.5 : 1;

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: hudVertexShader,
    fragmentShader: hudFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color("#ff7900") },
      uWeapon: { value: hud },
    },
  });
  return (
    <>
      <mesh material={material} {...props}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
};

export { BaseCircle, SecondCircle, ThirdCircle, Mire };
