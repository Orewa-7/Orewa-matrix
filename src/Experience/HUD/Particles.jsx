import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import usePoints from "../../stores/usePoints";
import * as THREE from "three";
import sparklesVertexShader from "../shaders/weapons/sparkles/vertex.glsl";
import sparklesFragmentShader from "../shaders/weapons/sparkles/fragment.glsl";
import gsap from "gsap";

const Particles = ({ position }) => {
  const { scene } = useThree();
  const points = usePoints((state) => state.points);
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  };
  sizes.resolution = new THREE.Vector2(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );
  const requestRef = useRef();

  useEffect(() => {
    const createFirework = (count, position, size, texture, radius, color) => {
      // Geometry
      const positionsArray = new Float32Array(count * 3);
      const sizesArray = new Float32Array(count);
      const timeMultipliersArray = new Float32Array(count);
      const angleArray = new Float32Array(count);
      const shapeArray = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const pos = position;

        positionsArray[i3] = pos.x;
        positionsArray[i3 + 1] = pos.y;
        positionsArray[i3 + 2] = pos.z;

        angleArray[i] = Math.random() * -Math.PI + Math.PI / 2;

        sizesArray[i] = Math.random();

        timeMultipliersArray[i] = 1 + Math.random();
        shapeArray[i] = Math.random() * 3;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positionsArray, 3)
      );
      geometry.setAttribute(
        "aSize",
        new THREE.Float32BufferAttribute(sizesArray, 1)
      );
      geometry.setAttribute(
        "aTimeMultiplier",
        new THREE.Float32BufferAttribute(timeMultipliersArray, 1)
      );
      geometry.setAttribute(
        "aAngle",
        new THREE.Float32BufferAttribute(angleArray, 1)
      );
      geometry.setAttribute(
        "aShape",
        new THREE.Float32BufferAttribute(shapeArray, 1)
      );

      // Material
      const material = new THREE.ShaderMaterial({
        vertexShader: sparklesVertexShader,
        fragmentShader: sparklesFragmentShader,
        uniforms: {
          uSize: new THREE.Uniform(size),
          uResolution: new THREE.Uniform(sizes.resolution),
          uTexture: new THREE.Uniform(texture),
          uColor: new THREE.Uniform(color),
          uProgress: new THREE.Uniform(0),
          uTime: new THREE.Uniform(0),
        },
        transparent: true,
        depthWrite: false,
      });

      // Points
      const firework = new THREE.Points(geometry, material);
      firework.position.copy(position); // Set the position of the firework
      scene.add(firework);

      // Destroy
      const destroy = () => {
        scene.remove(firework);
        geometry.dispose();
        material.dispose();
        // cancelAnimationFrame(requestRef.current);
      };

      // Animate
      gsap.to(material.uniforms.uProgress, {
        value: 1,
        ease: "linear",
        duration: 3,
        onComplete: () => {
          destroy();
        },
      });

      const tick = () => {
        material.uniforms.uTime.value += 0.05;
        requestRef.current = requestAnimationFrame(tick);
      };
      tick();
    };

    if (position) {
      const createRandomFirework = () => {
        const count = Math.round(20 + Math.random() * 10);
        const size = 0.5;
        const texture = 0;
        const radius = 0.5 + Math.random();
        const color = new THREE.Color("#ff7300");
        // color.setHSL(Math.random(), 1, 0.7);
        createFirework(count, position, size, texture, radius, color);
      };
      if (points > 0) createRandomFirework();
    }
  }, [points]);

  return null;
};

export default Particles;
