import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Menu, X, User, LogOut, FileText } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setOpen(false)
  }

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/apropos', label: 'À propos' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/produits', label: 'Produits' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
            VEL<span style={{color:'#fff'}}>ORA</span>
          </Link>

          <ul className="nav-links-desktop">
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-actions-desktop">
            {user ? (
              <>
                <Link to="/devis" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                  <FileText size={13} /> Devis
                </Link>
                <Link to="/mon-compte" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                  <User size={13} /> Mon compte
                </Link>
                <button onClick={handleSignOut} className="btn btn-ghost" style={{ padding: '8px 12px' }}>
                  <LogOut size={13} />
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Connexion</Link>
                <Link to="/inscription" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Inscription</Link>
              </>
            )}
          </div>

          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X color="white" size={22} /> : <Menu color="white" size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="nav-logo">VEL<span style={{color:'#fff'}}>ORA</span></span>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                <X color="white" size={22} />
              </button>
            </div>
            <ul className="mobile-nav-links">
              {links.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mobile-nav-actions">
              {user ? (
                <>
                  <Link to="/devis" className="btn btn-outline" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpen(false)}>
                    <FileText size={14} /> Demander un devis
                  </Link>
                  <Link to="/mon-compte" className="btn btn-ghost" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpen(false)}>
                    <User size={14} /> Mon compte
                  </Link>
                  <button onClick={handleSignOut} className="btn btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
                    <LogOut size={14} /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/connexion" className="btn btn-ghost" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/inscription" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpen(false)}>
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
