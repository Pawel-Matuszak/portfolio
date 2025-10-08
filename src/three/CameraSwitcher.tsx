import { useScene } from './SceneContext'
import { Overlay } from '../components/Overlay'
import { CameraGrid } from '../components/CameraGrid'
import { NavigationBar } from '../components/NavigationBar'
import * as THREE from 'three'

const cameraNames = {
  'Project Workshop': 0,
  'Experience tree': 3,
  'About Me': 2,
}

export function CameraSwitcher() {
  const {
    currentCameraIndex,
    setCurrentCameraIndex,
    loadedCameras,
    islandWorkshopOutline,
    islandTreeOutline,
    islandContactOutline
  } = useScene()

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
          onHoverStart={(index) => {
            // Map camera index to outline group visibility
            if (index === 0 && islandWorkshopOutline.current) {
              islandWorkshopOutline.current.visible = true
              // Make individual meshes visible
              islandWorkshopOutline.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.visible = true
                }
              })
            }
            if (index === 3 && islandTreeOutline.current) {
              islandTreeOutline.current.visible = true
              // Make individual meshes visible
              islandTreeOutline.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.visible = true
                }
              })
            }
            if (index === 2 && islandContactOutline.current) {
              islandContactOutline.current.visible = true
              // Make individual meshes visible
              islandContactOutline.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.visible = true
                }
              })
            }
          }}
          onHoverEnd={() => {
            if (islandWorkshopOutline.current) {
              islandWorkshopOutline.current.visible = false
              // Make individual meshes invisible
              islandWorkshopOutline.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.visible = false
                }
              })
            }
            if (islandTreeOutline.current) {
              islandTreeOutline.current.visible = false
              // Make individual meshes invisible
              islandTreeOutline.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.visible = false
                }
              })
            }
            if (islandContactOutline.current) {
              islandContactOutline.current.visible = false
              // Make individual meshes invisible
              islandContactOutline.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.visible = false
                }
              })
            }
          }}
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
