import { useEffect, useRef } from 'react'

const HERO_BADGES = [
  { label: 'არაინვაზიური', color: '#00d4ff' },
  { label: 'აკუსტიკური სეპარაცია', color: '#a78bfa' },
  { label: 'წყლის ტექნოლოგია', color: '#34d399' },
]

export default function Hero({ onStart, onHow }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Floating particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: -0.0002 - Math.random() * 0.0003,
      alpha: 0.1 + Math.random() * 0.35,
      color: Math.random() > 0.6 ? '#00d4ff' : Math.random() > 0.5 ? '#7c3aed' : '#ca8a04',
    }))

    // Wave layers
    const waves = Array.from({ length: 4 }, (_, i) => ({
      yFrac: 0.55 + i * 0.12,
      speed: 0.25 + i * 0.1,
      amp: 14 + i * 9,
      offset: (i * Math.PI * 2) / 4,
      alpha: 0.025 + i * 0.012,
    }))

    let t = 0
    const draw = () => {
      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)

      // Waves
      waves.forEach(w => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(0,212,255,${w.alpha})`
        ctx.lineWidth = 1.5
        for (let x = 0; x <= W; x += 3) {
          const y = w.yFrac * H + Math.sin((x / W) * Math.PI * 5 + t * w.speed + w.offset) * w.amp
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      // Expanding ring pulses from center
      const cx = W / 2, cy = H * 0.42
      for (let i = 0; i < 3; i++) {
        const phase = ((t * 0.4 + i * 0.33) % 1)
        const r = phase * Math.min(W, H) * 0.38
        const a = (1 - phase) * 0.07
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,212,255,${a})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random() }
        if (p.x < -0.01) p.x = 1.01
        if (p.x > 1.01)  p.x = -0.01

        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowBlur = 4
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
      })

      t += 0.008
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      {/* Fixed nav */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          <span className="nav-brand">⬤ AquaRing</span>
          <ul className="nav-links">
            <li><a href="#simulation">სიმულაცია</a></li>
            <li><a href="#formula">გამოთვლა</a></li>
            <li><a href="#dashboard">მონაცემები</a></li>
            <li><a href="#research">კვლევა</a></li>
            <li><a href="#how-it-works">მუშაობა</a></li>
          </ul>
          <span style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 600 }}>გუნდი Waveflow</span>
        </div>
      </nav>

      <section
        className="relative overflow-hidden bg-grid-subtle"
        style={{
          minHeight: '100vh',
          paddingTop: 56,
          background: 'linear-gradient(180deg, #020c18 0%, #040d18 50%, #081426 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Animated canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Deep radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 75% 60% at 50% 42%, rgba(0,170,255,0.07) 0%, transparent 70%)',
          }}
        />

        <div
          className="relative z-10 w-full"
          style={{ maxWidth: 1240, margin: '0 auto', padding: '3rem 2rem 4rem' }}
        >
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>

            {/* Top badge row */}
            <div
              className="inline-flex flex-wrap items-center justify-center gap-2 mb-7"
              style={{ animation: 'fade-in-up 0.5s ease both' }}
            >
              <span className="badge badge-cyan">STEM პროექტი 2025–26</span>
              <span className="badge badge-purple">საგანმანათლებლო სიმულაცია</span>
            </div>

            {/* Ring icon */}
            <div
              className="flex justify-center mb-6"
              style={{ animation: 'fade-in-up 0.6s 0.1s ease both' }}
            >
              <div style={{ position: 'relative', width: 108, height: 108 }}>
                {/* Outer glow ring (CSS animation) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: -12,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(0,212,255,0.15)',
                    animation: 'wave-out 2.8s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(0,212,255,0.2)',
                    animation: 'wave-out 2.8s 0.7s ease-in-out infinite',
                  }}
                />
                <svg
                  viewBox="0 0 108 108"
                  fill="none"
                  style={{ width: '100%', height: '100%', animation: 'ring-pulse 2.6s ease-in-out infinite' }}
                >
                  <circle cx="54" cy="54" r="46" stroke="#00d4ff" strokeWidth="6" fill="none" opacity="0.95" />
                  <circle cx="54" cy="54" r="36" stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5 4" />
                  <circle cx="54" cy="54" r="24" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,212,255,0.06)" opacity="0.5" />
                  {/* Segments */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = (i / 12) * Math.PI * 2
                    const r1 = 40, r2 = 52
                    const x1 = 54 + r1 * Math.cos(a), y1 = 54 + r1 * Math.sin(a)
                    const x2 = 54 + r2 * Math.cos(a), y2 = 54 + r2 * Math.sin(a)
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
                  })}
                  <circle cx="54" cy="54" r="7" fill="#00d4ff" />
                  <circle cx="54" cy="54" r="3" fill="#fff" />
                  {/* Status dot */}
                  <circle cx="88" cy="20" r="5" fill="#22c55e" />
                  <circle cx="88" cy="20" r="9" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(135deg, #ffffff 20%, #67e8f9 55%, #00d4ff 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.6rem',
                animation: 'fade-in-up 0.65s 0.15s ease both',
              }}
            >
              AquaRing
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 2.4vw, 1.4rem)',
                fontWeight: 600,
                color: '#67e8f9',
                letterSpacing: '0.008em',
                marginBottom: '0.45rem',
                animation: 'fade-in-up 0.65s 0.22s ease both',
              }}
            >
              ჭკვიანი აკუსტიკური წყლის გამწმენდი რგოლი
            </p>

            <p
              style={{
                fontSize: '0.82rem',
                color: '#475569',
                fontWeight: 600,
                letterSpacing: '0.06em',
                marginBottom: '1.6rem',
                animation: 'fade-in-up 0.65s 0.28s ease both',
              }}
            >
              წარმოგიდგენთ გუნდი{' '}
              <span style={{ color: '#00d4ff', fontWeight: 800 }}>Waveflow</span>
            </p>

            {/* Divider */}
            <div
              style={{
                height: 1,
                maxWidth: 440,
                margin: '0 auto 1.8rem',
                background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)',
                animation: 'fade-in-up 0.6s 0.3s ease both',
              }}
            />

            {/* Description */}
            <p
              style={{
                maxWidth: 600,
                margin: '0 auto 1.8rem',
                color: '#94a3b8',
                fontSize: '1rem',
                lineHeight: 1.85,
                animation: 'fade-in-up 0.65s 0.35s ease both',
              }}
            >
              AquaRing არის მილზე გარედან დასამაგრებელი აკუსტიკური რგოლი, რომელიც წყლის ნაკადში
              არსებულ ჟანგს, ნალექსა და მიკრონაწილაკებს ერთ ზონაში აგროვებს — მილის გახსნის,
              ქიმიკატების გამოყენებისა და ბადის დამონტაჟების გარეშე.
            </p>

            {/* 3 feature badges */}
            <div
              className="flex flex-wrap justify-center gap-3 mb-9"
              style={{ animation: 'fade-in-up 0.65s 0.42s ease both' }}
            >
              {HERO_BADGES.map(b => (
                <span
                  key={b.label}
                  style={{
                    padding: '0.35rem 1rem',
                    borderRadius: 999,
                    border: `1px solid ${b.color}44`,
                    background: `${b.color}0d`,
                    color: b.color,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-4 justify-center"
              style={{ animation: 'fade-in-up 0.65s 0.48s ease both' }}
            >
              <button
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}
                onClick={onStart}
              >
                ▶ სიმულაციის დაწყება
              </button>
              <button
                className="btn-secondary"
                style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}
                onClick={onHow}
              >
                ◎ როგორ მუშაობს?
              </button>
            </div>

            {/* Scroll cue */}
            <div
              className="mt-14 flex justify-center"
              style={{ animation: 'float-y 2.5s ease-in-out infinite' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 1, height: 28, background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.6))' }} />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8l5 5 5-5" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
