import { Fragment, useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useScene } from '../three/SceneContext'

type TreeOverlayContent = {
  title: string
  description: string
  imageUrl?: string
}

const DEFAULT_CONTENT: Record<number, TreeOverlayContent> = {
  1: { title: 'Topic One', description: 'Short description for item one.' },
  2: { title: 'Topic Two', description: 'Short description for item two.' },
  3: { title: 'Topic Three', description: 'Short description for item three.' },
  4: { title: 'Topic Four', description: 'Short description for item four.' }
}

export function TreeContentOverlays({
  contents = DEFAULT_CONTENT
}: {
  contents?: Record<number, TreeOverlayContent>
}) {
  const { loadedScenes, treeContentsVisible, currentVisibleTreeContent } = useScene()

  const treeScene = useMemo(() => loadedScenes.find((s) => s.name === 'treeContents-scene')?.scene, [loadedScenes])

  const positions = useMemo(() => new Map<number, THREE.Vector3>(), [])
  const quaternions = useMemo(() => new Map<number, THREE.Quaternion>(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const quat = useMemo(() => new THREE.Quaternion(), [])
  const forward = useMemo(() => new THREE.Vector3(0, 0, 1), [])

  useFrame(() => {
    if (!treeScene) return
    for (let i = 1; i <= 4; i++) {
      const obj = treeScene.getObjectByName(`TreeContent${i}`)
      if (obj) {
        obj.getWorldPosition(target)
        positions.set(i, target.clone())
        obj.getWorldQuaternion(quat)
        quaternions.set(i, quat.clone())
      }
    }
  })

  if (!treeScene || !treeContentsVisible || !currentVisibleTreeContent) return null

  const index = currentVisibleTreeContent
  const pos = positions.get(index)
  const q = quaternions.get(index)
  const content = contents[index]

  if (!pos || !q || !content) return null

  // Offset slightly along the object's forward to avoid coincident plane
  const offsetDir = forward.clone().applyQuaternion(q)
  const anchoredPos = pos.clone().addScaledVector(offsetDir, 0.06)

  return (
    <Fragment>
      <group position={[anchoredPos.x, anchoredPos.y, anchoredPos.z]} quaternion={q}>
        {/* Corrective rotation so the HTML plane faces outward rather than edge-on */}
        <group rotation={[Math.PI / 2, -Math.PI, -Math.PI / 2]}>
          <Html
            transform
            position={[0, 0, 0]}
            distanceFactor={6}
            sprite={false}
            center
            style={{ pointerEvents: 'none' }}
          >
          <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.55)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: '12px',
            padding: '12px 14px',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            maxWidth: '320px'
          }}
        >
          {content.imageUrl ? (
            <img
              src={content.imageUrl}
              alt={content.title}
              style={{
                width: 72,
                height: 72,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.6)'
              }}
            />
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{content.title}</div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>{content.description}</div>
          </div>
          </div>
          </Html>
        </group>
      </group>
    </Fragment>
  )
}

export default TreeContentOverlays


