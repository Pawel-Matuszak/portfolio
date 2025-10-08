import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  style = {},
  className = ''
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    fontSize: size === 'large' ? '32px' : size === 'medium' ? '24px' : '16px',
    fontWeight: '600',
    color: '#f4f4f4',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: size === 'large' ? '12px 24px' : size === 'medium' ? '8px 16px' : '4px 8px',
    ...style
  }

  const variantStyles: Record<'primary' | 'secondary', React.CSSProperties> = {
    primary: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    secondary: {
      backgroundColor: 'transparent',
    }
  }

  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
