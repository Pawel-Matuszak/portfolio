import { Canvas } from '@react-three/fiber'
import { SceneProvider } from './SceneContext'
import { ModelLoader } from './ModelLoader'
import { World } from './World'
import { Interactions } from './Interactions'
import { Cameras } from './Cameras'
import { CameraSwitcher } from './CameraSwitcher'
import { TreeContentOverlays } from '../components/TreeContentOverlays'
import { OrbitControls } from '@react-three/drei'

export function CanvasScene() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SceneProvider>
        <Canvas>
          <ambientLight intensity={0.75} />
          <ModelLoader />
          <World />
          <Interactions />
          <Cameras />
          <TreeContentOverlays />
          {/* <OrbitControls enableDamping makeDefault/> */}
        </Canvas>
        <CameraSwitcher />
      </SceneProvider>
    </div>
  )
}

