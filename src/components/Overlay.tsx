import React from 'react'

interface OverlayProps {
  children: React.ReactNode
  visible: boolean
  style?: React.CSSProperties
  className?: string
}

export function Overlay({ 
  children, 
  visible, 
  style = {}, 
  className = '' 
}: OverlayProps) {
  if (!visible) return null

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 1000,
    userSelect: 'none',
    ...style
  }

  return (
    <div className={className} style={overlayStyles}>
      {children}
    </div>
  )
}
