import { Fragment, useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useScene } from '../three/SceneContext'

interface TreeOverlayContent {
  title: string
  description: string
  imageUrl?: string
  skills: string[]
}

const SKILLS_LIST = new Map<string, string>(
  [
    ['Python', '/static/icons/python.png'],
    ['TypeScript', '/static/icons/typescript.png'],
    ['React', '/static/icons/react.png'],
    ['AI', '/static/icons/science.png'],
    ['REST API', '/static/icons/api.png'],
    ['Next.js', '/static/icons/nextjs.png'],
  ]
)

const SKILL_POSITIONS: Record<number, { x: number; y: number }[]> = {
  4: [
    { x: -200, y: 0 },
    { x: -100, y: 45 },
    { x: 10, y: 55 },
    { x: 120, y: 40 }
  ],
  3: [
    { x: 220, y: 5 },
    { x: 99, y: 40 },
    { x: -10, y: 50 },
    { x: -110, y: 15 }
  ],
  2: [
    { x: -180, y: 15 },
    { x: -60, y: 30 },
    { x: 50, y: 40 },
    { x: 150, y: 20 }
  ],
  1: [
    { x: 135, y: 20 },
    { x: 30, y: 40 },
    { x: -80, y: 20 },
    { x: -190, y: 40 }
  ]
}

const DEFAULT_CONTENT: Record<number, TreeOverlayContent> = {
  4: {
    title: 'RTB House – TypeScript Developer',
    description: 'AI-focused data pipelines and REST APIs (Python & GCP). Built tracking scripts, crawlers, and reporting tools. Solved complex technical issues.',
    skills: [
      SKILLS_LIST.get('Python') ?? '',
      SKILLS_LIST.get('TypeScript') ?? '',
      SKILLS_LIST.get('AI') ?? '',
    ]
  },
  3: {
    title: 'Anfata Games – Full Stack Developer',
    description: 'Enhanced application performance and load times. Fixed critical bugs and improved overall code stability',
    skills: [
      SKILLS_LIST.get('Next.js') ?? '',
      SKILLS_LIST.get('TypeScript') ?? '',
      SKILLS_LIST.get('React') ?? '',
    ]
  },
  2: {
    title: 'CeboTech – Python Developer',
    description: 'Contributed to AI-driven applications. REST API design. Domain-driven architecture. Focused on clean design and scalable solutions.',
    skills: [
      SKILLS_LIST.get('Python') ?? '',
      SKILLS_LIST.get('AI') ?? '',
      SKILLS_LIST.get('REST API') ?? '',
    ]
  },
  1: {
    title: 'Storm Gray Unit – Junior Frontend Developer',
    description: 'Developed React-based admin dashboards for IoT management. Collaborated on REST API design to ensure seamless data flow.',
    skills: [
      SKILLS_LIST.get('React') ?? '',
      SKILLS_LIST.get('REST API') ?? '',
    ]
  }
}

export function TreeContentOverlays({
  contents = DEFAULT_CONTENT,
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

  // Get fixed positions for skills
  const skillPositions = useMemo(() => {
    if (currentVisibleTreeContent && SKILL_POSITIONS[currentVisibleTreeContent]) {
      return SKILL_POSITIONS[currentVisibleTreeContent]
    }
    return []
  }, [currentVisibleTreeContent])

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
                background: 'rgba(0, 0, 0, 0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.7)',
                borderRadius: '12px',
                padding: '12px 14px',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                maxWidth: '320px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
                  {content.title}
                </div>
                <ul style={{ textAlign: 'left', marginBottom: 0 }}>
                  {content.description.split('. ').map(item => {
                    return (
                      <li style={{ fontSize: 18, opacity: 0.9, listStyleType: 'disc', marginBottom: 4 }} >{item}</li>
                    )
                  })}
                </ul>
              </div>
            </div>
            {/* Skills with fixed positioning and curved lines */}
            <div style={{ position: 'relative', width: '100%', height: '160px', marginTop: '10px' }}>
              {/* SVG for curved lines */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              >
                {content.skills.map((_, index) => {
                  if (skillPositions.length <= index) return null
                  const skillPos = skillPositions[index]
                  const startX = 160 // Center of the main content
                  const startY = 0
                  const endX = skillPos.x + 160
                  const endY = skillPos.y + 41 // Half of skill image height

                  // Create a curved path
                  const controlX = (startX + endX) / 2
                  const controlY = Math.min(startY, endY) - 30 // Curve upward

                  const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`

                  return (
                    <path
                      key={`line-${index}`}
                      d={pathData}
                      stroke="rgba(255, 255, 255, 0.6)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  )
                })}
              </svg>

              {/* Skills positioned randomly */}
              {content.skills.map((skillUrl, index) => {
                if (skillPositions.length <= index) return null
                const skillPos = skillPositions[index]

                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `${skillPos.x + 160 - 41}px`, // Center the image
                      top: `${skillPos.y}px`,
                      zIndex: 2,
                      background: 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <img
                      src={skillUrl}
                      alt={`Skill ${index + 1}`}
                      style={{
                        width: 82,
                        height: 82,
                        borderRadius: 8,
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </Html>
        </group>
      </group>
    </Fragment >
  )
}

export default TreeContentOverlays


