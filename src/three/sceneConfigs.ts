import * as THREE from 'three'

export interface SceneConfig {
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
  },
  {
    name: 'island-hover',
    sceneUrl: '/static/island-hover.glb',
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
    name: 'nav-island',
    sceneUrl: '/static/navIsland.glb',
    textureUrl: '/static/navIsland.png',
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
export const CONTACT_LINKS = {
  ContactContent1: 'https://github.com/Pawel-Matuszak',
  ContactContent2: 'https://www.linkedin.com/in/pawe%C5%82-matuszak-404a5523b/',
  ContactContent3: 'https://x.com/',
  ContactContent4: 'mailto:pawel.matuszak2@icloud.com',
}
export const BLUEPRINT_LINKS = {
  // BlueprintContent1: 'https://example.com/project-1',
  BlueprintContent2: 'https://pixel-art-editor-xi.vercel.app/',
  BlueprintContent4: 'https://pawel-matuszak.github.io/chess-js/',
  BlueprintContent3: 'https://www.a-tel.com.pl/',
}
