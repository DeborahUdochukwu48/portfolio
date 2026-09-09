import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Dot = {
  x: number
  y: number
  r: number
  base: number
  twinkle: number
  phase: number
  vx: number
  vy: number
  tint: number
}

function seedDots(width: number, height: number): Dot[] {
  const count = Math.max(36, Math.round((width * height) / 3400))
  const dots: Dot[] = []
  for (let i = 0; i < count; i += 1) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.5 + Math.random() * 1.7,
      base: 0.12 + Math.random() * 0.42,
      twinkle: 0.04 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.04 - Math.random() * 0.12,
      tint: Math.random(),
    })
  }
  return dots
}

function paint(ctx: CanvasRenderingContext2D, dots: Dot[], time: number, animate: boolean) {
  const light = document.documentElement.dataset.theme === 'light'
  for (const dot of dots) {
    const pulse = animate ? Math.sin(time * 0.0012 + dot.phase) : 0
    const alpha = Math.min(0.7, Math.max(0.05, dot.base + pulse * dot.twinkle))
    ctx.beginPath()
    ctx.fillStyle = light
      ? dot.tint > 0.78
        ? `rgba(124, 58, 237, ${alpha * 0.45})`
        : `rgba(48, 38, 68, ${alpha * 0.38})`
      : dot.tint > 0.78
        ? `rgba(181, 135, 255, ${alpha * 0.9})`
        : `rgba(235, 235, 245, ${alpha})`
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function startStarfield(
  node: HTMLCanvasElement,
  host: HTMLElement,
  context: CanvasRenderingContext2D,
  animate: boolean,
) {
  let dots: Dot[] = []
  let width = 0
  let height = 0
  let frame = 0
  let elapsed = 0
  let visible = true

  function resize() {
    const rect = host.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    node.width = Math.round(width * dpr)
    node.height = Math.round(height * dpr)
    node.style.width = `${width}px`
    node.style.height = `${height}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    dots = seedDots(width, height)
    context.clearRect(0, 0, width, height)
    paint(context, dots, 0, false)
  }

  function tick(now: number) {
    if (!animate || !visible) return
    if (!elapsed) elapsed = now
    const dt = Math.min(32, now - elapsed)
    elapsed = now

    context.clearRect(0, 0, width, height)
    for (const dot of dots) {
      dot.x += dot.vx * (dt * 0.06)
      dot.y += dot.vy * (dt * 0.06)
      if (dot.x < -4) dot.x = width + 4
      if (dot.x > width + 4) dot.x = -4
      if (dot.y < -4) dot.y = height + 4
      if (dot.y > height + 4) dot.y = -4
    }
    paint(context, dots, now, true)
    frame = window.requestAnimationFrame(tick)
  }

  function start() {
    if (!animate || !visible) return
    window.cancelAnimationFrame(frame)
    elapsed = 0
    frame = window.requestAnimationFrame(tick)
  }

  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(host)

  const vis = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting)
    if (visible) start()
    else window.cancelAnimationFrame(frame)
  })
  vis.observe(host)

  const onHidden = () => {
    if (document.hidden) window.cancelAnimationFrame(frame)
    else start()
  }
  document.addEventListener('visibilitychange', onHidden)
  if (animate) start()

  const themeWatch = new MutationObserver(() => {
    context.clearRect(0, 0, width, height)
    paint(context, dots, performance.now(), animate)
  })
  themeWatch.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  return () => {
    observer.disconnect()
    vis.disconnect()
    themeWatch.disconnect()
    document.removeEventListener('visibilitychange', onHidden)
    window.cancelAnimationFrame(frame)
  }
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const node = canvasRef.current
    const host = node?.parentElement
    const context = node?.getContext('2d')
    if (!node || !host || !context) return
    return startStarfield(node, host, context, !reduce)
  }, [reduce])

  return <canvas className="starfield" ref={canvasRef} aria-hidden />
}
