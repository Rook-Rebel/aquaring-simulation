const STEPS = [
  {
    n: '01', icon: '💧', color: '#0ea5e9',
    title: 'წყალი შედის მილში',
    desc: 'საქალაქო ქსელიდან წყალი შედის მილში და იწყებს მოძრაობას ნაკადის სიჩქარით.',
  },
  {
    n: '02', icon: '🔶', color: '#f59e0b',
    title: 'ნაკადში მოძრობს დამაბინძურებლები',
    desc: 'ნაკადთან ერთად მოძრაობს ჟანგის, ნალექის ან მიკრონაწილაკების ფრაქცია.',
  },
  {
    n: '03', icon: '◎', color: '#00d4ff',
    title: 'AquaRing ააქტიურებს ველს',
    desc: 'მილის გარედან AquaRing ააქტიურდება და ქმნის აკუსტიკურ ველს მილის გარშემო.',
  },
  {
    n: '04', icon: '〜', color: '#a78bfa',
    title: 'ბგერის ტალღები კონცენტრირებს ნაწილაკებს',
    desc: 'ულტრაბგერული ტალღები მიმართავს ნაწილაკებს ერთ ფოკუსურ ზონაში — გვერდის მხარეს.',
  },
  {
    n: '05', icon: '⬇', color: '#fb923c',
    title: 'ნაწილაკები გადადის კამერაში',
    desc: 'კონცენტრირებული ნაწილაკები გადადის გვერდითი მილის გავლით ნალექის კამერაში.',
  },
  {
    n: '06', icon: '✓', color: '#34d399',
    title: 'სუფთა წყალი განაგრძობს მოძრაობას',
    desc: 'ნაწილაკებისგან განთავისუფლებული, გამჭვირვალე წყალი განაგრძობს გზას ძირითად ნაკადში.',
  },
  {
    n: '07', icon: '↻', color: '#67e8f9',
    title: 'კამერა ირეცხება ავტომატურად',
    desc: 'დაგროვილი ნალექი თვითწმენდის რეჟიმის გააქტიურებით ამოიტუმბება კამერიდან.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: 'linear-gradient(180deg, #040d18 0%, #081426 100%)' }}>
      <div className="section-wrap">
        <div className="mb-12">
          <span className="section-label">მუშაობის პრინციპი</span>
          <h2 className="section-title">როგორ მუშაობს AquaRing?</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            7 ნაბიჯი — AquaRing-ის სრული ციკლი წყლის მოწოდებიდან გამწმენდ ნაკადამდე.
          </p>
        </div>

        {/* Two-column grid on desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="glass-card"
              style={{
                padding: '1.2rem 1.4rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                borderLeft: `3px solid ${s.color}`,
                animation: `fade-in-up 0.5s ${i * 0.07}s ease both`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 16px 36px rgba(0,0,0,0.38), 0 0 18px ${s.color}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Step number / icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${s.color}22, ${s.color}0d)`,
                  border: `1.5px solid ${s.color}44`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 14px ${s.color}22`,
                }}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{s.icon}</span>
                <span style={{ color: s.color, fontSize: '0.55rem', fontWeight: 800, marginTop: 2, letterSpacing: '0.04em' }}>
                  {s.n}
                </span>
              </div>

              <div>
                <h4
                  style={{
                    color: s.color,
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    marginBottom: '0.3rem',
                    lineHeight: 1.35,
                  }}
                >
                  {s.title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary note */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem 1.4rem',
            borderRadius: 12,
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.14)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>◎</span>
          <span>
            AquaRing-ის სრული ციკლი ხდება{' '}
            <strong style={{ color: '#00d4ff' }}>მილის გახსნის, ქიმიკატების ან ბადის გამოყენების გარეშე</strong>.
            ეს არის კონცეფტუალური სიმულაცია — პროტოტიპი ჯერ კვლევის ეტაპზეა.
          </span>
        </div>
      </div>
    </section>
  )
}
