import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import React, { Suspense } from "react";
import Serial from "./Serial";
import { AttitudeIndicator, HeadingIndicator } from './react-flight-indicators'

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
              rotation-x={  props.rotate.ry + Math.PI / (-2)}
              rotation-y={ -props.rotate.rx}
              rotation-z={  props.rotate.rz}
              scale={0.003}
            />
          );
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {rx: 0, ry: 0, rz: 0};
    this.serial = new Serial();
    this.serial.setApp(this);
    this.buffer = "";
  }

  componentDidMount() {
    // setInterval(this.test_update, 10);
  }

  update = (str) => {
    var rotate = str.split(",").map(s => Number(s))
    switch (rotate.length) {
      case 3 :
        console.log("three", rotate)
        this.setState({
          ...this.state,
          rx : rotate[0],
          ry : rotate[1],
          rz : rotate[2]
        })
        break;
      default:
        break;
    }
  };

  test_update = () => {
    this.setState({
      ...this.state,
      rx : this.state.rx - 0.001,
      ry : this.state.ry + 0.001,
      rz : this.state.rz + 0.001,
    })
  };

  render() {
    return (
      <div className="App">
        <div>
          <h1>Gyro Viewer</h1>
          Select:
          <button
            type='button'
            onClick={(event) => {
              this.serial.connect();
            }}
          >
            COM
          </button>
          &nbsp;&nbsp;Command:
          <button type='button'
            onClick={(event) => {
              this.serial.start();
            }}
          >
            Start
          </button>
          &nbsp;
          <button type='button'
            onClick={(event) => {
              this.serial.stop();
            }}
          >
            Stop
          </button>
          <pre id='results'> Messages </pre>
        </div>

        <div>
          <HeadingIndicator  size={150} heading={-this.state.rz * 180/Math.PI} showBox={false} />
          <AttitudeIndicator size={150}  width={100} roll={-this.state.rx * 180/Math.PI} pitch={this.state.ry * 180/Math.PI} showBox={false} />
          {/* <HeadingIndicator  size={150} heading={Math.random() * 360} showBox={false} />
          <AttitudeIndicator size={150}  width={100} roll={(Math.random() - 0.5) * 120} pitch={(Math.random() - 0.5) * 40} showBox={false} /> */}
        </div>

        <Canvas>
          <pointLight position={[0, 5, 30]} />
          <Suspense fallback={null}>
            <Scene rotate={this.state} />
          </Suspense>
        </Canvas>
      </div>
    );
  }
}

export default App;
