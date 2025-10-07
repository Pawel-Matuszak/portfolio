import React from 'react'

interface CameraOption {
  name: string
  index: number
}

interface CameraGridProps {
  cameras: CameraOption[]
  onCameraSelect: (index: number) => void
  onHoverStart?: (index: number) => void
  onHoverEnd?: () => void
  style?: React.CSSProperties
  className?: string
}

export function CameraGrid({
  cameras,
  onCameraSelect,
  onHoverStart,
  onHoverEnd,
  style = {},
  className = ''
}: CameraGridProps) {
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    width: '100%',
    height: '100%',
    ...style
  }

  const cellStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  return (
    <div className={className} style={gridStyles}>
      {cameras.map(({ name, index }) => (
        <div
          key={index}
          style={cellStyles}
          onMouseEnter={() => {
            // e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
            onHoverStart?.(index)
          }}
          onMouseLeave={() => {
            // e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
            onHoverEnd?.()
          }}
          onClick={() => {
            onCameraSelect(index)
            onHoverEnd?.()
          }}
        >
          <div style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#f4f4f4',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
          }}>
            {/* {name} */}
          </div>
        </div>
      ))}
    </div>
  )
}
