import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Heart, Award, Users, Code2, Coffee } from 'lucide-react'

const TEAM = [
  { name: 'Velora Dev', role: 'CEO & Lead Developer', bio: 'Passionné par les solutions logicielles innovantes depuis plus de 5 ans.' },
  { name: 'Marie R.', role: 'CTO & Architecte', bio: 'Experte en architecture distribuée et systèmes haute disponibilité.' },
  { name: 'Jean-Paul M.', role: 'UI/UX Designer', bio: 'Crée des interfaces intuitives qui transforment l\'expérience utilisateur.' },
]

const TIMELINE = [
  { year: '2019', event: 'Fondation de Velora à Antananarivo' },
  { year: '2020', event: 'Premiers projets ERP pour PME malgaches' },
  { year: '2021', event: 'Lancement de NexaFlow — logiciel phare' },
  { year: '2022', event: 'Expansion régionale : Réunion, Maurice' },
  { year: '2023', event: 'Intégration IA dans nos solutions' },
  { year: '2024', event: '50+ clients, 100+ projets livrés' },
]

export default function AProposPage() {
  return (
    <main style={{ paddingTop: 80 }}>
      {/* HERO */}
      <section className="section grid-bg" style={{ paddingTop: 60 }}>
        <div className="container">
          <div style={{ maxWidth: 700 }}>
            <div className="badge" style={{ marginBottom: 20 }}>À PROPOS DE NOUS</div>
            <h1 className="heading" style={{ marginBottom: 20 }}>
              Construire le <span className="glow">futur numérique</span> de Madagascar
            </h1>
            <p style={{ color: 'var(--white-dim)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 32 }}>
              Velora est une entreprise de développement logiciel fondée à Antananarivo. 
              Notre mission : rendre la technologie de pointe accessible aux entreprises africaines.
              Nous croyons que chaque entreprise mérite des outils numériques à la hauteur de ses ambitions.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Travaillons ensemble <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="heading">Nos <span className="glow">valeurs</span></h2>
          </div>
          <div className="grid-3">
            {[
              { icon: Target, title: 'Excellence', desc: 'Chaque ligne de code est écrite avec précision et attention au détail.' },
              { icon: Eye, title: 'Transparence', desc: 'Communication honnête à chaque étape de votre projet.' },
              { icon: Heart, title: 'Passion', desc: 'Nous aimons ce que nous faisons. Cela se voit dans nos réalisations.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: 36, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'var(--cyan-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Icon size={28} color="var(--cyan)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 12 }}>{title}</h3>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px 0', background: 'rgba(0,245,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { icon: Code2, val: '50+', label: 'Projets livrés' },
              { icon: Users, val: '40+', label: 'Clients actifs' },
              { icon: Award, val: '5+', label: 'Ans d\'expérience' },
              { icon: Coffee, val: '∞', label: 'Cafés bus' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label}>
                <Icon size={24} color="var(--cyan)" style={{ marginBottom: 12 }} />
                <div className="stat-value">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="heading">Notre <span className="glow">histoire</span></h2>
          </div>
          <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 72, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
            {TIMELINE.map(({ year, event }, i) => (
              <div key={year} style={{ display: 'flex', gap: 32, marginBottom: 32, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--cyan)', width: 56, flexShrink: 0, textAlign: 'right', paddingTop: 3 }}>{year}</div>
                <div style={{ width: 12, height: 12, background: 'var(--cyan)', borderRadius: '50%', flexShrink: 0, marginTop: 5, boxShadow: '0 0 12px var(--cyan-glow)' }} />
                <p style={{ color: 'var(--white-dim)', paddingTop: 2, fontSize: '0.95rem' }}>{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section" style={{ background: 'rgba(0,245,255,0.02)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="heading">Notre <span className="glow">équipe</span></h2>
            <p style={{ color: 'var(--white-dim)', marginTop: 12 }}>Des experts passionnés à votre service</p>
          </div>
          <div className="grid-3" style={{ maxWidth: 900, margin: '0 auto' }}>
            {TEAM.map(m => (
              <div key={m.name} className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--cyan-dim), var(--accent-glow))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--cyan)' }}>
                  {m.name[0]}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 4 }}>{m.name}</h3>
                <div className="mono" style={{ marginBottom: 12, opacity: 0.8 }}>{m.role}</div>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
