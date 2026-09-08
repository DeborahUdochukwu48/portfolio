import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const SEGMENTS = [
  { d: 'M125 8 L125 48', delay: 0 },
  { d: 'M375 8 L375 48', delay: 0.12 },
  { d: 'M625 8 L625 48', delay: 0.24 },
  { d: 'M875 8 L875 48', delay: 0.36 },
  { d: 'M125 48 L875 48', delay: 0.5 },
  { d: 'M500 48 L500 112', delay: 0.68 },
]

const OUT_SEGMENTS = [
  { d: 'M500 8 L500 40', delay: 1.05 },
  { d: 'M250 40 L750 40', delay: 1.18 },
  { d: 'M250 40 L250 88', delay: 1.32 },
  { d: 'M750 40 L750 88', delay: 1.32 },
]

const chipHover = {
  scale: 1.03,
  boxShadow: '0 0 28px rgba(168, 85, 247, 0.35)',
}

function DrawnPaths({
  segments,
  className,
  viewBox,
}: {
  segments: { d: string; delay: number }[]
  className: string
  viewBox: string
}) {
  const reduce = useReducedMotion()

  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden>
      {segments.map((segment) => (
        <motion.path
          key={segment.d}
          d={segment.d}
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.75"
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeDasharray="7 8"
          initial={reduce ? false : { pathLength: 0, opacity: 0, strokeDashoffset: 0 }}
          whileInView={{ pathLength: 1, opacity: 1, strokeDashoffset: -56 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  pathLength: { duration: 0.5, delay: segment.delay, ease: 'easeInOut' },
                  opacity: { duration: 0.3, delay: segment.delay },
                  strokeDashoffset: {
                    duration: 1.35,
                    delay: segment.delay + 0.5,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }
          }
        />
      ))}
    </svg>
  )
}

export function SynergyMap() {
  const reduce = useReducedMotion()

  return (
    <div className="flow-card synergy">
      <div className="flow-inputs">
        {['Strategy', 'Research', 'UX & design', 'Execution'].map((label, index) => (
          <motion.div
            key={label}
            className="flow-chip"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08, ease }}
            whileHover={reduce ? undefined : chipHover}
          >
            {label}
          </motion.div>
        ))}
      </div>

      <DrawnPaths className="flow-lines" viewBox="0 0 1000 112" segments={SEGMENTS} />

      <motion.div
        className="flow-hub"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: reduce ? 0 : 0.85, ease }}
        whileHover={
          reduce
            ? undefined
            : { scale: 1.03, boxShadow: '0 12px 48px rgba(168, 85, 247, 0.55)' }
        }
      >
        <strong>Human-centered strategy</strong>
        <span>Owned end to end, across teams</span>
      </motion.div>

      <DrawnPaths className="flow-lines short" viewBox="0 0 1000 88" segments={OUT_SEGMENTS} />

      <div className="flow-outputs">
        <motion.div
          className="flow-chip tall"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: reduce ? 0 : 1.4, ease }}
          whileHover={reduce ? undefined : chipHover}
        >
          <b>Business growth</b>
          <span>Conversion &amp; retention</span>
        </motion.div>
        <motion.div
          className="flow-chip tall"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: reduce ? 0 : 1.5, ease }}
          whileHover={reduce ? undefined : chipHover}
        >
          <b>Intuitive experience</b>
          <span>Simple, human, intuitive</span>
        </motion.div>
      </div>
    </div>
  )
}
