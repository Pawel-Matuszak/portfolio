import React from 'react'

interface NavigationBarProps {
  onBackClick: () => void
  onCameraClick: (index: number) => void
  cameras: { name: string; index: number }[]
  currentCameraIndex: number
  style?: React.CSSProperties
  className?: string
}

export function NavigationBar({
  onBackClick,
  onCameraClick,
  cameras,
  currentCameraIndex,
  style = {},
  className = ''
}: NavigationBarProps) {
  const availableCameras = cameras.filter(({ index }) => index !== currentCameraIndex)

  return (
    <div className={className} style={{
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '12px',
      ...style
    }}>
      {/* Back button */}
      <button
        onClick={onBackClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 24px',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '22px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <span style={{ fontSize: '24px', lineHeight: 1 }}>←</span>
        Back
      </button>

      {/* Separator */}
      <div style={{
        width: '1px',
        height: '28px',
        background: 'rgba(255, 255, 255, 0.2)',
      }} />

      {/* Navigation options */}
      {availableCameras.map(({ name, index }) => (
        <button
          key={index}
          onClick={() => onCameraClick(index)}
          style={{
            padding: '14px 28px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '22px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
