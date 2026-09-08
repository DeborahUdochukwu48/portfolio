import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

function canUseCustomCursor() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(pointer: coarse)').matches) return false
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false
  if (navigator.maxTouchPoints > 0) return false
  return true
}

export function CursorFollower() {
  const reduce = useReducedMotion()
  const enabled = !reduce && canUseCustomCursor()
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const trailSpring = { stiffness: 140, damping: 22, mass: 0.55 }
  const trailX = useSpring(mouseX, trailSpring)
  const trailY = useSpring(mouseY, trailSpring)

  useEffect(() => {
    if (!enabled) return

    function move(event: PointerEvent) {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setVisible(true)
    }

    function leave() {
      setVisible(false)
    }

    function over(event: PointerEvent) {
      const target = event.target as HTMLElement | null
      setHovering(Boolean(target?.closest('a, button, .work-card, .comp-card, .quote-card, .gallery figure')))
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', leave)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled) return null

  return (
    <div className="cursor-layer" aria-hidden>
      <motion.div
        className="cursor-glow"
        style={{ x: trailX, y: trailY }}
        animate={{ opacity: visible ? (hovering ? 0.9 : 0.7) : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 28 }}
      />
    </div>
  )
}
