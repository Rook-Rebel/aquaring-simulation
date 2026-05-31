import { useEffect, useRef, useCallback } from 'react'

const POLLUTANT_COLORS = {
  rust:        ['#c2410c', '#ea580c', '#b45309', '#9a3412'],
  sediment:    ['#a16207', '#ca8a04', '#92400e', '#78716c', '#d97706'],
  microplastic:['#7c3aed', '#6d28d9', '#4f46e5', '#2563eb', '#8b5cf6'],
  mixed:       ['#c2410c', '#ea580c', '#ca8a04', '#7c3aed', '#6d28d9', '#a16207'],
}

const MODE_LABELS = {
  'ლოდინი':           { color: '#64748b', label: 'ლოდინი' },
  'აკუსტიკური წმენდა': { color: '#00d4ff', label: 'აკუსტიკური წმენდა' },
  'თვითწმენდა':        { color: '#f59e0b', label: 'თვითწმენდა' },
  'გაჩერებულია':       { color: '#ef4444', label: 'გაჩერებულია' },
}

export default function Simulation({ state }) {
  const { isRunning, isFlushing, selectedPollutant, power, flowRate, mode, tankLevel } = state
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const tRef = useRef(0)

  const spawnParticle = useCallback((W, PIPE_Y, PIPE_H, PIPE_X_START) => {
    const colors = POLLUTANT_COLORS[selectedPollutant] || POLLUTANT_COLORS.mixed
    return {
      x: PIPE_X_START - 10,
      y: PIPE_Y + 8 + Math.random() * (PIPE_H - 16),
      r: 2.8 + Math.random() * 3.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: 1.0 + flowRate * 1.1 + Math.random() * 0.6,
      vy: (Math.random() - 0.5) * 0.5,
      opacity: 0.88,
    }
  }, [selectedPollutant, flowRate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const W = canvas.width
    const H = canvas.height

    // Layout
    const PIPE_Y      = Math.round(H * 0.35)
    const PIPE_H      = Math.round(H * 0.28)
    const PIPE_X_START = 52
    const PIPE_X_END   = W - 155
    const PIPE_W       = PIPE_X_END - PIPE_X_START
    const RING_X       = PIPE_X_START + PIPE_W * 0.44
    const RING_Y       = PIPE_Y + PIPE_H / 2
    const RING_R       = PIPE_H / 2 + 26

    const CHAM_X  = PIPE_X_END + 18
    const CHAM_Y  = PIPE_Y - 28
    const CHAM_W  = 110
    const CHAM_H  = PIPE_H + 60

    // Seed particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 34; i++) {
        const p = spawnParticle(W, PIPE_Y, PIPE_H, PIPE_X_START)
        p.x = PIPE_X_START + Math.random() * PIPE_W
        particlesRef.current.push(p)
      }
    }

    // ── Draw helpers ──────────────────────────────────────────────────────────

    const drawBackground = () => {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
      bgGrad.addColorStop(0, '#040f1e')
      bgGrad.addColorStop(1, '#020c18')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(0,212,255,0.035)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
      for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }
    }

    const drawPipe = () => {
      const t = tRef.current

      // Pipe shadow/glow
      const pipeShadow = ctx.createLinearGradient(0, PIPE_Y - 14, 0, PIPE_Y + PIPE_H + 14)
      pipeShadow.addColorStop(0,   'rgba(0,212,255,0.12)')
      pipeShadow.addColorStop(0.5, 'rgba(0,0,0,0)')
      pipeShadow.addColorStop(1,   'rgba(0,212,255,0.12)')
      ctx.fillStyle = pipeShadow
      ctx.beginPath()
      ctx.roundRect(PIPE_X_START - 14, PIPE_Y - 14, PIPE_W + 28, PIPE_H + 28, 14)
      ctx.fill()

      // Pipe shell (outer)
      const shellGrad = ctx.createLinearGradient(0, PIPE_Y - 8, 0, PIPE_Y + PIPE_H + 8)
      shellGrad.addColorStop(0,    '#1e3a5f')
      shellGrad.addColorStop(0.12, '#0d2040')
      shellGrad.addColorStop(0.88, '#0d2040')
      shellGrad.addColorStop(1,    '#1e3a5f')
      ctx.fillStyle = shellGrad
      ctx.beginPath()
      ctx.roundRect(PIPE_X_START - 8, PIPE_Y - 8, PIPE_W + 16, PIPE_H + 16, 10)
      ctx.fill()

      // Glass highlight on top edge
      ctx.beginPath()
      ctx.roundRect(PIPE_X_START - 8, PIPE_Y - 8, PIPE_W + 16, 4, [10, 10, 0, 0])
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.fill()

      // Water fill
      const waterGrad = ctx.createLinearGradient(0, PIPE_Y, 0, PIPE_Y + PIPE_H)
      waterGrad.addColorStop(0,   'rgba(6,182,212,0.28)')
      waterGrad.addColorStop(0.4, 'rgba(14,165,233,0.2)')
      waterGrad.addColorStop(1,   'rgba(6,182,212,0.26)')
      ctx.fillStyle = waterGrad
      ctx.fillRect(PIPE_X_START, PIPE_Y, PIPE_W, PIPE_H)

      // Animated flow streaks
      ctx.save()
      ctx.beginPath()
      ctx.rect(PIPE_X_START, PIPE_Y, PIPE_W, PIPE_H)
      ctx.clip()
      const streamSpeed = (0.8 + flowRate * 0.55) * 38
      for (let i = 0; i < 6; i++) {
        const baseX = ((t * streamSpeed + i * (PIPE_W / 6) + 40) % (PIPE_W + 120)) - 60
        const streak_y = PIPE_Y + 10 + (i % 3) * (PIPE_H / 3 - 4)
        const alpha = 0.05 + (i % 2) * 0.04
        ctx.beginPath()
        ctx.strokeStyle = `rgba(103,232,249,${alpha})`
        ctx.lineWidth = i % 2 === 0 ? 1.5 : 1
        ctx.moveTo(PIPE_X_START + baseX, streak_y)
        ctx.lineTo(PIPE_X_START + baseX + 55, streak_y)
        ctx.stroke()
      }
      ctx.restore()

      // Pipe border stroke
      ctx.strokeStyle = 'rgba(29,78,216,0.8)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(PIPE_X_START - 8, PIPE_Y - 8, PIPE_W + 16, PIPE_H + 16, 10)
      ctx.stroke()

      // Inner edge highlights
      ctx.strokeStyle = 'rgba(0,212,255,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(PIPE_X_START, PIPE_Y, PIPE_W, PIPE_H, 2)
      ctx.stroke()

      // ── Labels ────────────────────────────────────────
      ctx.font = 'bold 11px Inter, sans-serif'
      ctx.textAlign = 'center'

      // "წყლის ნაკადი" label with arrow
      ctx.fillStyle = '#00d4ff'
      ctx.fillText('წყლის ნაკადი', PIPE_X_START + 60, PIPE_Y - 18)
      ctx.fillStyle = 'rgba(0,212,255,0.7)'
      ctx.fillText('→', PIPE_X_START + 32, PIPE_Y + PIPE_H / 2 + 4)
      ctx.fillText('→', PIPE_X_START + 50, PIPE_Y + PIPE_H / 2 + 4)

      // Clean water label right side
      ctx.fillStyle = '#4ade80'
      ctx.font = 'bold 11px Inter, sans-serif'
      ctx.fillText('სუფთა წყალი', PIPE_X_END + 16 + (W - PIPE_X_END - 155) / 2, PIPE_Y - 16)
      ctx.fillStyle = 'rgba(74,222,128,0.8)'
      ctx.fillText('→', PIPE_X_END + 10, PIPE_Y + PIPE_H / 2 + 4)

      ctx.textAlign = 'left'
    }

    const drawAquaRing = () => {
      const rx = RING_X, ry = RING_Y, ro = RING_R
      const t = tRef.current

      if (isRunning) {
        // Expanding acoustic wave rings
        const pwrFac = power / 100
        for (let i = 0; i < 5; i++) {
          const phase = ((t * 0.55 + i * 0.2) % 1)
          const wr = ro + phase * 90
          const wa = (1 - phase) * 0.22 * pwrFac
          ctx.beginPath()
          ctx.arc(rx, ry, wr, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(0,212,255,${wa})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // Radial glow fill
        const glowGrad = ctx.createRadialGradient(rx, ry, ro * 0.5, rx, ry, ro + 55)
        glowGrad.addColorStop(0, `rgba(0,212,255,${0.1 * pwrFac})`)
        glowGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(rx, ry, ro + 55, 0, Math.PI * 2)
        ctx.fill()

        // "აკუსტიკური ველი" label
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = `rgba(0,212,255,${0.55 * pwrFac})`
        ctx.fillText('აკუსტიკური ველი', rx, ry + ro + 38)
        ctx.textAlign = 'left'
      }

      // Ring body gradient
      const ringGrad = ctx.createLinearGradient(rx - ro, ry, rx + ro, ry)
      ringGrad.addColorStop(0,   isRunning ? '#0369a1' : '#1e293b')
      ringGrad.addColorStop(0.5, isRunning ? '#00d4ff' : '#334155')
      ringGrad.addColorStop(1,   isRunning ? '#0369a1' : '#1e293b')

      ctx.beginPath()
      ctx.arc(rx, ry, ro, 0, Math.PI * 2)
      ctx.strokeStyle = ringGrad
      ctx.lineWidth = isRunning ? 8 : 6
      ctx.stroke()

      // Outer glow ring
      if (isRunning) {
        ctx.beginPath()
        ctx.arc(rx, ry, ro, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,212,255,${0.25 * (power / 100)})`
        ctx.lineWidth = 14
        ctx.stroke()
      }

      // Rotating tick marks
      const tickCount = 16
      for (let a = 0; a < tickCount; a++) {
        const angle = (a / tickCount) * Math.PI * 2 + tRef.current * (isRunning ? 0.35 : 0.06)
        const x1 = rx + (ro - 7) * Math.cos(angle)
        const y1 = ry + (ro - 7) * Math.sin(angle)
        const x2 = rx + (ro + 7) * Math.cos(angle)
        const y2 = ry + (ro + 7) * Math.sin(angle)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = isRunning ? 'rgba(0,212,255,0.45)' : 'rgba(100,116,139,0.3)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Status dot
      ctx.beginPath()
      ctx.arc(rx + ro - 4, ry - ro + 4, 6, 0, Math.PI * 2)
      ctx.fillStyle = isRunning ? '#22c55e' : '#ef4444'
      ctx.shadowBlur = isRunning ? 10 : 0
      ctx.shadowColor = '#22c55e'
      ctx.fill()
      ctx.shadowBlur = 0

      // "AquaRing" label
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = isRunning ? '#00d4ff' : '#475569'
      ctx.fillText('AquaRing', rx, ry - ro - 10)
      ctx.textAlign = 'left'
    }

    const drawChamber = () => {
      const fillH = (tankLevel / 100) * (CHAM_H - 12)
      const t = tRef.current

      // Connection pipe from main pipe to chamber
      const connY = PIPE_Y + PIPE_H / 2
      const connX1 = PIPE_X_END + 8
      const connX2 = CHAM_X + CHAM_W / 2

      // Connection pipe body
      ctx.beginPath()
      ctx.moveTo(connX1, connY)
      ctx.lineTo(connX2, CHAM_Y)
      ctx.strokeStyle = '#0d2040'
      ctx.lineWidth = 14
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Inner pipe highlight
      ctx.beginPath()
      ctx.moveTo(connX1, connY)
      ctx.lineTo(connX2, CHAM_Y)
      ctx.strokeStyle = 'rgba(6,182,212,0.22)'
      ctx.lineWidth = 6
      ctx.stroke()

      // Chamber shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.roundRect(CHAM_X + 4, CHAM_Y + 6, CHAM_W, CHAM_H, 10)
      ctx.fill()

      // Chamber body
      const chamGrad = ctx.createLinearGradient(CHAM_X, 0, CHAM_X + CHAM_W, 0)
      chamGrad.addColorStop(0, 'rgba(10,22,50,0.95)')
      chamGrad.addColorStop(1, 'rgba(20,40,80,0.9)')
      ctx.fillStyle = chamGrad
      ctx.beginPath()
      ctx.roundRect(CHAM_X, CHAM_Y, CHAM_W, CHAM_H, 10)
      ctx.fill()

      // Sediment fill
      if (tankLevel > 0) {
        const sedGrad = ctx.createLinearGradient(0, CHAM_Y + CHAM_H - fillH, 0, CHAM_Y + CHAM_H)
        sedGrad.addColorStop(0, 'rgba(154,52,18,0.45)')
        sedGrad.addColorStop(1, 'rgba(92,38,10,0.85)')
        ctx.fillStyle = sedGrad
        ctx.beginPath()
        ctx.roundRect(CHAM_X + 3, CHAM_Y + CHAM_H - fillH - 2, CHAM_W - 6, fillH + 2, [0,0,8,8])
        ctx.fill()

        // Sediment surface shimmer
        ctx.fillStyle = 'rgba(234,88,12,0.18)'
        ctx.fillRect(CHAM_X + 3, CHAM_Y + CHAM_H - fillH - 2, CHAM_W - 6, 3)
      }

      // Flush effect
      if (isFlushing) {
        ctx.fillStyle = `rgba(0,212,255,${0.12 + 0.06 * Math.sin(t * 8)})`
        ctx.beginPath()
        ctx.roundRect(CHAM_X + 3, CHAM_Y + 3, CHAM_W - 6, CHAM_H - 6, 8)
        ctx.fill()
      }

      // Chamber border
      ctx.strokeStyle = tankLevel > 65 ? '#f59e0b' : 'rgba(29,78,216,0.7)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(CHAM_X, CHAM_Y, CHAM_W, CHAM_H, 10)
      ctx.stroke()

      // Glass highlight on left edge
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      ctx.fillRect(CHAM_X + 2, CHAM_Y + 4, 3, CHAM_H - 8)

      // Labels
      ctx.textAlign = 'center'
      const cx = CHAM_X + CHAM_W / 2

      ctx.font = 'bold 11px Inter, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('ნალექის კამერა', cx, CHAM_Y - 8)

      ctx.font = `bold 15px Inter, sans-serif`
      ctx.fillStyle = tankLevel > 65 ? '#f59e0b' : '#00d4ff'
      ctx.fillText(`${Math.round(tankLevel)}%`, cx, CHAM_Y + CHAM_H / 2 + 6)

      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = '#475569'
      ctx.fillText('შევსება', cx, CHAM_Y + CHAM_H / 2 + 22)

      ctx.textAlign = 'left'
    }

    const updateAndDrawParticles = () => {
      const attractRange = 200 * (power / 100)

      // Remove off-screen
      particlesRef.current = particlesRef.current.filter(p => p.x < PIPE_X_END + 8 && p.opacity > 0.05)

      // Spawn
      if (particlesRef.current.length < 40 && Math.random() < 0.4) {
        particlesRef.current.push(spawnParticle(W, PIPE_Y, PIPE_H, PIPE_X_START))
      }

      particlesRef.current.forEach(p => {
        // Acoustic attraction when running
        if (isRunning) {
          const dx = RING_X - p.x
          const dy = RING_Y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < attractRange) {
            const force = (1 - dist / attractRange) * 0.18 * (power / 100)
            p.vy += (dy / dist) * force
            p.vx += (dx / dist) * force * 0.35
          }
        }

        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.97

        // Bounce off pipe walls
        if (p.y < PIPE_Y + p.r)          { p.y = PIPE_Y + p.r;          p.vy *= -0.45 }
        if (p.y > PIPE_Y + PIPE_H - p.r) { p.y = PIPE_Y + PIPE_H - p.r; p.vy *= -0.45 }

        // Fade out near end
        if (p.x > PIPE_X_END - 20) p.opacity -= 0.04

        // Draw
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.restore()
      })
    }

    const draw = () => {
      drawBackground()
      drawPipe()
      drawAquaRing()
      drawChamber()
      updateAndDrawParticles()
      tRef.current += 0.016
      rafRef.current = requestAnimationFrame(draw)
    }

    cancelAnimationFrame(rafRef.current)
    draw()
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isFlushing, selectedPollutant, power, flowRate, tankLevel, spawnParticle])

  const modeInfo = MODE_LABELS[mode] || { color: '#64748b', label: mode }

  return (
    <section
      id="simulation"
      style={{ background: 'linear-gradient(180deg, #081426 0%, #040d18 100%)', paddingTop: 0 }}
    >
      <div className="section-wrap">
        {/* Section header */}
        <div className="mb-10">
          <span className="section-label">ვიზუალური სიმულაცია</span>
          <h2 className="section-title">სიმულაციის გარემო</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            AquaRing-ის მუშაობის ვიზუალური დემონსტრაცია — დააკვირდით, როგორ ამუშავდება
            აკუსტიკური გამწმენდი სისტემა წყლის მილში.
          </p>
        </div>

        {/* Canvas card */}
        <div
          className="glass-card overflow-hidden"
          style={{ position: 'relative', padding: '1.5rem 1.5rem 1rem' }}
        >
          {/* Status row above canvas */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isRunning ? '#22c55e' : '#ef4444',
                  boxShadow: isRunning ? '0 0 8px #22c55e' : 'none',
                  animation: isRunning ? 'pulse-glow 1.4s ease-in-out infinite' : 'none',
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
                {isRunning ? 'სისტემა აქტიურია' : 'სისტემა გათიშულია'}
              </span>
              <span
                style={{
                  padding: '0.18rem 0.7rem',
                  borderRadius: 999,
                  background: `${modeInfo.color}18`,
                  border: `1px solid ${modeInfo.color}44`,
                  color: modeInfo.color,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                რეჟიმი: {modeInfo.label}
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {[
                { color: '#ea580c', label: 'ჟანგი' },
                { color: '#ca8a04', label: 'ნალექი' },
                { color: '#7c3aed', label: 'მიკრონაწილაკი' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5" style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block', boxShadow: `0 0 4px ${l.color}` }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div style={{ overflowX: 'auto' }}>
            <canvas
              ref={canvasRef}
              width={1000}
              height={330}
              style={{
                width: '100%', height: 'auto',
                minWidth: 340,
                display: 'block',
                borderRadius: 10,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
