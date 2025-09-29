import React from 'react'
import { Button } from './Button'

interface NavigationBarProps {
  onBackClick: () => void
  onCameraClick: (index: number) => void
  cameras: Array<{ name: string; index: number }>
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
      <Button onClick={onBackClick} size="large">
        Back
      </Button>
      {availableCameras.map(({ name, index }) => (
        <Button 
          key={index} 
          onClick={() => onCameraClick(index)} 
          size="large"
          variant="secondary"
        >
          {name}
        </Button>
      ))}
    </div>
  )
}
