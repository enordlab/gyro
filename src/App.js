import "./styles.css";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader } from "three-stdlib";
import { Suspense } from "react";

// THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = () => {
  const materials = useLoader(MTLLoader, "11805_airplane_v2_L2.mtl");
  const obj = useLoader(OBJLoader, "11805_airplane_v2_L2.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  console.log('---', obj);
  return  (<primitive
              object={obj}
              rotation-x={Math.PI * (-0.45)}
              scale={0.003}
            />
          );
};

export default function App() {
  return (
    <div className="App">
      <Canvas>
        <pointLight position={[0, 5, 30]} />
        <Suspense fallback={null}>
          <Scene />
          {/* <OrbitControls /> */}
          {/* <Environment preset="sunset" background /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
