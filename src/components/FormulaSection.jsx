import { useMemo } from 'react'

const GlowBar = ({ pct, color }) => (
  <div
    style={{
      height: 10,
      borderRadius: 99,
      background: 'rgba(255,255,255,0.06)',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${pct}%`,
        borderRadius: 99,
        background: `linear-gradient(90deg, ${color}99, ${color})`,
        boxShadow: `0 0 14px ${color}88`,
        transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 5,
          height: '130%',
          background: 'rgba(255,255,255,0.55)',
          borderRadius: 99,
        }}
      />
    </div>
  </div>
)

const InfoRow = ({ label, value, color, sub }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.65rem 0.9rem',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '0.55rem',
    }}
  >
    <div>
      <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{label}</div>
      {sub && <div style={{ color: '#334155', fontSize: '0.67rem', marginTop: 1 }}>{sub}</div>}
    </div>
    <span style={{ color, fontWeight: 800, fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
  </div>
)

export default function FormulaSection({ pipeDiameter, frequency, efficiency, isRunning }) {
  const diamM = pipeDiameter / 1000
  const recommended = useMemo(() => 1480 / (2 * diamM), [diamM])
  const recommendedKhz = (recommended / 1000).toFixed(1)
  const selectedFreqHz = frequency * 1000
  const diff = Math.abs(selectedFreqHz - recommended)
  const matchPct = Math.round(Math.max(0, 100 - (diff / recommended) * 100))

  const matchColor = matchPct >= 80 ? '#22c55e' : matchPct >= 50 ? '#f59e0b' : '#ef4444'
  const matchLabel = matchPct >= 80 ? 'შესანიშნავი' : matchPct >= 50 ? 'საშუალო' : 'დაბალი'

  return (
    <section id="formula" style={{ background: 'linear-gradient(180deg, #040d18 0%, #081426 100%)' }}>
      <div className="section-wrap">
        <div className="mb-10">
          <span className="section-label">სამეცნიერო გამოთვლა</span>
          <h2 className="section-title">სიხშირის გამოთვლა</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            AquaRing-ის საწყისი სამუშაო სიხშირე გამოითვლება მილის შიდა დიამეტრიდან.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))' }}>

          {/* ── Formula card ── */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
              <div style={{ width: 6, height: 20, borderRadius: 3, background: 'linear-gradient(180deg,#a78bfa,#6366f1)' }} />
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.92rem' }}>ფორმულა</h3>
            </div>

            {/* Big formula display */}
            <div
              style={{
                borderRadius: 14,
                padding: '1.8rem 1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(0,212,255,0.06) 60%, transparent 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative rings */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <p
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 900,
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.1em',
                  lineHeight: 1.2,
                  position: 'relative',
                  background: 'linear-gradient(135deg, #ffffff 30%, #a78bfa 65%, #00d4ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                f ≈ v / 2D
              </p>
            </div>

            {/* Variable explanations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.4rem' }}>
              {[
                { sym: 'v', desc: 'ბგერის სიჩქარე წყალში', value: '≈ 1480 მ/წმ', color: '#67e8f9' },
                { sym: 'D', desc: 'მილის შიდა დიამეტრი', value: 'მეტრებში', color: '#a78bfa' },
                { sym: 'f', desc: 'საწყისი სამუშაო სიხშირე', value: 'ჰერცებში', color: '#34d399' },
              ].map(item => (
                <div
                  key={item.sym}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 10,
                    background: `${item.color}0a`,
                    border: `1px solid ${item.color}1a`,
                  }}
                >
                  <span style={{ color: item.color, fontWeight: 900, fontSize: '1.2rem', fontFamily: 'Georgia, serif', minWidth: 18, textAlign: 'center' }}>
                    {item.sym}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>— {item.desc}</span>
                  </div>
                  <span style={{ color: item.color, fontSize: '0.72rem', fontWeight: 600, opacity: 0.7 }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Example note */}
            <div
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 10,
                background: 'rgba(103,232,249,0.06)',
                border: '1px solid rgba(103,232,249,0.14)',
                fontSize: '0.8rem',
                color: '#64748b',
                lineHeight: 1.75,
              }}
            >
              <strong style={{ color: '#67e8f9' }}>მაგალითი: </strong>
              მილის შიდა დიამეტრი 25 მმ → f = 1480 / (2 × 0.025) ≈{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>29.6 კჰც</span>
            </div>
          </div>

          {/* ── Live calculation card ── */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
              <div style={{ width: 6, height: 20, borderRadius: 3, background: 'linear-gradient(180deg,#34d399,#059669)' }} />
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.92rem' }}>ცოცხალი გამოთვლა</h3>
            </div>

            <InfoRow
              label="მილის შიდა დიამეტრი"
              value={`${pipeDiameter} მმ`}
              sub={`= ${diamM.toFixed(3)} მ`}
              color="#a78bfa"
            />
            <InfoRow
              label="რეკომენდებული სიხშირე (f = v/2D)"
              value={`${recommendedKhz} კჰც`}
              color="#34d399"
            />
            <InfoRow
              label="არჩეული სიხშირე"
              value={`${frequency} კჰც`}
              color="#67e8f9"
            />

            {/* Match meter */}
            <div
              style={{
                padding: '1rem',
                borderRadius: 12,
                background: `${matchColor}0a`,
                border: `1px solid ${matchColor}22`,
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>სიხშირის შესაბამისობა</span>
                <span style={{ color: matchColor, fontWeight: 800, fontSize: '1rem' }}>
                  {matchPct}% — <span style={{ fontSize: '0.8rem' }}>{matchLabel}</span>
                </span>
              </div>
              <GlowBar pct={matchPct} color={matchColor} />
            </div>

            {/* Efficiency meter */}
            <div
              style={{
                padding: '1rem',
                borderRadius: 12,
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.15)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>სიმულირებული წმენდის ეფექტიანობა</span>
                <span style={{ color: isRunning ? '#00d4ff' : '#334155', fontWeight: 900, fontSize: '1.2rem' }}>
                  {isRunning ? `${efficiency}%` : '—'}
                </span>
              </div>
              <GlowBar pct={isRunning ? efficiency : 0} color="#00d4ff" />
              {!isRunning && (
                <p style={{ color: '#334155', fontSize: '0.72rem', marginTop: 6, textAlign: 'center' }}>
                  ეფექტიანობის სანახავად ჩართეთ AquaRing
                </p>
              )}
            </div>

            {/* Prototype note */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 10,
                background: 'rgba(251,191,36,0.06)',
                border: '1px solid rgba(251,191,36,0.18)',
                fontSize: '0.75rem',
                color: '#64748b',
                lineHeight: 1.75,
              }}
            >
              <strong style={{ color: '#fbbf24' }}>შენიშვნა: </strong>
              ეს გამოთვლა წარმოადგენს საწყის მოდელს. რეალურ პროტოტიპში სიხშირე
              ექსპერიმენტულად დაზუსტდება.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
