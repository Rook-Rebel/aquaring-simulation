import { useEffect, useRef } from 'react'

const COMPONENTS = [
  { title: 'რგოლისებრი კორპუსი',            icon: '◎', color: '#00d4ff', desc: 'მილს გარედან ეჭირება' },
  { title: 'აკუსტიკური ტალღების გენერატორი', icon: '〜', color: '#0ea5e9', desc: 'ულტრაბგერის წყარო' },
  { title: 'მილის გარე სამაგრი',              icon: '⊂⊃',color: '#a78bfa', desc: 'სწრაფი დამაგრება' },
  { title: 'გვერდითი ნალექის კამერა',         icon: '◫', color: '#fb923c', desc: 'ნაწილაკების კოლექტორი' },
  { title: 'თვითწმენდის არხი',               icon: '↻', color: '#34d399', desc: 'ავტომატური გამოტუმბვა' },
  { title: 'სტატუსის მაჩვენებელი',           icon: '◉', color: '#f59e0b', desc: 'სისტემის ინდიკატორი' },
]

function AnimatedRing() {
  const svgRef = useRef(null)
  const rafRef = useRef(null)
  const tRef   = useRef(0)

  useEffect(() => {
    let running = true
    const svg = svgRef.current
    if (!svg) return

    const rings = svg.querySelectorAll('.wave-ring')
    const ticks = svg.querySelectorAll('.tick')
    const dot   = svg.querySelector('.status-dot')

    const tick = () => {
      if (!running) return
      tRef.current += 0.016

      // Expanding acoustic rings
      rings.forEach((r, i) => {
        const phase = ((tRef.current * 0.45 + i * 0.33) % 1)
        const baseR = 85
        const radius = baseR + phase * 60
        const alpha = (1 - phase) * 0.35
        r.setAttribute('r', radius)
        r.setAttribute('stroke-opacity', alpha)
      })

      // Rotate ticks
      ticks.forEach((tick, i) => {
        const angle = (i / ticks.length) * Math.PI * 2 + tRef.current * 0.5
        const cx = 110, cy = 110, r1 = 76, r2 = 94
        const x1 = cx + r1 * Math.cos(angle), y1 = cy + r1 * Math.sin(angle)
        const x2 = cx + r2 * Math.cos(angle), y2 = cy + r2 * Math.sin(angle)
        tick.setAttribute('x1', x1); tick.setAttribute('y1', y1)
        tick.setAttribute('x2', x2); tick.setAttribute('y2', y2)
      })

      // Pulse status dot
      const dotR = 5 + Math.sin(tRef.current * 3) * 1.5
      dot?.setAttribute('r', dotR)

      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 220 220"
      width="220"
      height="220"
      style={{ overflow: 'visible' }}
    >
      {/* Expanding wave rings (animated by JS) */}
      {[0, 1, 2].map(i => (
        <circle key={i} className="wave-ring" cx="110" cy="110" r="85"
          fill="none" stroke="#00d4ff" strokeWidth="1.2" strokeOpacity="0" />
      ))}

      {/* Outer glow ring */}
      <circle cx="110" cy="110" r="86"
        fill="none" stroke="#00d4ff" strokeWidth="14" strokeOpacity="0.06" />

      {/* Main ring */}
      <circle cx="110" cy="110" r="86"
        fill="none" stroke="#00d4ff" strokeWidth="7"
        strokeDasharray="14 6"
        style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }} />

      {/* Rotating tick marks (animated by JS) */}
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} className="tick" x1="0" y1="0" x2="0" y2="0"
          stroke="rgba(0,212,255,0.35)" strokeWidth="1.8" strokeLinecap="round" />
      ))}

      {/* Inner pipe cross-section */}
      <circle cx="110" cy="110" r="52"
        fill="rgba(14,165,233,0.08)" stroke="#0ea5e9" strokeWidth="2.5" />
      <circle cx="110" cy="110" r="36"
        fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.35)"
        strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Water flow line */}
      <line x1="58" y1="110" x2="162" y2="110"
        stroke="rgba(0,212,255,0.3)" strokeWidth="2"
        strokeDasharray="6 3" />

      {/* Center dot */}
      <circle cx="110" cy="110" r="7" fill="#00d4ff"
        style={{ filter: 'drop-shadow(0 0 5px #00d4ff)' }} />
      <circle cx="110" cy="110" r="3" fill="#fff" />

      {/* Status dot (animated by JS) */}
      <circle className="status-dot" cx="176" cy="44" r="6"
        fill="#22c55e"
        style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }} />
      <circle cx="176" cy="44" r="12"
        fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="2" />

      {/* Label */}
      <text x="110" y="175" textAnchor="middle"
        fill="#67e8f9" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700">
        AquaRing
      </text>
      <text x="110" y="188" textAnchor="middle"
        fill="#334155" fontSize="8" fontFamily="Inter, sans-serif">
        განივი კვეთა
      </text>
    </svg>
  )
}

