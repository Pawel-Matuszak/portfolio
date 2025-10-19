import { useEffect, useMemo, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useScene } from './SceneContext'
import { BLUEPRINT_LINKS, CONTACT_LINKS } from './sceneConfigs'

export function Interactions() {
  const { gl, camera } = useThree()
  const {
    greenSceneMeshes,
    treeContentMeshes,
    workshopContentMeshes,
    contactContentMeshes,
    contactAnimationMeshes,
    loadedScenes,
    loadedCameras,
    treeContentsVisible,
    setTreeContentsVisible,
    currentVisibleTreeContent,
    setCurrentVisibleTreeContent,
    setHoveredWorkshopContent,
    currentCameraIndex
  } = useScene()

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useMemo(() => new THREE.Vector2(), [])
  const lastMousePosition = useRef(new THREE.Vector2())
  const hoverState = useMemo(() => ({
    hovered: null as THREE.Mesh | null,
    originalScale: null as THREE.Vector3 | null
  }), [])
  const threeFirstTImeFlash = useRef(true)

  const originalCameraPos = useRef<THREE.Vector3 | null>(null)
  const hoverEndTime = useRef<number | null>(null)
  const contactFirstTimeFlash = useRef(true)
  // Performance optimization refs
  const raycasterThrottle = useRef(0)
  const RAYCASTER_THROTTLE_MS = 16 // ~60fps
  const MOUSE_MOVEMENT_THRESHOLD = 0.001

  // Pre-create hover materials to avoid cloning on every hover
  const hoverMaterials = useMemo(() => {
    const materials = new Map<THREE.Mesh, THREE.Material>()
    const allMeshes = [
      ...greenSceneMeshes.current,
      ...treeContentMeshes.current,
      ...workshopContentMeshes.current,
      ...contactContentMeshes.current
    ]

    allMeshes.forEach(mesh => {
      const original = (mesh.userData as any).originalMaterial
      if (original) {
        const hoverMaterial = original.clone()
        if ((hoverMaterial).color) {
          (hoverMaterial).color.multiplyScalar(1.5)
        }
        materials.set(mesh, hoverMaterial)
      }
    })
    return materials
  }, [loadedScenes, greenSceneMeshes, treeContentMeshes, workshopContentMeshes, contactContentMeshes])

  // Frustum culling for performance
  const frustum = useMemo(() => new THREE.Frustum(), [])
  const matrix = useMemo(() => new THREE.Matrix4(), [])

  // Batch state updates to reduce re-renders
  const updateHoverState = useCallback((hovered: THREE.Mesh | null, originalScale: THREE.Vector3 | null) => {
    hoverState.hovered = hovered
    hoverState.originalScale = originalScale
  }, [hoverState])

  // Reset original camera position and hide tree contents when switching cameras
  useEffect(() => {
    originalCameraPos.current = null
    toggleTreeContents(false, currentVisibleTreeContent!)

    //flash animation for leaves to suggest interactivity on three page
    if (currentCameraIndex === 3 && threeFirstTImeFlash.current) {
      // Simple flash animation for leaves to suggest interactivity
      const treeContentsScene = loadedScenes.find((s) => s.name === 'bushRocks-scene')
      if (!treeContentsScene) {
        console.log('Tree contents scene not found!')
        return
      }

      // Smooth flash function with gradual transitions
      const flashLeaf = (obj: THREE.Mesh, delay: number) => {
        const originalMaterial = (obj.userData as any).originalMaterial as THREE.Material
        if (!originalMaterial) {
          return
        }

        const flashMaterial: any = originalMaterial.clone()
        if (flashMaterial.color) {
          flashMaterial.color.multiplyScalar(2)
        }

        setTimeout(() => {
          const fadeInDuration = 200 // 200ms fade in
          const holdDuration = 300 // 300ms hold
          const fadeOutDuration = 200 // 200ms fade out

          const startTime = Date.now()
          const originalColor = (originalMaterial as THREE.MeshBasicMaterial).color.clone()
          const flashColor = (flashMaterial as THREE.MeshBasicMaterial).color.clone()

          const animate = () => {
            const elapsed = Date.now() - startTime

            if (elapsed < fadeInDuration) {
              // Fade in phase
              const progress = elapsed / fadeInDuration
              const currentColor = originalColor.clone().lerp(flashColor, progress)
              obj.material = originalMaterial.clone();
              (obj.material as any).color = currentColor
              requestAnimationFrame(animate)
            } else if (elapsed < fadeInDuration + holdDuration) {
              // Hold phase
              obj.material = flashMaterial
              requestAnimationFrame(animate)
            } else if (elapsed < fadeInDuration + holdDuration + fadeOutDuration) {
              // Fade out phase
              const fadeOutProgress = (elapsed - fadeInDuration - holdDuration) / fadeOutDuration
              const currentColor = flashColor.clone().lerp(originalColor, fadeOutProgress)
              obj.material = originalMaterial.clone();
              (obj.material as any).color = currentColor
              requestAnimationFrame(animate)
            } else {
              // Animation complete - restore original
              obj.material = originalMaterial
            }
          }

          animate()
        }, delay)
      }

      for (let i = 1; i <= 4; i++) {
        const obj: THREE.Mesh = treeContentsScene.scene.getObjectByName(`leaves${i}`) as THREE.Mesh
        if (obj) {
          flashLeaf(obj, i * 250)
        } else {
          console.warn('Leaf not found:', `leaves${i}`)
        }
      }
      threeFirstTImeFlash.current = false
    }

    //contact me text animation on contact page
    if (currentCameraIndex === 2 && contactFirstTimeFlash.current) {
      contactFirstTimeFlash.current = false
      const meshes = contactAnimationMeshes.current;
      const animateMeshes = async () => {
        for (const index in meshes) {
          const mesh = meshes[index]
          if (Number(index) > 0) {
            meshes[Number(index) - 1].visible = false
          }
          mesh.visible = true

          // Add timeout between iterations (e.g., 500ms)
          if (Number(index) < meshes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
      }

      animateMeshes()
    }
  }, [currentCameraIndex])

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const rect = (gl.domElement).getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }
    function onClick() {
      const allMeshes = [
        ...greenSceneMeshes.current,
        ...treeContentMeshes.current,
        ...workshopContentMeshes.current,
        ...contactContentMeshes.current
      ]
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
        } else if (currentCameraIndex === 2 && [
          'ContactContent1',
          'ContactContent2',
          'ContactContent3',
          'ContactContent4'
        ].includes(objectName)) {
          const contactLinks: Record<string, string> = CONTACT_LINKS
          const url = contactLinks[objectName]
          if (url) {
            window.location.href = url
          }
        } else if (currentCameraIndex === 0 && [
          'BlueprintContent1',
          'BlueprintContent2',
          'BlueprintContent3',
          'BlueprintContent4'
        ].includes(objectName)) {
          const blueprintLinks: Record<string, string> = BLUEPRINT_LINKS
          const url = blueprintLinks[objectName]
          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
          }
        }
      } else {
        //hide tree contents when clicked on other objects
        //camera index 3
        if (currentCameraIndex === 3) {
          toggleTreeContents(false, currentVisibleTreeContent!)
        }
      }
    }

    gl.domElement.addEventListener('mousemove', onMouseMove)
    gl.domElement.addEventListener('click', onClick)
    return () => {
      gl.domElement.removeEventListener('mousemove', onMouseMove)
      gl.domElement.removeEventListener('click', onClick)
    }
  }, [
    gl,
    camera,
    mouse,
    raycaster,
    currentVisibleTreeContent,
    treeContentsVisible,
    greenSceneMeshes,
    treeContentMeshes,
    currentCameraIndex,
    workshopContentMeshes,
    contactContentMeshes,
    loadedCameras
  ])

  useFrame(() => {
    const now = performance.now()

    // Throttle raycasting to improve performance
    if (now - raycasterThrottle.current < RAYCASTER_THROTTLE_MS) return

    // Only raycast if mouse has moved significantly
    if (mouse.distanceTo(lastMousePosition.current) < MOUSE_MOVEMENT_THRESHOLD) return

    raycasterThrottle.current = now
    lastMousePosition.current.copy(mouse)

    const allMeshes = [
      ...greenSceneMeshes.current,
      ...treeContentMeshes.current,
      ...workshopContentMeshes.current,
      ...contactContentMeshes.current
    ]
    const camera = loadedCameras[currentCameraIndex]

    // Frustum culling - only raycast against visible objects
    camera.updateMatrixWorld()
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    const visibleMeshes = allMeshes.filter(mesh => frustum.intersectsObject(mesh))

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(visibleMeshes)
    if (hoverState.hovered) {
      const original = (hoverState.hovered.userData as any).originalMaterial
      if (original) hoverState.hovered.material = original
      // Restore original scale
      if (hoverState.originalScale) {
        hoverState.hovered.scale.copy(hoverState.originalScale)
      }
      gl.domElement.style.cursor = 'default'

      // Clear workshop content tooltip if it was showing
      if (hoverState.hovered.name.startsWith('BlueprintContent')) {
        setHoveredWorkshopContent(null)
      }

      updateHoverState(null, null)
      hoverEndTime.current = Date.now()
    }
    if (intersects.length > 0) {
      const hovered = intersects[0].object as THREE.Mesh
      //hover effect on leaves
      //camera index 3
      if (currentCameraIndex === 3 && (hovered.name === 'leaves1' || hovered.name === 'leaves2' || hovered.name === 'leaves3' || hovered.name === 'leaves4' || hovered.name === 'TreeHoverContent')) {
        const hoverMaterial = hoverMaterials.get(hovered)
        if (hoverMaterial) {
          hovered.material = hoverMaterial
        }
        gl.domElement.style.cursor = 'pointer'
        updateHoverState(hovered, null)

        //zoom camera on hover
        //camera index 3
        // if (camera) {
        //   // Cache original camera position once at hover start
        //   if (!originalCameraPos.current) {
        //     originalCameraPos.current = camera.position.clone()
        //   }
        //   const hoveredPos = new THREE.Vector3(
        //     45.888423919677734,
        //     8.197944641113281,
        //     3.8714218139648438
        //   )
        //   const distance = hoveredPos.distanceTo(camera.position)
        //   if (distance > 24) {
        //     camera.position.lerp(hoveredPos, 0.02)
        //   }
        // }
      }


      //hover effect on workshop content
      //camera index 0
      if (currentCameraIndex === 0 && (
        hovered.name === 'BlueprintContent1' ||
        hovered.name === 'BlueprintContent2' ||
        hovered.name === 'BlueprintContent3' ||
        hovered.name === 'BlueprintContent4' ||
        hovered.name === 'BlueprintHoverContent'
      )) {
        const hoverMaterial = hoverMaterials.get(hovered)
        if (hoverMaterial) {
          hovered.material = hoverMaterial
        }
        // Store original scale and apply hover scale
        let originalScale = null
        if (hovered.name !== 'BlueprintHoverContent') {
          originalScale = hovered.scale.clone()
          hovered.scale.multiplyScalar(1.02)
        }
        gl.domElement.style.cursor = 'pointer'
        updateHoverState(hovered, originalScale)

        // Set hovered workshop content for tooltip
        if (hovered.name.startsWith('BlueprintContent')) {
          setHoveredWorkshopContent(hovered.name)
        }

        //Zoom camera to hovered position
        // if (camera) {
        //   // Cache original camera position once at hover start
        //   if (!originalCameraPos.current) {
        //     originalCameraPos.current = camera.position.clone()
        //   }
        //   const hoveredPos = new THREE.Vector3(14.9903564453125, 1.845353603363037, -19.42815399169922)
        //   const distance = hoveredPos.distanceTo(camera.position)
        //   if (distance > 2.4) {
        //     camera.position.lerp(hoveredPos, 0.02)
        //   }
        // }
      }

      //hover effect on contact content
      //camera index 2
      if (currentCameraIndex === 2 && (hovered.name === 'ContactContent1' || hovered.name === 'ContactContent2' || hovered.name === 'ContactContent3' || hovered.name === 'ContactContent4')) {
        const originalScale = hovered.scale.clone()
        hovered.scale.multiplyScalar(1.1)
        gl.domElement.style.cursor = 'pointer'
        updateHoverState(hovered, originalScale)
      }
    }

    if (!hoverState.hovered && originalCameraPos.current && camera) {
      // const now = Date.now()
      // const delay = 250
      // if (hoverEndTime.current && (now - hoverEndTime.current) > delay) {
      camera.position.lerp(originalCameraPos.current, 0.05)
      if (camera.position.distanceTo(originalCameraPos.current) < 0.01) {
        camera.position.copy(originalCameraPos.current)
        originalCameraPos.current = null
        // hoverEndTime.current = null
      }
      // }
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

