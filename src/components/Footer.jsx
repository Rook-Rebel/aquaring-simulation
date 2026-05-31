const NAV_LINKS = [
  { href: '#simulation', label: 'სიმულაცია' },
  { href: '#formula',    label: 'გამოთვლა' },
  { href: '#dashboard',  label: 'მონაცემები' },
  { href: '#research',   label: 'კვლევა' },
  { href: '#how-it-works', label: 'მუშაობა' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #040d18 0%, #020c18 100%)',
        borderTop: '1px solid rgba(0,212,255,0.1)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '4rem 2rem 2.5rem' }}>

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gap: '2.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.8rem' }}>
              <svg viewBox="0 0 44 44" width="38" height="38" fill="none"
                style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }}>
                <circle cx="22" cy="22" r="18" stroke="#00d4ff" strokeWidth="3.5" />
                <circle cx="22" cy="22" r="12" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
                <circle cx="22" cy="22" r="5" fill="#00d4ff" />
              </svg>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #fff, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AquaRing
              </span>
            </div>
            <p style={{ color: '#334155', fontSize: '0.8rem', lineHeight: 1.75 }}>
              ჭკვიანი აკუსტიკური<br />წყლის გამწმენდი რგოლი
            </p>
            <p style={{ color: '#1e3a5f', fontSize: '0.72rem', marginTop: 6 }}>
              გუნდი{' '}
              <span style={{ color: '#00d4ff', fontWeight: 700 }}>Waveflow</span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: '#1e3a5f', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
              ნავიგაცია
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    style={{
                      color: '#334155',
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      transition: 'color 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                  >
                    → {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <h4 style={{ color: '#1e3a5f', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
              პროექტის ტიპი
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {['STEM პროექტი', 'საგანმანათლებლო სიმულაცია', 'საკონკურსო ნამუშევარი', 'წყლის ტექნოლოგია'].map(t => (
                <span
                  key={t}
                  style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.75rem',
                    borderRadius: 999,
                    background: 'rgba(0,212,255,0.07)',
                    border: '1px solid rgba(0,212,255,0.14)',
                    color: '#334155',
                    fontSize: '0.72rem',
                    width: 'fit-content',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)', marginBottom: '1.5rem' }} />

        {/* Disclaimer */}
        <div
          style={{
            padding: '1rem 1.2rem',
            borderRadius: 12,
            background: 'rgba(251,191,36,0.04)',
            border: '1px solid rgba(251,191,36,0.14)',
            fontSize: '0.75rem',
            color: '#334155',
            lineHeight: 1.8,
            marginBottom: '1.5rem',
          }}
        >
          <strong style={{ color: '#78350f' }}>⚠ განმარტება: </strong>
          ეს ვებსაიტი წარმოადგენს AquaRing-ის კონცეფციის სიმულაციას. მონაცემები არის
          მოდელირებული და არ წარმოადგენს რეალურ ლაბორატორიულ ან სერტიფიცირებულ შედეგს.
          რეალური ეფექტიანობის დასადგენად საჭიროა პროტოტიპის ტესტირება და წყლის ანალიზი.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            color: '#1e3a5f',
          }}
        >
          <span>AquaRing — საგანმანათლებლო და საკონკურსო სიმულაცია</span>
          <span>
            გუნდი <span style={{ color: '#00d4ff', fontWeight: 700 }}>Waveflow</span> · 2025–2026
          </span>
        </div>
      </div>
    </footer>
  )
}