export default function DeviceSection() {
  return (
    <section style={{ background: '#081426' }}>
      <div className="section-wrap">
        <div className="mb-10">
          <span className="section-label">მოწყობილობის კონცეფცია</span>
          <h2 className="section-title">როგორია AquaRing?</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            AquaRing არის რგოლის ფორმის, გარედან დასამაგრებელი მოწყობილობა,
            რომელიც მილის ხელოვნური გახსნის გარეშე ქმნის აკუსტიკურ ველს.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>

          {/* ── Visual + description ── */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <AnimatedRing />

            <div
              style={{
                padding: '1rem 1.2rem',
                borderRadius: 12,
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.12)',
              }}
            >
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.85, textAlign: 'center' }}>
                AquaRing არის რგოლის ფორმის მოწყობილობა, რომელიც წყლის მილს{' '}
                <strong style={{ color: '#67e8f9' }}>გარედან ეჭირება</strong>.
                იგი{' '}
                <strong style={{ color: '#f87171' }}>არ ჭრის მილს</strong>,
                {' '}<strong style={{ color: '#f87171' }}>არ ამატებს ქიმიურ ნივთიერებებს</strong>{' '}
                და{' '}
                <strong style={{ color: '#f87171' }}>არ აყენებს ბადეს</strong>{' '}
                წყლის ნაკადში. მისი მიზანია ნაწილაკების{' '}
                <strong style={{ color: '#34d399' }}>აკუსტიკური ველით გადაადგილება</strong>{' '}
                და გვერდით კამერაში კონცენტრირება.
              </p>
            </div>

            {/* Key advantages */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', width: '100%' }}>
              {[
                { label: 'არაინვაზიური', icon: '✓', color: '#34d399' },
                { label: 'ქიმიკატების გარეშე', icon: '✓', color: '#34d399' },
                { label: 'გარედან დამაგრება', icon: '✓', color: '#00d4ff' },
                { label: 'ავტო-გამოტუმბვა', icon: '✓', color: '#00d4ff' },
              ].map(a => (
                <div
                  key={a.label}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 8,
                    background: `${a.color}0a`,
                    border: `1px solid ${a.color}1f`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ color: a.color, fontWeight: 800 }}>{a.icon}</span>
                  <span style={{ color: '#94a3b8' }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Component cards ── */}
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#334155',
                textTransform: 'uppercase',
                marginBottom: '0.9rem',
              }}
            >
              კომპონენტები
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {COMPONENTS.map((c, i) => (
                <div
                  key={c.title}
                  className="glass-card"
                  style={{
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    borderColor: `${c.color}1f`,
                    transition: 'all 0.2s ease',
                    animation: `slide-in-left 0.45s ${i * 0.07}s ease both`,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${c.color}4a`
                    e.currentTarget.style.background = `${c.color}08`
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${c.color}1f`
                    e.currentTarget.style.background = ''
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${c.color}14`,
                      border: `1px solid ${c.color}2f`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', color: c.color, flexShrink: 0,
                      boxShadow: `0 0 8px ${c.color}1a`,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.84rem', fontWeight: 600 }}>{c.title}</div>
                    <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: 1 }}>{c.desc}</div>
                  </div>
                  <div
                    style={{
                      marginLeft: 'auto',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: c.color,
                      boxShadow: `0 0 6px ${c.color}`,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
