import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useThree } from '@react-three/fiber'
import { CAMERAS_GLTF_URL, DRACO_DECODER_PATH } from './sceneConfigs'
import { useScene } from './SceneContext'

export function Cameras() {
  const { camera: baseCamera, set } = useThree()
  const { setLoadedCameras, loadedCameras, currentCameraIndex, setCurrentCameraIndex } = useScene()

  useEffect(() => {
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath(DRACO_DECODER_PATH)
    loader.setDRACOLoader(draco)

    loader.load(CAMERAS_GLTF_URL, (gltf) => {
      const cams: THREE.Camera[] = []
      gltf.scene.traverse((child: THREE.Object3D) => {
        const anyChild = child as any
        if (anyChild.isCamera) {
          let newCam: THREE.Camera | null = null
          if (anyChild.isPerspectiveCamera) {
            newCam = new THREE.PerspectiveCamera(anyChild.fov, baseCamera.aspect, anyChild.near, anyChild.far)
          } else if (anyChild.isOrthographicCamera) {
            newCam = new THREE.OrthographicCamera(anyChild.left, anyChild.right, anyChild.top, anyChild.bottom, anyChild.near, anyChild.far)
          }
          if (newCam) {
            child.updateMatrixWorld(true)
            const pos = new THREE.Vector3()
            const quat = new THREE.Quaternion()
            const scl = new THREE.Vector3()
            child.matrixWorld.decompose(pos, quat, scl)
            newCam.position.copy(pos)
            newCam.quaternion.copy(quat)
            newCam.name = child.name || `Camera ${cams.length + 1}`
            cams.push(newCam)
          }
        }
      })
      setLoadedCameras(cams)
    })
  }, [baseCamera.aspect, setLoadedCameras])

  // Sync active camera switch
  useEffect(() => {
    const selected = loadedCameras[currentCameraIndex]
    if (selected) {
      // Replace the three fiber default camera
      set({ camera: selected as THREE.PerspectiveCamera })
      // If user has OrbitControls in the tree via drei, updating target is up to parent
    }
  }, [loadedCameras, currentCameraIndex, set])

  // Keyboard-based camera switching: [ -> previous, ] -> next
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (loadedCameras.length === 0) return
      if (e.key === '[') {
        setCurrentCameraIndex((current: number) => (current - 1 + loadedCameras.length) % loadedCameras.length)
      } else if (e.key === ']') {
        setCurrentCameraIndex((current: number) => (current + 1) % loadedCameras.length)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loadedCameras, setCurrentCameraIndex])

  return null
}

