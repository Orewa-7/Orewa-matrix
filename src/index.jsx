import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas
    shadows
    camera={{
      fov: 35,
      near: 0.01,
      far: 100,
      position: [0, 0, 2],
    }}
  >
    <Experience />
  </Canvas>
);
