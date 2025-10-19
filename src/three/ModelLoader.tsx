import { useEffect } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { sceneConfigs, DRACO_DECODER_PATH } from './sceneConfigs'
import { useScene } from './SceneContext'

function createMaterialFromTexture(texture?: THREE.Texture) {
  return new THREE.MeshBasicMaterial(texture ? { map: texture } : {})
}

export function ModelLoader() {
  const {
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
  } = useScene()

  // GLTFs are loaded per-scene below with DRACO configured on each loader instance
  const BASE_URL = import.meta.env.BASE_URL

  // Texture loader is synchronous in R3F via THREE.TextureLoader
  useEffect(() => {
    let isCancelled = false
    const textureLoader = new THREE.TextureLoader()

    async function loadAll() {
      const results: { name: string; scene: THREE.Group }[] = []
      for (const config of sceneConfigs) {
        try {
          let texture: THREE.Texture | undefined
          if (config.textureUrl) {
            texture = textureLoader.load(config.textureUrl)
            Object.assign(texture, config.textureSettings)
          }
          const material = createMaterialFromTexture(texture)

          // Load GLTF using a fresh loader that already has DRACO
          const loader = new GLTFLoader()
          const draco = new DRACOLoader()
          draco.setDecoderPath(DRACO_DECODER_PATH)
          loader.setDRACOLoader(draco)

          const gltf = await new Promise<THREE.Group>((resolve, reject) => {
            loader.load(
              config.sceneUrl,
              (g) => resolve(g.scene),
              undefined,
              (e) => reject(e instanceof Error ? e : new Error(String(e)))
            )
          })

          gltf.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              const mesh = child as THREE.Mesh
              mesh.material = material

              if (config.sceneUrl.endsWith('small.glb')) {
                if (mesh.name.includes('ContactMeText')) {
                  contactAnimationMeshes.current.push(mesh)
                }
              }
              if (config.sceneUrl.endsWith('nature.glb')) {
                if (['leaves1', 'leaves2', 'leaves3', 'leaves4'].includes(mesh.name)) {
                  greenSceneMeshes.current.push(mesh)
                    ; (mesh.userData as Record<string, unknown>).originalMaterial = (material).clone()
                }
              }
              if (config.sceneUrl.endsWith('treeContents.glb')) {
                if (['TreeContent1', 'TreeContent2', 'TreeContent3', 'TreeContent4', 'TreeHoverContent'].includes(mesh.name)) {
                  treeContentMeshes.current.push(mesh)
                    ; (mesh.userData as Record<string, unknown>).originalMaterial = (material).clone()
                  // Make plane invisible but raycastable so we can anchor HTML without seeing the square
                  const invisible = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
                    ; (invisible as unknown as { depthWrite: boolean }).depthWrite = false
                  mesh.material = invisible
                }
              }
              if (config.sceneUrl.endsWith('blueprintContents.glb')) {
                if (['BlueprintContent1', 'BlueprintContent2', 'BlueprintContent3', 'BlueprintContent4', 'BlueprintHoverContent'].includes(mesh.name)) {
                  workshopContentMeshes.current.push(mesh);
                  const tex = textureLoader.load(`${BASE_URL}static/${mesh.name}.png`)
                  Object.assign(tex, config.textureSettings)
                  mesh.material = new THREE.MeshBasicMaterial({ map: tex });
                  if (mesh.material?.clone) {
                    const cloned = mesh.material.clone()
                      ; (mesh.userData as Record<string, unknown>).originalMaterial = cloned
                  }
                }
              }
              if (config.sceneUrl.endsWith('contactContents.glb')) {
                if (['ContactContent1', 'ContactContent2', 'ContactContent3', 'ContactContent4'].includes(mesh.name)) {
                  contactContentMeshes.current.push(mesh);
                  const tex = textureLoader.load(`${BASE_URL}static/${mesh.name}.png`)
                  Object.assign(tex, config.textureSettings)
                  mesh.material = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
                  if (mesh.material?.clone) {
                    const cloned = mesh.material.clone()
                      ; (mesh.userData as Record<string, unknown>).originalMaterial = cloned
                  }
                }
              }
              if (config.sceneUrl.endsWith('buildings.glb')) {
                buildingsMeshes.current.push(mesh);
                if (mesh.material?.clone) {
                  const cloned = mesh.material.clone()
                    ; (mesh.userData as Record<string, unknown>).originalMaterial = cloned
                }
              }
              //Group island meshes
              if (config.sceneUrl.endsWith('islandHover.glb')) {
                if (['Workshop'].includes(mesh.name)) {
                  islandWorkshopMeshes.current.push(mesh);
                }
                if (['Tree'].includes(mesh.name)) {
                  islandTreeMeshes.current.push(mesh);
                }
                if (['Lighthouse'].includes(mesh.name)) {
                  islandContactMeshes.current.push(mesh);
                }
              }
            }
          })

          //hide tree contents by default 
          if (config.name === 'treeContents-scene') {
            gltf.visible = false
            gltf.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh && ['TreeContent1', 'TreeContent2', 'TreeContent3', 'TreeContent4', 'TreeHoverContent'].includes(child.name)) {
                child.visible = false
              }
            })
          }
          //hide blueprint contents by default
          if (config.name === 'blueprintContents-scene') {
            gltf.visible = true
            gltf.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh && ['BlueprintHoverContent'].includes(child.name)) {
                child.visible = false
              }
            })
          }
          //hide island hover contents by default
          if (config.name === 'island-hover') {
            gltf.visible = true
            gltf.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh && ['Workshop', 'Tree', 'Lighthouse'].includes(child.name)) {
                child.visible = false
              }
            })
          }
          //hide contact animation by default
          if (config.name === 'small-scene') {
            gltf.visible = true
            gltf.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh && child.name.includes('ContactMeText')) {
                child.visible = false
              }
            })
          }

          gltf.position.set(config.position.x, config.position.y, config.position.z)
          gltf.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z)
          gltf.scale.set(config.scale.x, config.scale.y, config.scale.z)

          results.push({ name: config.name, scene: gltf })
        } catch (e) {
          console.error('Failed to load scene config:', config.name, e)
        }
      }
      // After all scenes loaded, create scaled outline meshes for island groups
      try {
        const outlineMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(5, 5, 5),
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.7,
        })

        const outlinesGroup = new THREE.Group()
        function expandGeometry(geometry: THREE.BufferGeometry, expansionAmount = 0.1) {
          const expandedGeometry = geometry.clone()

          // Ensure we have normals
          expandedGeometry.computeVertexNormals()

          const positionAttribute = expandedGeometry.getAttribute('position')
          const normalAttribute = expandedGeometry.getAttribute('normal')
          const positions = positionAttribute.array as Float32Array
          const normals = normalAttribute.array as Float32Array

          // Expand each vertex along its normal
          for (let i = 0; i < positions.length; i += 3) {
            const normalX = normals[i]
            const normalY = normals[i + 1]
            const normalZ = normals[i + 2]

            positions[i] += normalX * expansionAmount
            positions[i + 1] += normalY * expansionAmount
            positions[i + 2] += normalZ * expansionAmount
          }

          // Update the position attribute
          positionAttribute.needsUpdate = true

          return expandedGeometry
        }

        // Create scaled outline meshes for workshop group
        if (islandWorkshopMeshes.current.length > 0) {
          const workshopGroup = new THREE.Group()
          for (const mesh of islandWorkshopMeshes.current) {
            const expandedGeometry = expandGeometry(mesh.geometry)
            const outlineMesh = new THREE.Mesh(expandedGeometry, outlineMaterial.clone())
            outlineMesh.material = outlineMaterial.clone()
            outlineMesh.visible = false
            outlineMesh.position.copy(mesh.position)
            outlineMesh.rotation.copy(mesh.rotation)
            workshopGroup.add(outlineMesh)
          }
          islandWorkshopOutline.current = workshopGroup
          outlinesGroup.add(workshopGroup)
        }

        if (islandTreeMeshes.current.length > 0) {
          const treeGroup = new THREE.Group()
          for (const mesh of islandTreeMeshes.current) {
            const expandedGeometry = expandGeometry(mesh.geometry)
            const outlineMesh = new THREE.Mesh(expandedGeometry, outlineMaterial.clone())
            outlineMesh.material = outlineMaterial.clone()
            outlineMesh.visible = false
            outlineMesh.position.copy(mesh.position)
            outlineMesh.rotation.copy(mesh.rotation)
            treeGroup.add(outlineMesh)
          }
          islandTreeOutline.current = treeGroup
          outlinesGroup.add(treeGroup)
        }

        if (islandContactMeshes.current.length > 0) {
          const contactGroup = new THREE.Group()
          for (const mesh of islandContactMeshes.current) {
            const expandedGeometry = expandGeometry(mesh.geometry)
            const outlineMesh = new THREE.Mesh(expandedGeometry, outlineMaterial.clone())
            outlineMesh.material = outlineMaterial.clone()
            outlineMesh.visible = false
            outlineMesh.position.copy(mesh.position)
            outlineMesh.rotation.copy(mesh.rotation)
            contactGroup.add(outlineMesh)
          }
          islandContactOutline.current = contactGroup
          outlinesGroup.add(contactGroup)
        }

        if (outlinesGroup.children.length > 0) {
          results.push({ name: 'island-outlines', scene: outlinesGroup })
        } else {
          console.error('No outline groups created')
        }
      } catch (err) {
        console.error('Failed to create island outlines', err)
      }

      if (!isCancelled) setLoadedScenes(results)
    }

    void loadAll()
    return () => { isCancelled = true }
  }, [
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
  ])

  return null
}

