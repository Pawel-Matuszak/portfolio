import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useScene } from './SceneContext'

export function Interactions() {
  const { gl, camera } = useThree()
  const {
    greenSceneMeshes,
    treeContentMeshes,
    workshopContentMeshes,
    loadedScenes,
    treeContentsVisible,
    setTreeContentsVisible,
    currentVisibleTreeContent,
    setCurrentVisibleTreeContent,
    currentCameraIndex
  } = useScene()

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useMemo(() => new THREE.Vector2(), [])
  const hoverState = useMemo(() => ({ 
    hovered: null as THREE.Mesh | null,
    originalScale: null as THREE.Vector3 | null
  }), [])

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const rect = (gl.domElement as HTMLCanvasElement).getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }
    function onClick() {
      const allMeshes = [...greenSceneMeshes.current, ...treeContentMeshes.current]
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(allMeshes)
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object as THREE.Mesh
        const objectName = clickedObject.name
        //toggle tree contents when clicked on leaves
        //camera index 3
        if (currentCameraIndex === 3 && ['leaves1', 'leaves2', 'leaves3', 'leaves4'].includes(objectName)) {
          const leafIndex = Number(objectName.replace('leaves', ''))
          if (currentVisibleTreeContent === leafIndex && treeContentsVisible) {
            toggleTreeContents(false, leafIndex)
          } else {
            toggleTreeContents(true, leafIndex)
          }
        } else if ([
          'TreeContent1',
          'TreeContent2',
          'TreeContent3',
          'TreeContent4'
        ].includes(objectName)) {
          const idx = Number(objectName.replace('TreeContent', ''))
          toggleTreeContents(false, idx)
        }
      }else{
        //hide tree contents when clicked on other objects
        //camera index 3
        if(currentCameraIndex === 3){
          toggleTreeContents(false, currentVisibleTreeContent as number)
        }
      }
    }

    gl.domElement.addEventListener('mousemove', onMouseMove)
    gl.domElement.addEventListener('click', onClick)
    return () => {
      gl.domElement.removeEventListener('mousemove', onMouseMove)
      gl.domElement.removeEventListener('click', onClick)
    }
  }, [gl, camera, mouse, raycaster, currentVisibleTreeContent, treeContentsVisible, greenSceneMeshes, treeContentMeshes, currentCameraIndex, workshopContentMeshes])

  useFrame(() => {
    const allMeshes = [...greenSceneMeshes.current, ...treeContentMeshes.current, ...workshopContentMeshes.current]
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(allMeshes)
    if (hoverState.hovered) {
      const original = (hoverState.hovered.userData as any).originalMaterial
      if (original) hoverState.hovered.material = original
      // Restore original scale
      if (hoverState.originalScale) {
        hoverState.hovered.scale.copy(hoverState.originalScale)
      }
      gl.domElement.style.cursor = 'default'
      hoverState.hovered = null
      hoverState.originalScale = null
    }
    if (intersects.length > 0) {
      const hovered = intersects[0].object as THREE.Mesh
      const original = (hovered.userData as any).originalMaterial
      //hover effect on leaves
      //camera index 3
      if(currentCameraIndex === 3 && (hovered.name === 'leaves1' || hovered.name === 'leaves2' || hovered.name === 'leaves3' || hovered.name === 'leaves4')){
        if (original) {
          const hoverMaterial = original.clone()
          if ((hoverMaterial as any).color) (hoverMaterial as any).color.multiplyScalar(1.5)
            hovered.material = hoverMaterial
        }
        gl.domElement.style.cursor = 'pointer'
        hoverState.hovered = hovered
      }
      //hover effect on workshop content
      //camera index 0
      if(currentCameraIndex === 0 && (hovered.name === 'BlueprintContent1' || hovered.name === 'BlueprintContent2' || hovered.name === 'BlueprintContent3' || hovered.name === 'BlueprintContent4')){
        if (original) {
          const hoverMaterial = original.clone()
          if ((hoverMaterial as any).color) (hoverMaterial as any).color.multiplyScalar(1.5)
          hovered.material = hoverMaterial
        }
        // Store original scale and apply hover scale
        if (!hoverState.originalScale) {
          hoverState.originalScale = hovered.scale.clone()
          hovered.scale.multiplyScalar(1.1)
        }
        gl.domElement.style.cursor = 'pointer'
        hoverState.hovered = hovered
      }
    }
  })

  function toggleTreeContents(show: boolean, index: number) {
    const treeContentsScene = loadedScenes.find((s) => s.name === 'treeContents-scene')
    if (!treeContentsScene) return
    treeContentsScene.scene.visible = show
    for (let i = 1; i <= 4; i++) {
      const obj = treeContentsScene.scene.getObjectByName(`TreeContent${i}`)
      if (obj) obj.visible = false
    }
    if (show) {
      const target = treeContentsScene.scene.getObjectByName(`TreeContent${index}`)
      if (target) target.visible = true
      setCurrentVisibleTreeContent(index)
    } else {
      setCurrentVisibleTreeContent(null)
    }
    setTreeContentsVisible(show)
  }

  return null
}

