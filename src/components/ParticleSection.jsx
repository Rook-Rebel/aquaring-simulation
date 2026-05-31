const PARTICLES = [
  {
    title: 'ჟანგი და კოროზიული ნარჩენები',
    color: '#ea580c',
    gradient: 'linear-gradient(135deg, #7c2d12, #c2410c)',
    icon: '🔶',
    badge: 'Fe₂O₃',
    badgeColor: '#fb923c',
    text: 'ძველ ან დაზიანებულ მილებში კოროზიის შედეგად წარმოიქმნება რკინის ოქსიდის ნაწილაკები, რომლებიც წყალს მოყავისფრო ფერს აძლევს და გემოს ცვლის.',
    dots: ['#c2410c', '#ea580c', '#b45309', '#9a3412'],
  },
  {
    title: 'ნალექი და ქვიშა',
    color: '#ca8a04',
    gradient: 'linear-gradient(135deg, #78350f, #b45309)',
    icon: '🟡',
    badge: 'SiO₂ / ნალექი',
    badgeColor: '#fbbf24',
    text: 'წყლის მიწოდების შეწყვეტა-აღდგენის შემდეგ მილში დაგროვილი მძიმე ნაწილაკები ირყევა და წყლის ნაკადთან ერთად მოძრაობს, აბინძურებს სასმელ წყალს.',
    dots: ['#92400e', '#ca8a04', '#78716c', '#a16207'],
  },
  {
    title: 'მიკრონაწილაკები',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #312e81, #6d28d9)',
    icon: '🔵',
    badge: 'μ-particles',
    badgeColor: '#a78bfa',
    text: 'მიკრონაწილაკები თანამედროვე წყლის სისტემებში გლობალური კვლევითი პრობლემაა. AquaRing-ის სიმულაცია ასახავს, თუ როგორ შეიძლება აკუსტიკურმა ველმა ხელი შეუწყოს მათ კონცენტრირებას.',
    dots: ['#7c3aed', '#6d28d9', '#4f46e5', '#2563eb'],
  },
]

export default function ParticleSection() {
  return (
    <section style={{ background: '#040d18' }}>
      <div className="section-wrap">
        <div className="mb-10">
          <span className="section-label">დაბინძურების ტიპები</span>
          <h2 className="section-title">სამი ძირითადი დამაბინძურებელი</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            AquaRing-ის სიმულაცია მოიცავს სამი ტიპის ნაწილაკს, რომლებიც ხშირად გვხვდება
            ურბანულ წყლის სისტემებში.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
          {PARTICLES.map((p, i) => (
            <div
              key={p.title}
              className="glass-card"
              style={{
                padding: '1.6rem',
                borderColor: `${p.color}28`,
                animation: `fade-in-up 0.5s ${i * 0.1}s ease both`,
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 22px 44px rgba(0,0,0,0.42), 0 0 24px ${p.color}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Background glow */}
              <div
                style={{
                  position: 'absolute',
                  top: -30, right: -30,
                  width: 120, height: 120,
                  borderRadius: '50%',
                  background: `${p.color}08`,
                  pointerEvents: 'none',
                }}
              />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <div
                  style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: p.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                    boxShadow: `0 4px 18px ${p.color}44`,
                  }}
                >
                  {p.icon}
                </div>
                <span
                  style={{
                    padding: '0.2rem 0.7rem',
                    borderRadius: 999,
                    background: `${p.badgeColor}15`,
                    border: `1px solid ${p.badgeColor}30`,
                    color: p.badgeColor,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {p.badge}
                </span>
              </div>

              <h3 style={{ color: '#f0f9ff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.65rem', lineHeight: 1.4 }}>
                {p.title}
              </h3>

              <p style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                {p.text}
              </p>

              {/* Particle dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.dots.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 7 + idx * 2.5,
                      height: 7 + idx * 2.5,
                      borderRadius: '50%',
                      background: c,
                      boxShadow: `0 0 7px ${c}99`,
                      opacity: 0.85,
                    }}
                  />
                ))}
                <span style={{ color: '#334155', fontSize: '0.65rem', marginLeft: 4 }}>ნაწილაკები</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
