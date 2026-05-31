import { useRef } from 'react'

const POLLUTANTS = [
  { value: 'rust',         label: 'ჟანგი',                              icon: '🔶', color: '#ea580c', desc: 'Fe₂O₃ ნაწილაკები' },
  { value: 'sediment',     label: 'ნალექი და ქვიშა',                    icon: '🟡', color: '#ca8a04', desc: 'მძიმე დეპოზიტები' },
  { value: 'microplastic', label: 'მიკრონაწილაკები',                    icon: '🔵', color: '#7c3aed', desc: 'μ-plastic ფრაქცია' },
  { value: 'mixed',        label: 'შერეული დაბინძურება',                icon: '⚗️',  color: '#00d4ff', desc: 'ყველა ტიპი ერთად' },
]

const Slider = ({ label, value, min, max, step, onChange, unit, displayValue, hint }) => {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}>{label}</label>
        <span
          style={{
            padding: '0.2rem 0.65rem',
            borderRadius: 999,
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.25)',
            color: '#00d4ff',
            fontSize: '0.78rem',
            fontWeight: 700,
            minWidth: 68,
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayValue ?? value} {unit}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        {/* Track fill */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            height: 6,
            width: `${pct}%`,
            borderRadius: 99,
            background: 'linear-gradient(90deg, #0ea5e9, #00d4ff)',
            boxShadow: '0 0 10px rgba(0,212,255,0.45)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ position: 'relative', zIndex: 2, background: 'transparent' }}
        />
      </div>
      {hint && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
          <span style={{ color: '#334155', fontSize: '0.66rem' }}>{min} {unit}</span>
          <span style={{ color: '#475569', fontSize: '0.66rem', fontStyle: 'italic' }}>{hint}</span>
          <span style={{ color: '#334155', fontSize: '0.66rem' }}>{max} {unit}</span>
        </div>
      )}
    </div>
  )
}

