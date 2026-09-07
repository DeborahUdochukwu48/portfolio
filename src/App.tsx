import { useEffect, useMemo, useState } from 'react'

type Tab = 'home' | 'activity' | 'robot' | 'you'
type Screen = 'splash' | 'onboard' | 'app'
type Actor = 'R1' | 'You'

type Room = {
  chair: 'window' | 'tv'
  lampOn: boolean
  mugs: number
  throwOn: 'folded' | 'draped'
  books: 'shelf' | 'floor'
}

type Change = {
  id: string
  actor: Actor
  title: string
  detail: string
  time: string
  apply: (room: Room) => Room
}

const BASELINE: Room = {
  chair: 'window',
  lampOn: false,
  mugs: 0,
  throwOn: 'folded',
  books: 'shelf',
}

const STARTER: Change[] = [
  {
    id: '1',
    actor: 'R1',
    title: 'Moved the armchair',
    detail: 'Window nook → facing the TV',
    time: '7:12 PM',
    apply: (room) => ({ ...room, chair: 'tv' }),
  },
  {
    id: '2',
    actor: 'R1',
    title: 'Turned the floor lamp on',
    detail: 'Living room, movie lighting',
    time: '7:14 PM',
    apply: (room) => ({ ...room, lampOn: true }),
  },
  {
    id: '3',
    actor: 'You',
    title: 'Left mugs on the table',
    detail: 'Two coffee mugs after work',
    time: '8:01 PM',
    apply: (room) => ({ ...room, mugs: 2 }),
  },
  {
    id: '4',
    actor: 'R1',
    title: 'Draped the throw',
    detail: 'Sofa, evening setup',
    time: '8:06 PM',
    apply: (room) => ({ ...room, throwOn: 'draped' }),
  },
]

const MESS_PRESETS: Omit<Change, 'id' | 'time'>[] = [
  {
    actor: 'You',
    title: 'Knocked books onto the floor',
    detail: 'Coffee table pile, living room',
    apply: (room) => ({ ...room, books: 'floor' }),
  },
  {
    actor: 'You',
    title: 'Dragged the chair back',
    detail: 'TV → window nook',
    apply: (room) => ({ ...room, chair: 'window' }),
  },
  {
    actor: 'You',
    title: 'Switched the lamp off',
    detail: 'Living room went dark',
    apply: (room) => ({ ...room, lampOn: false }),
  },
]

function applyStack(changes: Change[], cursor: number): Room {
  return changes.slice(0, cursor).reduce((room, change) => change.apply(room), BASELINE)
}

