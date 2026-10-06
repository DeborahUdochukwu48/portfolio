import { type ReactNode, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CursorFollower } from './CursorFollower'
import { Starfield } from './Starfield'
import {
  ArrowOut,
  BrandMark,
  ChevronDown,
  ChevronUp,
  CompetencyIcon,
  MouseIcon,
  PinIcon,
  SunIcon,
  MoonIcon,
} from './icons'
import { MotionCard, Reveal } from './motion'
import { SynergyMap } from './SynergyMap'
import {
  COMMUNITY,
  COMPETENCIES,
  EDUCATION,
  EXPERIENCE,
  GALLERY,
  LINKS,
  TESTIMONIALS,
} from './content'

const ease = [0.22, 1, 0.36, 1] as const

type Theme = 'dark' | 'light'

function readTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme: Theme) {
  if (theme === 'light') document.documentElement.dataset.theme = 'light'
  else delete document.documentElement.dataset.theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f4f2f8' : '#000000')
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* ignore */
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === 'undefined' ? 'dark' : readTheme(),
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'light'}
      onClick={() => setTheme(next)}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function HoverLink({
  href,
  children,
  className,
  target,
  rel,
  download,
  onClick,
}: {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  download?: boolean | string
  onClick?: () => void
}) {
  const reduce = useReducedMotion()
  return (
    <motion.a
      href={href}
      className={className}
      target={target}
      rel={rel}
      download={download}
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -1 }}
      transition={{ duration: 0.2, ease }}
    >
      {children}
    </motion.a>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    const desktop = window.matchMedia('(min-width: 801px)')
    function onViewport() {
      if (desktop.matches) setOpen(false)
    }

    function onMenuClick(event: Event) {
      const node = event.target
      const el = node instanceof Element ? node : (node as Node).parentElement
      if (el?.closest('a')) setOpen(false)
    }

    function onScroll() {
      setScrolled(window.scrollY > 8)
    }

    onScroll()
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    desktop.addEventListener('change', onViewport)
    const menu = menuRef.current
    menu?.addEventListener('click', onMenuClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      desktop.removeEventListener('change', onViewport)
      menu?.removeEventListener('click', onMenuClick)
    }
  }, [])

  return (
    <header className={scrolled ? 'nav is-scrolled' : 'nav'}>
      <div className="nav-bar">
      <a className="brand" href="#hero" onClick={() => setOpen(false)}>
        <BrandMark />
        Deborah
      </a>
      <nav
        ref={menuRef}
        id="primary-nav"
        className={open ? 'nav-links is-open' : 'nav-links'}
        aria-label="Primary"
      >
        <HoverLink href="#projects" onClick={() => setOpen(false)}>
          Work
        </HoverLink>
        <HoverLink href="#about" onClick={() => setOpen(false)}>
          About me
        </HoverLink>
        <HoverLink
          href={LINKS.linkedin}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          LinkedIn
        </HoverLink>
        <HoverLink
          href={LINKS.github}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          GitHub
        </HoverLink>
        <HoverLink
          href={LINKS.cv}
          download="CV_Deborah_Amajuoyi_Product_Manager.pdf"
          onClick={() => setOpen(false)}
        >
          CV
        </HoverLink>
      </nav>
      <div className="nav-tools">
        <ThemeToggle />
        <button
          type="button"
          className={open ? 'nav-toggle is-open' : 'nav-toggle'}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      </div>
    </header>
  )
}

const HERO_ROTATING = ['Thinks in System', 'Ships', 'Builds'] as const

