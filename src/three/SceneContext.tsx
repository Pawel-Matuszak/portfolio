import { createContext, useContext, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export interface LoadedScene {
  name: string
  scene: THREE.Group
}

export interface SceneContextValue {
  loadedScenes: LoadedScene[]
  setLoadedScenes: React.Dispatch<React.SetStateAction<LoadedScene[]>>
  greenSceneMeshes: React.MutableRefObject<THREE.Mesh[]>
  treeContentMeshes: React.MutableRefObject<THREE.Mesh[]>
  workshopContentMeshes: React.MutableRefObject<THREE.Mesh[]>
  contactContentMeshes: React.MutableRefObject<THREE.Mesh[]>
  buildingsMeshes: React.MutableRefObject<THREE.Mesh[]>
  islandWorkshopMeshes: React.MutableRefObject<THREE.Mesh[]>
  islandTreeMeshes: React.MutableRefObject<THREE.Mesh[]>
  islandContactMeshes: React.MutableRefObject<THREE.Mesh[]>
  islandWorkshopOutline: React.MutableRefObject<THREE.Group | null>
  islandTreeOutline: React.MutableRefObject<THREE.Group | null>
  islandContactOutline: React.MutableRefObject<THREE.Group | null>
  navContentMeshes: React.MutableRefObject<THREE.Mesh[]>
  contactAnimationMeshes: React.MutableRefObject<THREE.Mesh[]>
  treeContentsVisible: boolean
  setTreeContentsVisible: (v: boolean) => void
  currentVisibleTreeContent: number | null
  setCurrentVisibleTreeContent: (v: number | null) => void
  hoveredWorkshopContent: string | null
  setHoveredWorkshopContent: (v: string | null) => void
  loadedCameras: THREE.PerspectiveCamera[]
  setLoadedCameras: React.Dispatch<React.SetStateAction<THREE.PerspectiveCamera[]>>
  currentCameraIndex: number
  setCurrentCameraIndex: (i: number) => void
}

const SceneContext = createContext<SceneContextValue | null>(null)

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [loadedScenes, setLoadedScenes] = useState<LoadedScene[]>([])
  const [loadedCameras, setLoadedCameras] = useState<THREE.PerspectiveCamera[]>([])
  //0 - workshop
  //1 - main
  //2 - about
  //3 - three
  const [currentCameraIndex, setCurrentCameraIndex] = useState(1)
  const contactAnimationMeshes = useRef<THREE.Mesh[]>([])
  const [treeContentsVisible, setTreeContentsVisible] = useState(false)
  const [currentVisibleTreeContent, setCurrentVisibleTreeContent] = useState<number | null>(null)
  const [hoveredWorkshopContent, setHoveredWorkshopContent] = useState<string | null>(null)

  const greenSceneMeshes = useRef<THREE.Mesh[]>([])
  const treeContentMeshes = useRef<THREE.Mesh[]>([])
  const workshopContentMeshes = useRef<THREE.Mesh[]>([])
  const contactContentMeshes = useRef<THREE.Mesh[]>([])
  const buildingsMeshes = useRef<THREE.Mesh[]>([])
  const islandWorkshopMeshes = useRef<THREE.Mesh[]>([])
  const islandTreeMeshes = useRef<THREE.Mesh[]>([])
  const islandContactMeshes = useRef<THREE.Mesh[]>([])
  const islandWorkshopOutline = useRef<THREE.Group | null>(null)
  const islandTreeOutline = useRef<THREE.Group | null>(null)
  const islandContactOutline = useRef<THREE.Group | null>(null)
  const navContentMeshes = useRef<THREE.Mesh[]>([])

  const value: SceneContextValue = useMemo(() => ({
    loadedScenes,
    setLoadedScenes,
    greenSceneMeshes,
    treeContentMeshes,
    workshopContentMeshes,
    contactContentMeshes,
    buildingsMeshes,
    islandWorkshopMeshes,
    islandTreeMeshes,
    islandContactMeshes,
    islandWorkshopOutline,
    islandTreeOutline,
    islandContactOutline,
    navContentMeshes,
    contactAnimationMeshes,
    treeContentsVisible,
    setTreeContentsVisible,
    currentVisibleTreeContent,
    setCurrentVisibleTreeContent,
    hoveredWorkshopContent,
    setHoveredWorkshopContent,
    loadedCameras,
    setLoadedCameras,
    currentCameraIndex,
    setCurrentCameraIndex
  }), [
    loadedScenes,
    contactAnimationMeshes,
    treeContentsVisible,
    currentVisibleTreeContent,
    hoveredWorkshopContent,
    loadedCameras,
    currentCameraIndex,
    contactContentMeshes,
    buildingsMeshes,
    islandWorkshopMeshes,
    islandTreeMeshes,
    islandContactMeshes,
    navContentMeshes
  ])

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used within SceneProvider')
  return ctx
}

