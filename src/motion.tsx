import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
  amount?: number
}

export function Reveal({ children, className, delay = 0, amount = 0.18, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type CardProps = HTMLMotionProps<'article'> & {
  delay?: number
}

export function MotionCard({ children, className, delay = 0, ...rest }: CardProps) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : delay, ease }}
      whileHover={reduce ? undefined : { y: -6 }}
      {...rest}
    >
      {children}
    </motion.article>
  )
}