function HeroTitle() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(HERO_ROTATING.length - 1)

  useEffect(() => {
    if (reduce) {
      setActive(HERO_ROTATING.length - 1)
      return
    }
    setActive(0)
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % HERO_ROTATING.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [reduce])

  const enter = reduce
    ? undefined
    : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.h1
      aria-label="Senior Product Manager who Thinks in System, Ships, Builds."
      initial={enter ? 'hidden' : false}
      animate="show"
      variants={enter}
      transition={{ duration: 0.6, delay: 0.08, ease }}
    >
      <span className="hero-title-line">Senior Product Manager</span>
      <span className="hero-title-line">
        who{' '}
        <span className="hero-rotator" aria-live="polite">
          {HERO_ROTATING.map((phrase, index) => (
            <motion.span
              key={phrase}
              className="hero-rotator-item"
              aria-hidden={index !== active}
              initial={false}
              animate={{
                opacity: index === active ? 1 : 0,
                y: reduce || index === active ? 0 : 18,
              }}
              transition={{ duration: reduce ? 0 : 0.45, ease }}
            >
              {phrase}.
            </motion.span>
          ))}
        </span>
      </span>
    </motion.h1>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const enter = reduce
    ? undefined
    : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <section className="hero" id="hero">
      <Starfield />
      <div className="hero-glow" />
      <div className="hero-inner">
      <motion.div
        className="identity"
        initial={enter ? 'hidden' : false}
        animate="show"
        variants={enter}
        transition={{ duration: 0.5, ease }}
      >
        <img src="/images/logo-d.png" alt="" />
        <span>Amajuoyi Udochukwu Deborah</span>
      </motion.div>
      <HeroTitle />
      <motion.p
        className="lede"
        initial={enter ? 'hidden' : false}
        animate="show"
        variants={enter}
        transition={{ duration: 0.55, delay: 0.16, ease }}
      >
        Hi, I&apos;m Deborah, a senior product manager with a strong design background. I set the
        product strategy, shape the experience, and take it from first sketch to shipped product.
      </motion.p>
      <motion.div
        className="hero-actions"
        initial={enter ? 'hidden' : false}
        animate="show"
        variants={enter}
        transition={{ duration: 0.5, delay: 0.24, ease }}
      >
        <motion.a
          className="btn-glow"
          href="#projects"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          See what I&apos;ve built
        </motion.a>
        <motion.a
          className="btn-ghost"
          href={LINKS.email}
          whileHover={reduce ? undefined : { scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          Contact Deborah
        </motion.a>
      </motion.div>

      <Reveal className="stats-card" delay={0.12}>
        <div className="stats-row">
          <div className="stat-cell">
            <strong>5+</strong>
            <span>
              Large-scale apps
              <br />
              taken to market
            </span>
          </div>
          <div className="stat-cell">
            <strong>4</strong>
            <span>
              Product models: B2C, B2B,
              <br />
              D2C &amp; platform
            </span>
          </div>
          <div className="stat-cell">
            <strong>AI</strong>
            <span>
              Tools I design, build,
              <br />
              and ship myself
            </span>
          </div>
          <div className="stat-cell">
            <strong>MSc</strong>
            <span>
              Information Technology,
              <br />
              AIU
            </span>
          </div>
        </div>
        <hr className="stats-divider" />
        <p className="companies-label">Shipped for</p>
        <div className="logo-row">
          <img src="/images/logo-vw.png" alt="Volkswagen" />
          <img src="/images/logo-seat.png" alt="SEAT" />
          <img src="/images/logo-cupra.png" alt="CUPRA" />
          <img src="/images/logo-skoda.png" alt="Škoda" />
          <span className="plus" aria-hidden>
            +
          </span>
        </div>
      </Reveal>

      <div className="scroll-row">
        <span>Scroll down</span>
        <span className="scroll-line" />
        <MouseIcon />
        <span className="scroll-line" />
        <span>to see projects</span>
      </div>
      </div>
    </section>
  )
}

function Strategy() {
  return (
    <section className="section strategy-section">
      <div className="section-split">
        <Reveal>
          <h2>How I Work: From Problem to Shipped Product</h2>
          <p>
            I&apos;m a senior product manager with a strong design background, and it shapes how I
            work. I start with the user&apos;s problem, prototype early in Figma or with AI-assisted
            tools, and test before anything gets expensive to build.
          </p>
          <p>
            After leading product design across four VW Group brands, I now own the path from first
            sketch to shipped product, including tools I build myself with AI.
          </p>
        </Reveal>
      </div>

      <Reveal className="flow-wrap" delay={0.08}>
        <SynergyMap />
      </Reveal>
    </section>
  )
}

function Competencies() {
  return (
    <section className="section">
      <Reveal>
        <h2>Core Competencies</h2>
      </Reveal>
      <div className="comp-grid">
        {COMPETENCIES.map((item, index) => (
          <MotionCard key={item.title} className="comp-card" delay={index * 0.06}>
            <h3>{item.title}</h3>
            <CompetencyIcon name={item.icon} />
            <p>{item.body}</p>
          </MotionCard>
        ))}
      </div>
    </section>
  )
}

function PhoneFrame({
  src,
  alt,
  video = false,
}: {
  src: string
  alt: string
  video?: boolean
}) {
  return (
    <div className="phone-frame">
      {video ? (
          <video src={src} autoPlay muted loop playsInline aria-label={alt} />
        ) : (
          <img src={src} alt={alt} />
        )}
    </div>
  )
}

function Works() {
  const reduce = useReducedMotion()
  return (
    <section className="section" id="projects">
      <Reveal>
        <h2>Selected Works</h2>
      </Reveal>

      <MotionCard className="work-card">
        <div className="work-copy">
          <p className="work-brand">
            <img src="/images/logo-notes.svg" alt="" />
            Apple Notes (Personal Project)
          </p>
          <h3>Apple Notes Transcriber</h3>
          <p>
            Apple Notes can transcribe live recordings, but not audio you already have. I built a
            macOS command-line tool that takes an existing .m4a or .mp3, transcribes it with OpenAI
            Whisper, and drops the transcript into a new note, optionally in a folder you name.
            Built with Swift, Cursor, OpenAI Whisper API, and AppleScript.
          </p>
          <p className="impact-label">Impact</p>
          <ul>
            <li>
              Spotted a real product gap: no way to import and transcribe existing audio in Apple
              Notes.
            </li>
            <li>Chose to ship a working prototype instead of stopping at a mockup.</li>
            <li>One command turns a standalone audio file into a searchable, organized note.</li>
          </ul>
          <div className="work-actions">
            <motion.a
              className="btn-glow"
              href={LINKS.transcribeCase}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.04 }}
            >
              View Case Study <ArrowOut />
            </motion.a>
            <motion.a
              className="btn-ghost"
              href={LINKS.transcribe}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.04 }}
            >
              View on GitHub <ArrowOut />
            </motion.a>
          </div>
        </div>
        <div className="work-media purple">
          <div className="phones single">
            <PhoneFrame
              src="/images/work-transcribe.mp4"
              alt="Apple Notes Transcriber turning an audio file into a note"
              video
            />
          </div>
        </div>
      </MotionCard>

      <MotionCard className="work-card" delay={0.06}>
        <div className="work-copy">
          <p className="work-brand">
            <img src="/images/logo-vw.png" alt="" />
            Volkswagen AG
          </p>
          <h3>Vehicle Activation Service</h3>
          <p>
            Led design and delivery of the core enrollment experience across four VW Group brands,
            simplifying vehicle onboarding and digital feature activation for primary and guest
            users.
          </p>
          <p className="impact-label">Impact</p>
          <ul>
            <li>Significantly reduced time-to-value during initial vehicle activation.</li>
            <li>Meaningfully decreased onboarding drop-off by simplifying the activation path.</li>
            <li>Scaled across millions of model year 2020+ vehicles nationwide.</li>
          </ul>
          <motion.a
            className="btn-ghost"
            href={LINKS.vwLive}
            target="_blank"
            rel="noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04 }}
          >
            View Live <ArrowOut />
          </motion.a>
        </div>
        <div className="work-media">
          <div className="phones single pair">
            <PhoneFrame src="/images/work-vw.png" alt="VW Connect services and security PIN screens" />
          </div>
        </div>
      </MotionCard>

      <MotionCard className="work-card" delay={0.08}>
        <div className="work-copy">
          <p className="work-brand">
            <img src="/images/logo-skoda.png" alt="" />
            My Škoda
          </p>
          <h3>Vehicle Onboarding &amp; User Activation</h3>
          <p>
            Redesigned the vehicle onboarding and activation flow: prototyping in Figma and
            designing separate primary/guest user paths to eliminate friction from first-time
            account setup.
          </p>
          <p className="impact-label">Impact</p>
          <ul>
            <li>Significantly improved first-run activation completion rates for new Škoda owners.</li>
          </ul>
          <motion.a
            className="btn-ghost"
            href={LINKS.skodaLive}
            target="_blank"
            rel="noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04 }}
          >
            View Live <ArrowOut />
          </motion.a>
        </div>
        <div className="work-media teal">
          <div className="phones single pair">
            <PhoneFrame
              src="/images/work-skoda.png"
              alt="ŠKODA Connect activation and service packages screens"
            />
          </div>
        </div>
      </MotionCard>

      <MotionCard className="work-card" delay={0.1}>
        <div className="work-copy">
          <p className="work-brand">
            <img className="wordmark" src="/images/logo-reversal.png" alt="" />
            Reversal
          </p>
          <h3 className="reversal-title">
            Reversal - An Autonomous Humanoid Aid Performing Physical Command Z Function In Your
            Space.
          </h3>
          <p>
            A home humanoid whose core value isn&apos;t doing chores for you, it&apos;s
            reversibility. When something goes wrong (spilled, knocked over, left open, put in the
            wrong place), it undoes it.
          </p>
          <motion.a
            className="btn-ghost"
            href={LINKS.reversalCase}
            target="_blank"
            rel="noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04 }}
          >
            View Case Study <ArrowOut />
          </motion.a>
        </div>
        <div className="work-media purple">
          <div className="phones single">
            <PhoneFrame src="/images/reversal.mp4" alt="Reversal scanning interface" video />
          </div>
        </div>
      </MotionCard>

      <MotionCard className="work-card" delay={0.12}>
        <div className="work-copy">
          <p className="work-brand">
            <img className="wordmark kladot" src="/images/logo-kladot.png" alt="" />
            Kladot
          </p>
          <h3>Kladot - A Digital Banking Platform</h3>
          <p>
            Kladot is a digital banking platform that enables migrants, expatriates and global
            citizens to access multi-currency, Group Savings, Send, Receive, Payment, Investment,
            Loan, Debit Card and Convert cash instantly from their phone. KlaDot Inc. has already
            acquired Money services business license in USA and Canada.
          </p>
          <motion.a
            className="btn-ghost"
            href={LINKS.kladotCase}
            target="_blank"
            rel="noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04 }}
          >
            View Case Study <ArrowOut />
          </motion.a>
        </div>
        <div className="work-media">
          <div className="phones single">
            <PhoneFrame src="/images/kladot-collage.png" alt="Kladot app screens" />
          </div>
        </div>
      </MotionCard>

      <Reveal>
        <a className="see-more" href={LINKS.medium} target="_blank" rel="noreferrer">
          See More
        </a>
      </Reveal>
    </section>
  )
}

