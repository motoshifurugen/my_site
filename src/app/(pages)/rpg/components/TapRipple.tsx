'use client'

import { useCallback, useEffect, useState } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
}

interface TapRippleProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

const TapRipple = ({ containerRef }: TapRippleProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const addRipple = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])
    },
    [containerRef],
  )

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        addRipple(touch.clientX, touch.clientY)
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (e.detail > 0) {
        addRipple(e.clientX, e.clientY)
      }
    }

    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    })
    container.addEventListener('click', handleClick)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('click', handleClick)
    }
  }, [containerRef, addRipple])

  return (
    <div className="pointer-events-none absolute inset-0 z-[100] overflow-hidden">
      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </div>
  )
}

interface RippleEffectProps {
  x: number
  y: number
  onComplete: () => void
}

const RippleEffect = ({ x, y, onComplete }: RippleEffectProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer ring */}
      <div
        className="absolute rounded-full border-2 border-white/40"
        style={{
          width: 0,
          height: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ripple-expand 0.5s ease-out forwards',
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute rounded-full border border-white/30"
        style={{
          width: 0,
          height: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ripple-expand 0.5s ease-out 0.05s forwards',
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute rounded-full border border-white/20"
        style={{
          width: 0,
          height: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ripple-expand 0.5s ease-out 0.1s forwards',
        }}
      />
      {/* Center dot */}
      <div
        className="absolute rounded-full border-2 border-white/50"
        style={{
          width: 16,
          height: 16,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ripple-fade 0.3s ease-out forwards',
        }}
      />
    </div>
  )
}

export default TapRipple
