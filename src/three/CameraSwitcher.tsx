import { useScene } from './SceneContext'
import { Overlay } from '../components/Overlay'
import { CameraGrid } from '../components/CameraGrid'
import { NavigationBar } from '../components/NavigationBar'

const cameraNames = {
  'Project Workshop': 0,
  'Experience tree': 3,
  'About Me': 2, 
}

export function CameraSwitcher() {
  const { currentCameraIndex, setCurrentCameraIndex, loadedCameras } = useScene()

  if (loadedCameras.length === 0) {
    return null
  }

  const cameraOptions = Object.entries(cameraNames).map(([name, index]) => ({
    name,
    index: Number(index)
  }))

  const isInCameraSelectionMode = currentCameraIndex === 1

  return (
    <>
      <Overlay visible={isInCameraSelectionMode}>
        <CameraGrid 
          cameras={cameraOptions}
          onCameraSelect={setCurrentCameraIndex}
        />
      </Overlay>
      
      {!isInCameraSelectionMode && (
        <NavigationBar
          onBackClick={() => setCurrentCameraIndex(1)}
          onCameraClick={setCurrentCameraIndex}
          cameras={cameraOptions}
          currentCameraIndex={currentCameraIndex}
        />
      )}
    </>
  )
}