function About() {
  const reduce = useReducedMotion()
  return (
    <section className="section" id="about">
      <Reveal>
        <h2>Amajuoyi Udochukwu Deborah</h2>
        <p className="about-bio">
          Hi, I&apos;m Deborah, a senior product manager with a strong design background. I love
          turning messy business problems and technical constraints into products people actually
          want to use, across B2C, B2B, D2C, and platform, including AI tools I build myself. I make
          decisions with research and data, not gut feel, and when I&apos;m not shipping, you&apos;ll
          find me mentoring and speaking in the design and product community.
        </p>
      </Reveal>
      <div className="gallery">
        {GALLERY.map((item, index) => (
          <motion.figure
            key={item.src}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease }}
            whileHover={reduce ? undefined : { y: -6 }}
          >
            <img src={item.src} alt={item.caption} />
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.caption}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

function Impact() {
  return (
    <section className="section">
      <Reveal>
        <h2>A Quick Look at My Impact</h2>
      </Reveal>
      <Reveal className="impact-card">
        <div className="stats-row impact-stats">
          <div className="stat-cell">
            <strong>5+</strong>
            <span>
              Large-scale apps
              <br />
              taken to market
            </span>
          </div>
          <div className="stat-cell">
            <strong>4</strong>
            <span>
              Product models: B2C, B2B,
              <br />
              D2C &amp; platform
            </span>
          </div>
          <div className="stat-cell">
            <strong>AI</strong>
            <span>
              Tools I design, build,
              <br />
              and ship myself
            </span>
          </div>
          <div className="stat-cell">
            <strong>MSc</strong>
            <span>
              Information Technology,
              <br />
              AIU
            </span>
          </div>
        </div>
        <div className="impact-cols">
          <div>
            <h4>Experience</h4>
            {EXPERIENCE.map((job) => (
              <div key={job.role + job.dates} className="resume-item">
                <strong>{job.company}</strong>
                <span>{job.role}</span>
                <span>{job.dates}</span>
                <span className="loc">
                  <PinIcon /> {job.location}
                </span>
              </div>
            ))}
          </div>
          <div>
            <h4>Education</h4>
            {EDUCATION.map((ed) => (
              <div key={ed.school} className="resume-item">
                <strong>{ed.school}</strong>
                <span>{ed.degree}</span>
                <span>{ed.detail}</span>
                <span className="loc">
                  <PinIcon /> {ed.location}
                </span>
              </div>
            ))}
            <h4>Languages</h4>
            <p className="plain-list">
              English
              <br />
              French
              <br />
              German
            </p>
            <h4>Writing</h4>
            <p className="writing">
              write on product design, PM, and process across{' '}
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              ,{' '}
              <a href={LINKS.x} target="_blank" rel="noreferrer">
                X
              </a>
              , and{' '}
              <a href={LINKS.medium} target="_blank" rel="noreferrer">
                Medium
              </a>
              .
            </p>
          </div>
          <div>
            <h4>Community, Speaking, &amp; Mentorship</h4>
            {COMMUNITY.map((item) => (
              <div key={item.org} className="resume-item">
                <strong>{item.org}</strong>
                <span>{item.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section">
      <Reveal>
        <h2>What People Say</h2>
      </Reveal>
      <div className="quotes">
        {TESTIMONIALS.map((item, index) => {
          const name = item.href ? (
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.name}
            </a>
          ) : (
            item.name
          )
          return (
            <MotionCard key={item.name} className="quote-card" delay={index * 0.08}>
              <header>
                <img src={item.avatar} alt="" />
                <div>
                  <strong>{name}</strong>
                  <span>{item.role}</span>
                </div>
              </header>
              <p>{item.quote}</p>
            </MotionCard>
          )
        })}
      </div>
    </section>
  )
}

function Footer() {
  const reduce = useReducedMotion()
  return (
    <footer className="footer" id="contact">
      <Starfield />
      <div className="footer-glow" />
      <Reveal>
        <h2>Let&apos;s make positive impact together!</h2>
        <p>I&apos;m eager to embrace fresh challenges and collaborate with you to build something extraordinary.</p>
        <motion.a
          className="btn-glow"
          href={LINKS.email}
          whileHover={reduce ? undefined : { scale: 1.05 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          Contact Deborah
        </motion.a>
      </Reveal>
      <div className="socials">
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <span />
        <a href={LINKS.medium} target="_blank" rel="noreferrer" aria-label="Medium">
          <svg width="22" height="14" viewBox="0 0 24 14" fill="currentColor">
            <ellipse cx="7" cy="7" rx="7" ry="7" />
            <ellipse cx="17.2" cy="7" rx="3.2" ry="6.5" />
            <ellipse cx="22.4" cy="7" rx="1.4" ry="5.8" />
          </svg>
        </a>
        <span />
        <a href={LINKS.x} target="_blank" rel="noreferrer" aria-label="X">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}

function ScrollRail() {
  const reduce = useReducedMotion()
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    function update() {
      setAtTop(window.scrollY < 48)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'

  return (
    <nav className="scroll-rail" aria-label="Page scroll">
      <button
        type="button"
        className="scroll-rail-btn"
        aria-label={atTop ? 'Scroll down' : 'Back to top'}
        onClick={() =>
          window.scrollTo({
            top: atTop ? window.scrollY + window.innerHeight * 0.9 : 0,
            behavior,
          })
        }
      >
        {atTop ? <ChevronDown /> : <ChevronUp />}
      </button>
    </nav>
  )
}

export default function App() {
  return (
    <div className="page">
      <CursorFollower />
      <Navbar />
      <main>
        <Hero />
        <Strategy />
        <Competencies />
        <Works />
        <About />
        <Impact />
        <Testimonials />
      </main>
      <Footer />
      <ScrollRail />
    </div>
  )
}
