import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useThree } from '@react-three/fiber'
import { CAMERAS_GLTF_URL, DRACO_DECODER_PATH } from './sceneConfigs'
import { useScene } from './SceneContext'
import { useFrame } from '@react-three/fiber'

export function Cameras() {
  const { camera: baseCamera, set } = useThree()
  const { setLoadedCameras, loadedCameras, currentCameraIndex, setCurrentCameraIndex } = useScene()
  const baseQuaternionsRef = useRef<Map<THREE.Camera, THREE.Quaternion>>(new Map())

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
            const aspect = (baseCamera as THREE.PerspectiveCamera).aspect
            newCam = new THREE.PerspectiveCamera(anyChild.fov, aspect, anyChild.near, anyChild.far)
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
  }, [(baseCamera as THREE.PerspectiveCamera).aspect, setLoadedCameras])

  // Sync active camera switch
  useEffect(() => {
    const selected = loadedCameras[currentCameraIndex]
    if (selected) {
      set({ camera: selected as THREE.PerspectiveCamera })
      // Ensure the selected camera starts from its original orientation
      const baseQuat = baseQuaternionsRef.current.get(selected)
      if (baseQuat) {
        selected.quaternion.copy(baseQuat)
      }
    }
  }, [loadedCameras, currentCameraIndex, set])

  // Keyboard-based camera switching: [ -> previous, ] -> next
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (loadedCameras.length === 0) return
      if (e.key === '[') {
        const nextIndex = (currentCameraIndex - 1 + loadedCameras.length) % loadedCameras.length
        setCurrentCameraIndex(nextIndex)
      } else if (e.key === ']') {
        const nextIndex = (currentCameraIndex + 1) % loadedCameras.length
        setCurrentCameraIndex(nextIndex)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loadedCameras, setCurrentCameraIndex])

  //camera parallax tilt effect
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const selected = loadedCameras[currentCameraIndex]
      if (selected) {
        mouseX.current = e.clientX/window.innerWidth - 0.5
        mouseY.current = e.clientY/window.innerHeight - 0.5
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [loadedCameras, currentCameraIndex])

  // Capture and cache each camera's original quaternion once
  useEffect(() => {
    for (const cam of loadedCameras) {
      if (!baseQuaternionsRef.current.has(cam)) {
        baseQuaternionsRef.current.set(cam, cam.quaternion.clone())
      }
    }
  }, [loadedCameras])

  useFrame(() => {
    const selected = loadedCameras[currentCameraIndex]
    if (selected) {
      const baseQuat = baseQuaternionsRef.current.get(selected)
      if (!baseQuat) return

      const maxRotation = 0.05
      const offsetX = -mouseY.current * maxRotation
      const offsetY = -mouseX.current * maxRotation

      const offsetEuler = new THREE.Euler(offsetX, offsetY, 0, 'YXZ')
      const offsetQuat = new THREE.Quaternion().setFromEuler(offsetEuler)
      const desiredQuat = baseQuat.clone().multiply(offsetQuat)

      selected.quaternion.slerp(desiredQuat, 0.1)
    }
  })

  return null
}

