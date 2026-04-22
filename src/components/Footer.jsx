import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer grid-bg">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-logo" style={{marginBottom:16, display:'block'}}>VEL<span style={{color:'#fff'}}>ORA</span></div>
            <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', maxWidth: 280, marginBottom: 24 }}>
              Création de logiciels innovants et de solutions numériques sur mesure pour propulser votre entreprise vers le futur.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white-dim)', transition: 'var(--transition)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.color='var(--cyan)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--white-dim)'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--cyan)', marginBottom: 16 }}>NAVIGATION</h4>
            {['Accueil','À propos','Services','Portfolio','Produits','Contact'].map((l, i) => {
              const paths = ['/','/apropos','/services','/portfolio','/produits','/contact']
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <Link to={paths[i]} style={{ color: 'var(--white-dim)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color='var(--cyan)'}
                    onMouseLeave={e => e.target.style.color='var(--white-dim)'}>
                    {l}
                  </Link>
                </div>
              )
            })}
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--cyan)', marginBottom: 16 }}>SERVICES</h4>
            {['Développement Web','Applications Mobiles','Logiciels Sur Mesure','API & Backend','Consulting IT','Maintenance'].map((s, i) => (
              <div key={i} style={{ marginBottom: 8, color: 'var(--white-dim)', fontSize: '0.875rem' }}>{s}</div>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--cyan)', marginBottom: 16 }}>CONTACT</h4>
            {[
              { Icon: Mail, text: 'contact@velora.dev' },
              { Icon: Phone, text: '+261 34 00 000 00' },
              { Icon: MapPin, text: 'Antananarivo, Madagascar' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--white-dim)', fontSize: '0.875rem' }}>
                <Icon size={14} color="var(--cyan)" style={{ flexShrink: 0 }} />
                {text}
              </div>
            ))}
            <Link to="/devis" className="btn btn-primary" style={{ marginTop: 8, padding: '10px 20px', fontSize: '0.75rem' }}>
              Demander un devis
            </Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Velora. Tous droits réservés.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', opacity: 0.6 }}>
            BUILT_WITH_PASSION :: MADAGASCAR
          </p>
        </div>
      </div>
    </footer>
  )
}
