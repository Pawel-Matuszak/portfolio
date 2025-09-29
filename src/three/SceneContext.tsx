import { createContext, useContext, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export type LoadedScene = {
  name: string
  scene: THREE.Group
}

export type SceneContextValue = {
  loadedScenes: LoadedScene[]
  setLoadedScenes: React.Dispatch<React.SetStateAction<LoadedScene[]>>
  greenSceneMeshes: React.MutableRefObject<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[]>
  treeContentMeshes: React.MutableRefObject<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[]>
  workshopContentMeshes: React.MutableRefObject<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[]>
  treeContentsVisible: boolean
  setTreeContentsVisible: (v: boolean) => void
  currentVisibleTreeContent: number | null
  setCurrentVisibleTreeContent: (v: number | null) => void
  loadedCameras: THREE.Camera[]
  setLoadedCameras: React.Dispatch<React.SetStateAction<THREE.Camera[]>>
  currentCameraIndex: number
  setCurrentCameraIndex: (i: number) => void
}

const SceneContext = createContext<SceneContextValue | null>(null)

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [loadedScenes, setLoadedScenes] = useState<LoadedScene[]>([])
  const [loadedCameras, setLoadedCameras] = useState<THREE.Camera[]>([])
  //0 - workshop
  //1 - main
  //2 - about
  //3 - three
  const [currentCameraIndex, setCurrentCameraIndex] = useState(1)
  const [treeContentsVisible, setTreeContentsVisible] = useState(false)
  const [currentVisibleTreeContent, setCurrentVisibleTreeContent] = useState<number | null>(null)

  const greenSceneMeshes = useRef<THREE.Mesh[]>([])
  const treeContentMeshes = useRef<THREE.Mesh[]>([])
  const workshopContentMeshes = useRef<THREE.Mesh[]>([])

  const value: SceneContextValue = useMemo(() => ({
    loadedScenes,
    setLoadedScenes,
    greenSceneMeshes,
    treeContentMeshes,
    workshopContentMeshes,
    treeContentsVisible,
    setTreeContentsVisible,
    currentVisibleTreeContent,
    setCurrentVisibleTreeContent,
    loadedCameras,
    setLoadedCameras,
    currentCameraIndex,
    setCurrentCameraIndex
  }), [loadedScenes, treeContentsVisible, currentVisibleTreeContent, loadedCameras, currentCameraIndex])

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used within SceneProvider')
  return ctx
}

