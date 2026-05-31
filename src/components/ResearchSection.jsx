const RESEARCH = [
  {
    n: '01',
    icon: '🏙️',
    color: '#00d4ff',
    title: 'წყლის ინფრასტრუქტურული პრობლემა საქართველოში',
    text: 'პროექტის იდეა უკავშირდება რუსთავსა და სხვა ქალაქებში წყლის მიწოდების შეფერხებებს, ძველი მილების რეაბილიტაციას და წყლის აღდგენის შემდეგ ნალექიანი წყლის პრობლემას.',
    sources: ['ადგილობრივი პრობლემა'],
  },
  {
    n: '02',
    icon: '🌍',
    color: '#a78bfa',
    title: 'მიკროპლასტმასები წყლის სისტემებში',
    text: 'მიკროპლასტმასები თანამედროვე წყლის სისტემებში მნიშვნელოვან საკვლევ თემად განიხილება, რადგან მცირე ნაწილაკები შეიძლება მოხვდეს როგორც გარემოში, ისე სასმელი წყლის ციკლში.',
    sources: ['WHO', 'Nature Water Journal'],
  },
  {
    n: '03',
    icon: '🔬',
    color: '#34d399',
    title: 'აკუსტიკური ფოკუსირება ნაწილაკების სეპარაციისთვის',
    text: 'Shinshu University-ის და სხვა უნივერსიტეტების კვლევები აჩვენებს, რომ ხმის ტალღებით შესაძლებელია მცირე ნაწილაკების არაინვაზიური გადაადგილება, კონცენტრირება და სეპარაცია.',
    sources: ['Shinshu University', 'Acoustic focusing studies'],
  },
  {
    n: '04',
    icon: '💡',
    color: '#fbbf24',
    title: 'AquaRing-ის ჰიპოთეზა',
    text: 'ჩვენი ჰიპოთეზაა, რომ მილის გარედან შექმნილი აკუსტიკური ველი შეძლებს წყლის ნაკადში არსებული ჟანგის, ნალექისა და მიკრონაწილაკების ერთ ზონაში დაგროვებას — ინვაზიური ჩარევის გარეშე.',
    sources: ['MIT Research', 'AquaRing სიმულაცია'],
  },
]

const SOURCE_COLORS = {
  'WHO': '#00d4ff',
  'Shinshu University': '#34d399',
  'MIT Research': '#a78bfa',
  'Nature Water Journal': '#67e8f9',
  'Acoustic focusing studies': '#fb923c',
  'ადგილობრივი პრობლემა': '#fbbf24',
  'AquaRing სიმულაცია': '#64748b',
}

export default function ResearchSection() {
  return (
    <section id="research" style={{ background: 'linear-gradient(180deg, #040d18 0%, #081426 100%)' }}>
      <div className="section-wrap">
        <div className="mb-10">
          <span className="section-label">კვლევითი საფუძველი</span>
          <h2 className="section-title">კვლევა და მოტივაცია</h2>
          <div className="accent-line" />
          <p className="section-subtitle">
            AquaRing-ის კონცეფცია ეყრდნობა რეალურ სამეცნიერო კვლევებს, ადგილობრივ
            ინფრასტრუქტურულ გამოწვევებსა და გლობალური ჯანდაცვის ორგანიზაციების შეფასებებს.
          </p>
        </div>

        <div
          style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          {RESEARCH.map((r, i) => (
            <div
              key={r.n}
              className="glass-card"
              style={{
                padding: '1.6rem',
                borderLeft: `3px solid ${r.color}`,
                animation: `fade-in-up 0.55s ${i * 0.09}s ease both`,
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 24px ${r.color}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Card top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: 42, height: 42, borderRadius: 11,
                    background: `${r.color}14`,
                    border: `1px solid ${r.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0,
                  }}
                >
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: r.color, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 2, opacity: 0.7 }}>
                    #{r.n}
                  </div>
                  <h4 style={{ color: '#f0f9ff', fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.4 }}>
                    {r.title}
                  </h4>
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                {r.text}
              </p>

              {/* Source chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {r.sources.map(s => (
                  <span
                    key={s}
                    style={{
                      padding: '0.18rem 0.65rem',
                      borderRadius: 999,
                      background: `${SOURCE_COLORS[s] || '#64748b'}12`,
                      border: `1px solid ${SOURCE_COLORS[s] || '#64748b'}28`,
                      color: SOURCE_COLORS[s] || '#64748b',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom source bar */}
        <div
          className="glass-card"
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.4rem',
            borderColor: 'rgba(0,212,255,0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            წყაროები:
          </span>
          {Object.entries(SOURCE_COLORS).slice(0, 5).map(([s, c]) => (
            <span
              key={s}
              style={{
                padding: '0.18rem 0.65rem',
                borderRadius: 999,
                background: `${c}10`,
                border: `1px solid ${c}25`,
                color: c,
                fontSize: '0.65rem',
                fontWeight: 600,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