export default function ControlPanel({ state, actions }) {
  const { selectedPollutant, flowRate, pipeDiameter, frequency, power, isRunning, isFlushing } = state
  const { setSelectedPollutant, setFlowRate, setPipeDiameter, setFrequency, setPower, startRing, stopRing, flushTank, refreshData } = actions

  const audioCtxRef = useRef(null)

  const playSound = () => {
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      const actx = audioCtxRef.current

      const makeBeep = (freq1, freq2, delay, dur) => {
        const osc = actx.createOscillator()
        const gain = actx.createGain()
        osc.connect(gain); gain.connect(actx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq1, actx.currentTime + delay)
        osc.frequency.exponentialRampToValueAtTime(freq2, actx.currentTime + delay + dur)
        gain.gain.setValueAtTime(0.14, actx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + delay + dur)
        osc.start(actx.currentTime + delay)
        osc.stop(actx.currentTime + delay + dur + 0.05)
      }
      makeBeep(440, 880, 0, 0.25)
      makeBeep(660, 1320, 0.1, 0.3)
      makeBeep(880, 440, 0.3, 0.25)
    } catch {}
  }

  return (
    <section style={{ background: '#081426' }}>
      <div className="section-wrap">
        <div className="mb-10">
          <span className="section-label">მართვის პანელი</span>
          <h2 className="section-title">პარამეტრების კონფიგურაცია</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            შეარჩიეთ დაბინძურების ტიპი, მოარგეთ ნაკადის სიჩქარე, მილის დიამეტრი და აკუსტიკური პარამეტრები.
          </p>
        </div>

        <div
          style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          {/* ── Pollution type ── */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem' }}>
              <div style={{ width: 6, height: 20, borderRadius: 3, background: 'linear-gradient(180deg,#00d4ff,#0ea5e9)' }} />
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.92rem' }}>დაბინძურების ტიპი</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {POLLUTANTS.map(p => {
                const active = selectedPollutant === p.value
                return (
                  <button
                    key={p.value}
                    onClick={() => setSelectedPollutant(p.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.7rem 1rem',
                      borderRadius: 12,
                      border: `1.5px solid ${active ? p.color : 'rgba(255,255,255,0.06)'}`,
                      background: active ? `${p.color}18` : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      boxShadow: active ? `0 0 16px ${p.color}22, inset 0 0 0 1px ${p.color}15` : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: active ? '#fff' : '#94a3b8', fontWeight: active ? 700 : 500, fontSize: '0.875rem', lineHeight: 1.3 }}>
                        {p.label}
                      </div>
                      <div style={{ color: active ? p.color : '#334155', fontSize: '0.68rem', marginTop: 1 }}>{p.desc}</div>
                    </div>
                    {active && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 8px ${p.color}`, flexShrink: 0 }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Flow & Pipe ── */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.4rem' }}>
              <div style={{ width: 6, height: 20, borderRadius: 3, background: 'linear-gradient(180deg,#0ea5e9,#6366f1)' }} />
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.92rem' }}>ნაკადის პარამეტრები</h3>
            </div>
            <Slider
              label="წყლის ნაკადის სიჩქარე"
              value={flowRate} min={0.2} max={2.0} step={0.1}
              unit="ლ/წმ" displayValue={flowRate.toFixed(1)}
              hint="მაღალი სიჩქარე ამცირებს ეფექტიანობას"
              onChange={setFlowRate}
            />
            <Slider
              label="მილის შიდა დიამეტრი"
              value={pipeDiameter} min={20} max={50} step={1}
              unit="მმ"
              hint="გავლენა: საწყისი სიხშირე"
              onChange={setPipeDiameter}
            />
          </div>

          {/* ── Acoustics ── */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.4rem' }}>
              <div style={{ width: 6, height: 20, borderRadius: 3, background: 'linear-gradient(180deg,#a78bfa,#7c3aed)' }} />
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.92rem' }}>აკუსტიკური პარამეტრები</h3>
            </div>
            <Slider
              label="აკუსტიკური სიხშირე"
              value={frequency} min={20} max={500} step={1}
              unit="კჰც"
              hint="რეკომენდებული: f ≈ v/2D"
              onChange={setFrequency}
            />
            <Slider
              label="აკუსტიკური სიმძლავრე"
              value={power} min={10} max={100} step={1}
              unit="%"
              onChange={setPower}
            />
            {/* Power bar */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#475569', fontSize: '0.68rem' }}>სიმძლავრის ინდიკატორი</span>
                <span style={{ color: power > 70 ? '#22c55e' : power > 40 ? '#f59e0b' : '#ef4444', fontSize: '0.68rem', fontWeight: 700 }}>
                  {power > 70 ? 'მაღალი' : power > 40 ? 'საშუალო' : 'დაბალი'}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${power}%`,
                    background: power > 70
                      ? 'linear-gradient(90deg,#059669,#22c55e)'
                      : power > 40
                        ? 'linear-gradient(90deg,#d97706,#f59e0b)'
                        : 'linear-gradient(90deg,#dc2626,#ef4444)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="glass-card" style={{ padding: '1.8rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem' }}>
            <div style={{ width: 6, height: 20, borderRadius: 3, background: 'linear-gradient(180deg,#22c55e,#16a34a)' }} />
            <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.92rem' }}>მართვა</h3>
          </div>

          {/* Sound note */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              padding: '0.75rem 1rem',
              borderRadius: 10,
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.14)',
              marginBottom: '1.2rem',
              fontSize: '0.78rem',
              color: '#64748b',
              lineHeight: 1.7,
            }}
          >
            <span style={{ color: '#00d4ff', fontSize: '1rem', flexShrink: 0 }}>♪</span>
            <span>
              <strong style={{ color: '#94a3b8' }}>ხმის შესახებ: </strong>
              რეალურ მოწყობილობაში ულტრაბგერა ადამიანის ყურისთვის არ ისმის;
              ვებსაიტზე ხმა დამატებულია მხოლოდ სიმულაციის აღსაქმელად.
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              className="btn-primary"
              onClick={() => { playSound(); startRing() }}
              disabled={isRunning}
            >
              ⚡ AquaRing-ის ჩართვა
            </button>
            <button className="btn-danger" onClick={stopRing} disabled={!isRunning}>
              ■ სიმულაციის გაჩერება
            </button>
            <button className="btn-warning" onClick={flushTank} disabled={isFlushing}>
              ↻ თვითწმენდის რეჟიმი
            </button>
            <button className="btn-secondary" onClick={refreshData}>
              ⟳ მონაცემების განახლება
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