function RobotMark({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none" aria-hidden>
      <circle cx="90" cy="90" r="70" fill="#15213a" />
      <rect x="58" y="40" width="64" height="78" rx="22" fill="url(#g)" />
      <rect x="70" y="62" width="40" height="18" rx="9" fill="#0b1220" />
      <circle cx="80" cy="71" r="4" fill="#3d7cff" />
      <circle cx="100" cy="71" r="4" fill="#3d7cff" />
      <rect x="78" y="86" width="24" height="6" rx="3" fill="#8b97b0" />
      <rect x="48" y="70" width="12" height="36" rx="6" fill="#cfd6e6" />
      <rect x="120" y="70" width="12" height="36" rx="6" fill="#cfd6e6" />
      <rect x="72" y="118" width="14" height="28" rx="7" fill="#9aa7c2" />
      <rect x="94" y="118" width="14" height="28" rx="7" fill="#9aa7c2" />
      <defs>
        <linearGradient id="g" x1="58" y1="40" x2="122" y2="118">
          <stop stopColor="#f4f7ff" />
          <stop offset="1" stopColor="#9eb0cc" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function RoomView({ room, busy }: { room: Room; busy: boolean }) {
  return (
    <div className="room" aria-label="Living room state">
      <div className="window" />
      <div className="tv" />
      <div className={`books ${room.books}`} />
      <div className={`chair ${room.chair}`} />
      <div className="sofa" />
      <div className={`throw ${room.throwOn}`} />
      <div className="table" />
      {Array.from({ length: room.mugs }).map((_, i) => (
        <div key={i} className="mug" style={{ left: 32 + i * 16 }} />
      ))}
      <div className={`lamp ${room.lampOn ? 'on' : ''}`}>
        <div className="shade" />
      </div>
      <div className={`robot ${busy ? 'busy' : ''}`} />
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [onboardStep, setOnboardStep] = useState(0)
  const [tab, setTab] = useState<Tab>('home')
  const [changes, setChanges] = useState<Change[]>(STARTER)
  const [cursor, setCursor] = useState(STARTER.length)
  const [busy, setBusy] = useState<string | null>(null)

  const room = useMemo(() => applyStack(changes, cursor), [changes, cursor])
  const last = cursor > 0 ? changes[cursor - 1] : null
  const canUndo = cursor > 0 && !busy
  const canRedo = cursor < changes.length && !busy

  function runRobot(label: string, work: () => void) {
    setBusy(label)
    window.setTimeout(() => {
      work()
      setBusy(null)
    }, 2200)
  }

  function undo() {
    if (!canUndo || !last) return
    runRobot(`Reversing: ${last.title.toLowerCase()}`, () => setCursor((c) => c - 1))
  }

  function redo() {
    if (!canRedo) return
    const next = changes[cursor]
    runRobot(`Replaying: ${next.title.toLowerCase()}`, () => setCursor((c) => c + 1))
  }

  function mess(preset: Omit<Change, 'id' | 'time'>) {
    const next: Change = {
      ...preset,
      id: crypto.randomUUID(),
      time: 'Just now',
    }
    setChanges((list) => [...list.slice(0, cursor), next])
    setCursor((c) => c + 1)
    setTab('home')
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') return
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canUndo, canRedo, last, cursor, busy, changes])

  const onboard = [
    {
      kicker: 'Humanoid intelligence',
      title: 'Cmd+Z for the living room.',
      body: 'R1 watches what changes in your space — then walks it back when you undo.',
    },
    {
      kicker: 'One assumption',
      title: 'Would you tap Undo on the real world?',
      body: 'This prototype tests that, not robot hardware. Make a mess, then reverse it.',
    },
    {
      kicker: 'Ready',
      title: 'Your living room, with a rewind.',
      body: 'The last physical change sits on a stack. Undo sends R1 to restore it.',
    },
  ][onboardStep]

  return (
    <div className="app-shell">
      <div className="phone">
        {screen === 'splash' && (
          <section className="screen splash">
            <div className="robot-hero">
              <RobotMark />
            </div>
            <p className="kicker">Reversal</p>
            <h1 style={{ margin: '10px 0 12px' }}>Undo for the real world.</h1>
            <p className="muted">
              A humanoid that treats your home like a document — with Command Z.
            </p>
            <button className="primary" style={{ marginTop: 28 }} onClick={() => setScreen('onboard')}>
              Get started
            </button>
          </section>
        )}

        {screen === 'onboard' && (
          <section className="screen onboard">
            <div className="robot-hero">
              <RobotMark size={160} />
            </div>
            <p className="kicker">{onboard.kicker}</p>
            <h1 style={{ margin: '10px 0 12px' }}>{onboard.title}</h1>
            <p className="muted">{onboard.body}</p>
            <div className="dots">
              {[0, 1, 2].map((i) => (
                <span key={i} className={i === onboardStep ? 'on' : ''} />
              ))}
            </div>
            <button
              className="primary"
              onClick={() => {
                if (onboardStep < 2) setOnboardStep((s) => s + 1)
                else setScreen('app')
              }}
            >
              {onboardStep < 2 ? 'Next' : 'Open living room'}
            </button>
            <button className="ghost" onClick={() => setScreen('app')}>
              Skip
            </button>
          </section>
        )}

        {screen === 'app' && (
          <>
            <section className="screen">
              {tab === 'home' && (
                <>
                  <div className="row">
                    <div>
                      <p className="kicker">Living room</p>
                      <h2 style={{ marginTop: 4 }}>Tonight’s stack</h2>
                    </div>
                    <span className="status-pill">
                      <span className={`dot ${busy ? 'busy' : ''}`} />
                      {busy ? 'R1 working' : 'R1 idle'}
                    </span>
                  </div>
                  <RoomView room={room} busy={Boolean(busy)} />
                  <div className="card">
                    <p className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                      LAST CHANGE
                    </p>
                    <h3 style={{ marginTop: 6 }}>{last ? last.title : 'Room is at baseline'}</h3>
                    <p className="muted" style={{ marginTop: 4 }}>
                      {last ? `${last.actor} · ${last.detail}` : 'Nothing left to reverse.'}
                    </p>
                  </div>
                  <button className="undo-btn" onClick={undo} disabled={!canUndo}>
                    ⌘Z  Undo last change
                  </button>
                  <button className="ghost" onClick={redo} disabled={!canRedo}>
                    Redo
                  </button>
                  <p className="hint">Keyboard: ⌘Z / ⌘⇧Z — same as the product idea.</p>
                </>
              )}

              {tab === 'activity' && (
                <>
                  <p className="kicker">Activity</p>
                  <h2 style={{ margin: '6px 0 14px' }}>Physical history</h2>
                  <div className="card">
                    {changes.map((change, index) => {
                      const undone = index >= cursor
                      const isTop = index === cursor - 1
                      return (
                        <div key={change.id} className={`event ${undone ? 'undone' : ''}`}>
                          <div className="avatar">{change.actor === 'R1' ? '🤖' : '👤'}</div>
                          <div>
                            <strong>{change.title}</strong>
                            <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                              {change.actor} · {change.time}
                              {undone ? ' · undone' : ''}
                            </p>
                          </div>
                          {isTop ? (
                            <button className="mini" onClick={undo} disabled={!canUndo}>
                              Undo
                            </button>
                          ) : undone && index === cursor ? (
                            <button className="mini redo" onClick={redo} disabled={!canRedo}>
                              Redo
                            </button>
                          ) : (
                            <span className="muted" style={{ fontSize: 12 }}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
                    Undo is a stack, like documents — R1 only reverses the latest living-space change.
                  </p>
                </>
              )}

              {tab === 'robot' && (
                <>
                  <p className="kicker">Humanoid</p>
                  <h2 style={{ margin: '6px 0 8px' }}>R1 · living room</h2>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <RobotMark size={150} />
                  </div>
                  <div className="row" style={{ gap: 10, marginTop: 8 }}>
                    <div className="stat">
                      <span className="muted">Status</span>
                      <b>{busy ? 'Reversing' : 'Idle'}</b>
                    </div>
                    <div className="stat">
                      <span className="muted">Stack</span>
                      <b>
                        {cursor}/{changes.length}
                      </b>
                    </div>
                  </div>
                  <div className="card" style={{ marginTop: 12 }}>
                    <p className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                      SIMULATE LIFE
                    </p>
                    <p style={{ margin: '8px 0 4px' }}>Make a mess, then undo it.</p>
                    <p className="muted" style={{ fontSize: 13 }}>
                      This is the experiment: do you reach for Command Z instead of fixing it yourself?
                    </p>
                    <div className="chip-row">
                      {MESS_PRESETS.map((preset) => (
                        <button key={preset.title} className="chip" onClick={() => mess(preset)}>
                          {preset.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tab === 'you' && (
                <>
                  <p className="kicker">Prototype</p>
                  <h2 style={{ margin: '6px 0 14px' }}>What we’re testing</h2>
                  <div className="card">
                    <p>
                      <strong>Assumption:</strong> people will undo physical home changes through a
                      humanoid the same way they hit Cmd+Z on a laptop.
                    </p>
                    <p className="muted" style={{ marginTop: 10 }}>
                      Out of scope for this version: real robots, accounts, multi-room homes, and
                      device APIs. The room is a simulation so the undo loop is real.
                    </p>
                  </div>
                  <div className="card" style={{ marginTop: 12 }}>
                    <p className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                      SUCCESS LOOKS LIKE
                    </p>
                    <p style={{ marginTop: 8 }}>
                      You mess the room, tap ⌘Z, and wait for R1 instead of dragging the chair
                      yourself.
                    </p>
                  </div>
                </>
              )}
            </section>

            <nav className="nav">
              {(
                [
                  ['home', 'Home'],
                  ['activity', 'Activity'],
                  ['robot', 'R1'],
                  ['you', 'Idea'],
                ] as const
              ).map(([id, label]) => (
                <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
                  {label}
                </button>
              ))}
            </nav>

            {busy && (
              <div className="overlay">
                <div className="sheet">
                  <p className="kicker">R1 en route</p>
                  <h3 style={{ marginTop: 8 }}>{busy}</h3>
                  <p className="muted" style={{ marginTop: 6 }}>
                    Walking the last physical change back. Don’t touch the object — that’s the test.
                  </p>
                  <div className="bar">
                    <span />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
