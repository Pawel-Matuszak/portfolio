import * as THREE from 'three'

export type SceneConfig = {
  name: string
  sceneUrl: string
  textureUrl?: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  textureSettings: Partial<{
    flipY: boolean
    colorSpace: THREE.ColorSpace
    minFilter: THREE.TextureFilter
    magFilter: THREE.TextureFilter
    wrapS: THREE.Wrapping
    wrapT: THREE.Wrapping
  }>
}

// Assets are expected under public/static/
export const sceneConfigs: SceneConfig[] = [
  {
    name: 'islands-scene',
    sceneUrl: '/static/islands.glb',
    textureUrl: '/static/islands.png',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    }
  },
  {
    name: 'buildings-scene',
    sceneUrl: '/static/buildings.glb',
    textureUrl: '/static/buildings.png',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  },
  {
    name: 'bushRocks-scene',
    sceneUrl: '/static/green.glb',
    textureUrl: '/static/green.png',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  },
  {
    name: 'small-scene',
    sceneUrl: '/static/small.glb',
    textureUrl: '/static/small.png',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  },
  {
    name: 'water-scene',
    sceneUrl: '/static/water.glb',
    textureUrl: '/static/water.png',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  },
  {
    name: 'contactContents-scene',
    sceneUrl: '/static/contactContents.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  },
  {
    name: 'blueprintContents-scene',
    sceneUrl: '/static/blueprintContents.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  },
  {
    name: 'treeContents-scene',
    sceneUrl: '/static/treeContents.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    textureSettings: {
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  }
]

export const CAMERAS_GLTF_URL = '/static/cameras.glb'
export const DRACO_DECODER_PATH = '/static/draco/'

