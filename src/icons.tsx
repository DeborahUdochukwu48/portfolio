type IconName = 'target' | 'cube' | 'machine' | 'ring' | 'chart' | 'phone'

export function CompetencyIcon({ name }: { name: IconName }) {
  return (
    <div className="comp-icon" aria-hidden>
      {name === 'target' && (
        <svg viewBox="0 0 120 90">
          <circle cx="60" cy="48" r="28" fill="#2a1848" />
          <circle cx="60" cy="48" r="18" fill="#5b2d9e" />
          <circle cx="60" cy="48" r="8" fill="#c4a0ff" />
          <path d="M86 18 L70 42" stroke="#8ec5ff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="90" cy="14" r="4" fill="#8ec5ff" />
          <circle cx="28" cy="22" r="3" fill="#b587ff" />
          <circle cx="96" cy="58" r="2.5" fill="#9d7dff" />
        </svg>
      )}
      {name === 'cube' && (
        <svg viewBox="0 0 120 90">
          <path d="M60 22 L88 38 L60 54 L32 38 Z" fill="#7a4dff" />
          <path d="M32 38 L60 54 L60 78 L32 62 Z" fill="#3d2a8a" />
          <path d="M88 38 L60 54 L60 78 L88 62 Z" fill="#5a3bb8" />
        </svg>
      )}
      {name === 'machine' && (
        <svg viewBox="0 0 120 90">
          <rect x="34" y="28" width="52" height="38" rx="8" fill="#4b2d9e" />
          <rect x="42" y="36" width="36" height="22" rx="4" fill="#7ec8ff" />
          <rect x="28" y="66" width="64" height="8" rx="3" fill="#2a1848" />
          <circle cx="40" cy="70" r="3" fill="#6aa0ff" />
          <circle cx="80" cy="70" r="3" fill="#6aa0ff" />
        </svg>
      )}
      {name === 'ring' && (
        <svg viewBox="0 0 120 90">
          <ellipse cx="60" cy="72" rx="34" ry="6" fill="#1a1230" />
          <ellipse cx="60" cy="42" rx="26" ry="16" fill="none" stroke="#5ad0ff" strokeWidth="8" />
          <ellipse cx="60" cy="42" rx="26" ry="16" fill="none" stroke="#9ee7ff" strokeWidth="2" />
        </svg>
      )}
      {name === 'chart' && (
        <svg viewBox="0 0 120 90">
          <path d="M22 70 C38 70 40 28 58 28 C76 28 78 62 98 50 L98 78 L22 78 Z" fill="url(#wave)" />
          <defs>
            <linearGradient id="wave" x1="22" y1="28" x2="98" y2="78">
              <stop stopColor="#7a4dff" />
              <stop offset="1" stopColor="#ff8a4c" />
            </linearGradient>
          </defs>
        </svg>
      )}
      {name === 'phone' && (
        <svg viewBox="0 0 120 90">
          <rect x="48" y="16" width="24" height="44" rx="5" fill="#1c1630" stroke="#8a7cff" />
          <rect x="72" y="22" width="22" height="16" rx="3" fill="#6b4dff" opacity="0.85" />
          <rect x="28" y="30" width="18" height="14" rx="3" fill="#3d7cff" opacity="0.8" />
          <rect x="70" y="42" width="20" height="12" rx="3" fill="#b587ff" opacity="0.75" />
        </svg>
      )}
    </div>
  )
}

export function ArrowOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MouseIcon() {
  return (
    <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden>
      <rect x="1" y="1" width="16" height="26" rx="8" stroke="currentColor" opacity="0.45" />
      <circle cx="9" cy="8" r="1.6" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function ChevronUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 15 L12 9 L18 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9 L12 15 L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PinIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden>
      <path
        d="M5 11s4-4.2 4-7A4 4 0 1 0 1 4c0 2.8 4 7 4 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="5" cy="4" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.2v1.8M12 19v1.8M4.9 4.9l1.3 1.3M17.8 17.8l1.3 1.3M3.2 12H5M19 12h1.8M4.9 19.1l1.3-1.3M17.8 6.2l1.3-1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16.4 13.6A6.4 6.4 0 0 1 10.2 5a6.6 6.6 0 1 0 6.2 8.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden>
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="13" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M9.6 6.4h5.6c3.55 0 6.05 2.45 6.05 7.6s-2.5 7.6-6.05 7.6H9.6V6.4Zm2.35 2.2v10.8h3.25c2.25 0 3.7-1.7 3.7-5.4 0-3.7-1.45-5.4-3.7-5.4H11.95Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}
