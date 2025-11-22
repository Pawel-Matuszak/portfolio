import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { SceneProvider } from './SceneContext'
import { ModelLoader } from './ModelLoader'
import { World } from './World'
import { Interactions } from './Interactions'
import { Cameras } from './Cameras'
import { CameraSwitcher } from './CameraSwitcher'
import { WaterAnimation } from './WaterAnimation'
import { WindAnimation } from './WindAnimation'
import { GradientSky } from './GradientSky'
import { TreeContentOverlays } from '../components/TreeContentOverlays'
import { WorkshopTooltip } from '../components/WorkshopTooltip'
import { LoadingScreen } from '../components/LoadingScreen'

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
          <WaterAnimation />
          <WindAnimation />
          <TreeContentOverlays />
          <WorkshopTooltip />
          {import.meta.env.DEV && (
            <>
              <Perf
                position="top-left"
                minimal={false}
                showGraph={true}
                logsPerSecond={2}
                deepAnalyze={false}
              />
            </>
          )}
          {/* <OrbitControls enableDamping makeDefault /> */}
          {/* <Environment preset="park" background /> */}
          <GradientSky />
        </Canvas>
        <LoadingScreen />
        <CameraSwitcher />
      </SceneProvider>
    </div>
  )
}

