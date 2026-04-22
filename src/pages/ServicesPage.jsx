import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Smartphone, Globe, Database, Shield, Cloud, Cpu, BarChart3, CheckCircle } from 'lucide-react'

const SERVICES = [
  {
    icon: Globe, title: 'Développement Web', price: 'À partir de 500 000 Ar',
    desc: 'Applications web modernes, responsives et performantes. SPA, PWA, e-commerce, portails d\'entreprise.',
    features: ['React / Next.js / Vue.js', 'Backend Node.js / Django', 'Base de données optimisée', 'SEO & Performance'],
    color: 'var(--cyan)'
  },
  {
    icon: Smartphone, title: 'Applications Mobiles', price: 'À partir de 800 000 Ar',
    desc: 'Applications iOS et Android natives ou cross-platform avec React Native / Flutter.',
    features: ['iOS & Android', 'React Native / Flutter', 'APIs & Notifications', 'Publication sur stores'],
    color: '#a78bfa'
  },
  {
    icon: Code2, title: 'Logiciels Sur Mesure', price: 'Sur devis',
    desc: 'ERP, CRM, SIRH, logiciels métier adaptés exactement à vos processus.',
    features: ['Analyse des besoins', 'Architecture scalable', 'Formation utilisateurs', 'Support continu'],
    color: 'var(--teal)'
  },
  {
    icon: Database, title: 'API & Backend', price: 'À partir de 300 000 Ar',
    desc: 'APIs RESTful ou GraphQL robustes, microservices, intégrations tierces.',
    features: ['REST / GraphQL', 'Documentation Swagger', 'Sécurité OAuth2/JWT', 'Tests automatisés'],
    color: '#f59e0b'
  },
  {
    icon: Cloud, title: 'Cloud & DevOps', price: 'À partir de 200 000 Ar',
    desc: 'Déploiement cloud, CI/CD, containerisation Docker/Kubernetes.',
    features: ['AWS / GCP / Azure', 'Docker & Kubernetes', 'CI/CD Pipeline', 'Monitoring & Alertes'],
    color: 'var(--cyan)'
  },
  {
    icon: Shield, title: 'Audit & Sécurité', price: 'Sur devis',
    desc: 'Audit de code, tests de pénétration, mise en conformité RGPD.',
    features: ['Pentest', 'Code Review', 'RGPD Compliance', 'Rapport détaillé'],
    color: '#ef4444'
  },
]

export default function ServicesPage() {
  return (
    <main style={{ paddingTop: 80 }}>
      <section className="section grid-bg" style={{ paddingTop: 60 }}>
        <div className="container">
          <div style={{ maxWidth: 600, marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 20 }}>NOS SERVICES</div>
            <h1 className="heading" style={{ marginBottom: 16 }}>
              Solutions <span className="glow">complètes</span> pour votre croissance
            </h1>
            <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.8 }}>
              De la conception au déploiement, nous couvrons tous vos besoins technologiques.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 28 }}>
            {SERVICES.map(s => (
              <ServiceCard key={s.title} service={s} />
            ))}
          </div>

          {/* Process */}
          <div style={{ marginTop: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 className="heading">Notre <span className="glow">processus</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, position: 'relative' }}>
              {['Analyse & Devis', 'Conception', 'Développement', 'Livraison & Support'].map((step, i) => (
                <div key={step} style={{ textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--cyan-dim)', border: '1px solid var(--border-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, color: 'var(--cyan)' }}>
                    {i + 1}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.06em', marginBottom: 8 }}>{step}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link to="/devis" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
              Obtenir un devis gratuit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function ServiceCard({ service: { icon: Icon, title, price, desc, features, color } }) {
  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ width: 52, height: 52, background: `${color}22`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon size={24} color={color} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 8, color }}>{title}</h3>
      <div className="mono" style={{ marginBottom: 12, fontSize: '0.75rem', opacity: 0.8 }}>{price}</div>
      <p style={{ color: 'var(--white-dim)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--white-dim)' }}>
            <CheckCircle size={14} color={color} style={{ flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
      <Link to="/devis" className="btn btn-ghost" style={{ marginTop: 24, width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
        Demander ce service
      </Link>
    </div>
  )
}
