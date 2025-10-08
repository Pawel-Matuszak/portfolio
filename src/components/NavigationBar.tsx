import React from 'react'
import { Button } from './Button'

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
  const navStyles: React.CSSProperties = {
    position: 'fixed',
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    ...style
  }

  const availableCameras = cameras.filter(({ index }) => index !== currentCameraIndex)

  return (
    <div className={className} style={navStyles}>
      <Button onClick={onBackClick} size="large" variant="secondary">
        Back
      </Button>
      <Button
        key={availableCameras[0].index}
        onClick={() => onCameraClick(availableCameras[0].index)}
        size="large"
        variant="secondary"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >
        {availableCameras[0].name}
      </Button>
      <Button
        key={availableCameras[availableCameras.length - 1].index}
        onClick={() => onCameraClick(availableCameras[availableCameras.length - 1].index)}
        size="large"
        variant="secondary"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >
        {availableCameras[availableCameras.length - 1].name}
      </Button>
    </div >
  )
}
