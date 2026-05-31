import { useEffect, useRef } from 'react'

const useCountUp = (target, duration = 900) => {
  const elRef = useRef(null)
  const prevRef = useRef(0)
  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const start = prevRef.current
    const diff = target - start
    let t0 = null
    const tick = ts => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      el.textContent = Math.round(start + diff * ease)
      if (p < 1) requestAnimationFrame(tick)
      else prevRef.current = target
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return elRef
}

const GlowBar = ({ pct, color }) => (
  <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: 6 }}>
    <div
      style={{
        height: '100%',
        width: `${pct}%`,
        borderRadius: 99,
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        boxShadow: `0 0 10px ${color}66`,
        transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    />
  </div>
)

const DashCard = ({ title, value, suffix, prevValue, prevSuffix, color, icon, barPct, barColor, delay = 0 }) => {
  const numRef = useCountUp(typeof value === 'number' ? value : 0)
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.4rem 1.6rem',
        borderColor: `${color}28`,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        animation: `fade-in-up 0.5s ${delay}s ease both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          borderRadius: '0 18px 0 60px',
          background: `${color}0c`,
        }}
      />

      {/* Icon + title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
        <span style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.4, flex: 1, paddingRight: 8 }}>
          {title}
        </span>
        <span style={{ fontSize: '1.3rem', lineHeight: 1, opacity: 0.85 }}>{icon}</span>
      </div>

      {/* Main value */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: '0.3rem' }}>
        <span
          ref={typeof value === 'number' ? numRef : undefined}
          className="stat-num"
          style={{ color, lineHeight: 1 }}
        >
          {typeof value === 'number' ? value : value}
        </span>
        {suffix && <span style={{ color: '#64748b', fontSize: '0.9rem', paddingBottom: 3 }}>{suffix}</span>}
      </div>

      {/* Before/after */}
      {prevValue !== undefined && (
        <div style={{ fontSize: '0.72rem', color: '#334155', marginBottom: '0.4rem' }}>
          საწყისი:{' '}
          <span style={{ color: '#64748b' }}>{prevValue}{prevSuffix}</span>
          {typeof value === 'number' && typeof prevValue === 'number' && value < prevValue && (
            <span style={{ color: '#22c55e', marginLeft: 6 }}>
              ↓ {prevValue - value} {suffix}
            </span>
          )}
        </div>
      )}

      {/* Bar */}
      {barPct !== undefined && <GlowBar pct={barPct} color={barColor || color} />}
    </div>
  )
}

const MODE_CFG = {
  'ლოდინი':            { color: '#64748b', icon: '◌' },
  'აკუსტიკური წმენდა': { color: '#00d4ff', icon: '◉' },
  'თვითწმენდა':         { color: '#f59e0b', icon: '↻' },
  'გაჩერებულია':        { color: '#ef4444', icon: '■' },
}

export default function DataDashboard({ state }) {
  const { isRunning, efficiency, tankLevel, mode, selectedPollutant, power } = state

  const turbBefore = 82
  const turbAfter  = isRunning ? Math.max(6, Math.round(turbBefore * (1 - efficiency / 130))) : turbBefore
  const rustPct    = isRunning ? Math.round(efficiency * 0.9)  : 0
  const sedPct     = isRunning ? Math.round(efficiency * 0.85) : 0
  const microPct   = isRunning ? Math.round(efficiency * (selectedPollutant === 'microplastic' ? 1.0 : 0.75)) : 0
  const energy     = isRunning ? Math.round(18 + (power / 100) * 17) : 0
  const tank       = Math.round(tankLevel)

  const modeCfg = MODE_CFG[mode] || { color: '#64748b', icon: '◌' }

  return (
    <section id="dashboard" style={{ background: '#081426' }}>
      <div className="section-wrap">
        <div className="mb-10">
          <span className="section-label">მონაცემთა პანელი</span>
          <h2 className="section-title">სიმულირებული მაჩვენებლები</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            მონაცემები განახლდება რეალურ დროში AquaRing-ის გამართვის პარამეტრების მიხედვით.
          </p>
        </div>

        {/* Mode banner */}
        <div
          className="glass-card"
          style={{
            padding: '0.9rem 1.4rem',
            marginBottom: '1.5rem',
            borderColor: `${modeCfg.color}33`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: modeCfg.color,
              boxShadow: `0 0 12px ${modeCfg.color}`,
              flexShrink: 0,
              animation: mode === 'აკუსტიკური წმენდა' ? 'pulse-glow 1.4s ease-in-out infinite' : 'none',
            }}
          />
          <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.88rem' }}>
            მუშაობის რეჟიმი:
          </span>
          <span style={{ color: modeCfg.color, fontWeight: 800, fontSize: '0.95rem' }}>
            {modeCfg.icon} {mode}
          </span>
          {isRunning && (
            <span
              className="badge badge-cyan"
              style={{ marginLeft: 'auto', animation: 'pulse-glow 2s ease-in-out infinite' }}
            >
              LIVE
            </span>
          )}
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <DashCard
            title="წყლის მღვრიეობა"
            value={turbAfter} suffix=" NTU"
            prevValue={turbBefore} prevSuffix=" NTU"
            color="#00d4ff" icon="💧"
            barPct={(turbAfter / turbBefore) * 100}
            barColor={turbAfter < 40 ? '#22c55e' : '#f59e0b'}
            delay={0}
          />
          <DashCard
            title="ჟანგის ნაწილაკების შემცირება"
            value={rustPct} suffix="%"
            color="#fb923c" icon="🔶"
            barPct={rustPct} barColor="#ea580c"
            delay={0.05}
          />
          <DashCard
            title="ნალექის შემცირება"
            value={sedPct} suffix="%"
            color="#fbbf24" icon="🟡"
            barPct={sedPct} barColor="#ca8a04"
            delay={0.1}
          />
          <DashCard
            title="მიკრონაწილაკების კონცენტრირება"
            value={microPct} suffix="%"
            color="#a78bfa" icon="🔵"
            barPct={microPct} barColor="#7c3aed"
            delay={0.15}
          />
          <DashCard
            title="ნალექის კამერის შევსება"
            value={tank} suffix="%"
            color={tank > 70 ? '#f59e0b' : '#34d399'} icon="🧪"
            barPct={tank}
            barColor={tank > 70 ? '#d97706' : '#059669'}
            delay={0.2}
          />
          <DashCard
            title="სიმულირებული ენერგომოხმარება"
            value={energy} suffix=" W"
            color="#67e8f9" icon="⚡"
            delay={0.25}
          />
        </div>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.9rem 1.2rem',
            borderRadius: 12,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.18)',
            fontSize: '0.78rem',
            color: '#64748b',
            lineHeight: 1.75,
          }}
        >
          <span style={{ color: '#fbbf24', fontSize: '1rem', flexShrink: 0 }}>⚠</span>
          <span>
            <strong style={{ color: '#fbbf24' }}>მნიშვნელოვანი: </strong>
            მონაცემები არის სიმულაციური და არ წარმოადგენს სერტიფიცირებულ ლაბორატორიულ შედეგს.
            AquaRing არის კონცეფტუალური პროექტი. რეალური ეფექტიანობისთვის საჭიროა პროტოტიპის ტესტირება.
          </span>
        </div>
      </div>
    </section>
  )
}
