import { Fragment, useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useScene } from '../three/SceneContext'

interface WorkshopContent {
    title: string
    description: string
    link?: string
    technologies: string[]
}

const WORKSHOP_CONTENT: Record<string, WorkshopContent> = {
    BlueprintContent1: {
        title: 'Project 1',
        description: 'Coming soon - exciting project in development',
        technologies: []
    },
    BlueprintContent2: {
        title: 'Pixel Art Editor',
        description: 'A web-based pixel art creation tool with many available tools',
        technologies: ['TypeScript', 'React', 'Canvas API']
    },
    BlueprintContent3: {
        title: 'Telecom Website',
        description: 'Website for telecommunications company with modern design and responsive layout',
        technologies: ['Next.js', 'Tailwind CSS', 'TypeScript']
    },
    BlueprintContent4: {
        title: 'Chess Game',
        description: 'Interactive chess game built with vanilla JavaScript',
        technologies: ['JavaScript', 'HTML', 'CSS']
    }
}

export function WorkshopTooltip() {
    const {
        // workshopContentMeshes, // unused
        loadedScenes,
        currentCameraIndex,
        hoveredWorkshopContent
    } = useScene()

    const workshopScene = useMemo(() =>
        loadedScenes.find((s) => s.name === 'blueprintContents-scene')?.scene,
        [loadedScenes]
    )

    const positions = useMemo(() => new Map<string, THREE.Vector3>(), [])
    const quaternions = useMemo(() => new Map<string, THREE.Quaternion>(), [])
    const target = useMemo(() => new THREE.Vector3(), [])
    const quat = useMemo(() => new THREE.Quaternion(), [])
    const offsetDir = useMemo(() => new THREE.Vector3(0, 1, 0), [])

    useFrame(() => {
        if (!workshopScene) return

        // Update positions for all workshop content objects
        Object.keys(WORKSHOP_CONTENT).forEach(objectName => {
            const obj = workshopScene.getObjectByName(objectName)
            if (obj) {
                obj.getWorldPosition(target)
                positions.set(objectName, target.clone())
                obj.getWorldQuaternion(quat)
                quaternions.set(objectName, quat.clone())
            }
        })
    })

    // Only show tooltip when in workshop camera (index 0) and hovering over content
    if (currentCameraIndex !== 0 || !hoveredWorkshopContent || !workshopScene) return null

    const pos = positions.get(hoveredWorkshopContent)
    const q = quaternions.get(hoveredWorkshopContent)
    const content = WORKSHOP_CONTENT[hoveredWorkshopContent]

    if (!pos || !q || !content) return null

    // Offset slightly above the object
    const anchoredPos = pos.clone().addScaledVector(offsetDir, 0.2)

    return (
        <Fragment>
            <group position={[anchoredPos.x, anchoredPos.y, anchoredPos.z]} quaternion={q}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    <Html
                        transform
                        position={[0, 0.05, 0]}
                        distanceFactor={1}
                        sprite={false}
                        center
                        style={{ pointerEvents: 'none' }}
                    >
                        <div
                            style={{
                                alignItems: 'center',
                                background: 'rgba(0, 0, 0, 0.4)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.7)',
                                borderRadius: '12px',
                                padding: '6px 12px',
                                backdropFilter: 'blur(6px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                                maxWidth: '320px'
                            }}
                        >
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                            }}>
                                {content.title}
                            </div>
                        </div>
                    </Html>
                </group>
            </group>
        </Fragment>
    )
}
