import "./styles.css";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader } from "three-stdlib";
import React, { useState, Suspense } from "react";

// THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = (props) => {
  const materials = useLoader(MTLLoader, "11805_airplane_v2_L2.mtl");
  const obj = useLoader(OBJLoader, "11805_airplane_v2_L2.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // console.log('---', props.rotate.rx);
  return  (<primitive
              object={obj}
              rotation-x={Math.PI * (-0.45 + props.rotate.rx)}
              rotation-y={Math.PI * (props.rotate.ry)}
              rotation-z={Math.PI * (props.rotate.rz)}
              scale={0.003}
            />
          );
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {rx: 0, ry: 0, rz: 0};
  }

  componentDidMount() {
    setInterval(this.update, 10);
  }

  update = () => {
    this.setState({
      ...this.state,
      rx : this.state.rx + 0.01,
      ry : this.state.ry - 0.01
    })
  };

  render() {
    return (
      <div className="App">
        <Canvas>
          <pointLight position={[0, 5, 30]} />
          <Suspense fallback={null}>
            <Scene rotate={this.state} />
            {/* <OrbitControls /> */}
            {/* <Environment preset="sunset" background /> */}
          </Suspense>
        </Canvas>
      </div>
    );
  }
}

export default App;

// export default function App() {
//   const [rotate, setRotate] = useState({rx: 0, ry: 0, rz: 0});
//   setInterval(() => { setRotate({rx : rotate.rx, ry: rotate.ry + 0.01, rz: rotate.rz}) }, 10)

//   return (
//     <div className="App">
//       <Canvas>
//         <pointLight position={[0, 5, 30]} />
//         <Suspense fallback={null}>
//           <Scene rotate={rotate} />
//           {/* <OrbitControls /> */}
//           {/* <Environment preset="sunset" background /> */}
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }
