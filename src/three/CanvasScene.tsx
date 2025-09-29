import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SceneProvider } from './SceneContext'
import { ModelLoader } from './ModelLoader'
import { World } from './World'
import { Interactions } from './Interactions'
import { Cameras } from './Cameras'

export function CanvasScene() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas>
        <SceneProvider>
          <ambientLight intensity={0.75} />
          <ModelLoader />
          <World />
          <Interactions />
          <Cameras />
          {/* <OrbitControls enableDamping makeDefault/> */}
        </SceneProvider>
      </Canvas>
    </div>
  )
}

