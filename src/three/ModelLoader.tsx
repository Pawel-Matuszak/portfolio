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
  const { setLoadedScenes, greenSceneMeshes, treeContentMeshes, workshopContentMeshes, contactContentMeshes } = useScene()

  // GLTFs are loaded per-scene below with DRACO configured on each loader instance

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
              (e) => reject(e)
            )
          })

          gltf.traverse((child: THREE.Object3D) => {
            if ((child as any).isMesh) {
              const mesh = child as THREE.Mesh
              mesh.material = material
              if (config.sceneUrl.endsWith('green.glb')) {
                if (['leaves1', 'leaves2', 'leaves3', 'leaves4'].includes(mesh.name)) {
                  greenSceneMeshes.current.push(mesh)
                  ;(mesh.userData as any).originalMaterial = (material as THREE.Material).clone()
                }
              }
              if (config.sceneUrl.endsWith('treeContents.glb')) {
                if (['TreeContent1', 'TreeContent2', 'TreeContent3', 'TreeContent4'].includes(mesh.name)) {
                  treeContentMeshes.current.push(mesh)
                  ;(mesh.userData as any).originalMaterial = (material as THREE.Material).clone()
                  // Make plane invisible but raycastable so we can anchor HTML without seeing the square
                  const invisible = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
                  ;(invisible as any).depthWrite = false
                  mesh.material = invisible
                }
              }
              if (config.sceneUrl.endsWith('blueprintContents.glb')) {
                if (['BlueprintContent1', 'BlueprintContent2', 'BlueprintContent3', 'BlueprintContent4'].includes(mesh.name)) {
                  workshopContentMeshes.current.push(mesh);
                  const tex = textureLoader.load(`/static/${mesh.name}.png`)
                  Object.assign(tex, config.textureSettings)
                  mesh.material = new THREE.MeshBasicMaterial({ map: tex });
                  (mesh.userData as any).originalMaterial = (mesh.material as THREE.Material).clone()
                }
              }
              if(config.sceneUrl.endsWith('contactContents.glb')) {
                if (['ContactContent1', 'ContactContent2', 'ContactContent3', 'ContactContent4'].includes(mesh.name)) {
                  contactContentMeshes.current.push(mesh);
                  const tex = textureLoader.load(`/static/${mesh.name}.png`)
                  Object.assign(tex, config.textureSettings)
                  mesh.material = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
                  (mesh.userData as any).originalMaterial = (mesh.material as THREE.Material).clone()
                }
              }
            }
          })

          //hide tree contents by default 
          //set to true to show tree contents in testing
          //TODO change to false for production
          if (config.name === 'treeContents-scene') {
            gltf.visible = true
            gltf.traverse((child: THREE.Object3D) => {
              if ((child as any).isMesh && ['TreeContent1', 'TreeContent2', 'TreeContent3', 'TreeContent4'].includes(child.name)) {
                child.visible = true
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
      if (!isCancelled) setLoadedScenes(results)
    }

    loadAll()
    return () => { isCancelled = true }
  }, [setLoadedScenes, greenSceneMeshes, treeContentMeshes, workshopContentMeshes, contactContentMeshes])

  return null
}

