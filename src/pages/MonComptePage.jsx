import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, FileText, LogOut, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const STATUS_CONFIG = {
  'en attente': { color: '#f59e0b', icon: Clock, label: 'En attente' },
  'en cours': { color: 'var(--cyan)', icon: AlertCircle, label: 'En cours' },
  'accepté': { color: 'var(--teal)', icon: CheckCircle, label: 'Accepté' },
  'refusé': { color: '#ef4444', icon: XCircle, label: 'Refusé' },
}

export default function MonComptePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [devis, setDevis] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('devis')

  useEffect(() => {
    if (!user) { navigate('/connexion'); return }
    fetchDevis()
  }, [user])

  async function fetchDevis() {
    try {
      const { data } = await supabase.from('devis').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setDevis(data || [])
    } catch { setDevis([]) }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <main style={{ paddingTop: 80 }}>
      <section className="section grid-bg" style={{ paddingTop: 48 }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--cyan-dim), var(--accent-glow))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} color="var(--cyan)" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 4 }}>Mon espace client</h1>
                <div className="mono" style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user.email}</div>
              </div>
            </div>
            <button onClick={handleSignOut} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
              <LogOut size={14} /> Déconnexion
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ maxWidth: 320, marginBottom: 32 }}>
            <button className={`tab ${tab === 'devis' ? 'active' : ''}`} onClick={() => setTab('devis')}>
              <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />Mes devis
            </button>
            <button className={`tab ${tab === 'profil' ? 'active' : ''}`} onClick={() => setTab('profil')}>
              <User size={12} style={{ display: 'inline', marginRight: 4 }} />Profil
            </button>
          </div>

          {/* DEVIS TAB */}
          {tab === 'devis' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                  Mes demandes de devis ({devis.length})
                </h2>
                <Link to="/devis" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '10px 20px' }}>
                  <Plus size={14} /> Nouveau devis
                </Link>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <div className="spinner" style={{ margin: '0 auto' }} />
                </div>
              ) : devis.length === 0 ? (
                <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                  <FileText size={40} color="var(--white-dim)" style={{ marginBottom: 16, opacity: 0.4 }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 8 }}>Aucun devis pour l'instant</h3>
                  <p style={{ color: 'var(--white-dim)', marginBottom: 24, fontSize: '0.875rem' }}>
                    Commencez par soumettre une demande de devis pour votre projet.
                  </p>
                  <Link to="/devis" className="btn btn-primary">Demander un devis</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {devis.map(d => {
                    const cfg = STATUS_CONFIG[d.statut] || STATUS_CONFIG['en attente']
                    const StatusIcon = cfg.icon
                    return (
                      <div key={d.id} className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>{d.service || 'Devis'}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`, fontSize: '0.7rem', color: cfg.color, fontFamily: 'var(--font-mono)' }}>
                                <StatusIcon size={11} />
                                {cfg.label}
                              </div>
                            </div>
                            <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: 8, lineHeight: 1.6 }}>
                              {d.message?.slice(0, 120)}{d.message?.length > 120 ? '...' : ''}
                            </p>
                            <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--white-dim)', flexWrap: 'wrap' }}>
                              {d.budget && <span>💰 {d.budget}</span>}
                              {d.societe && <span>🏢 {d.societe}</span>}
                              <span>📅 {new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* PROFIL TAB */}
          {tab === 'profil' && (
            <div className="card" style={{ padding: 36, maxWidth: 500 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 24, color: 'var(--cyan)' }}>Informations du compte</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={user.email} readOnly style={{ opacity: 0.7 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">ID Compte</label>
                  <input className="form-input" value={user.id} readOnly style={{ opacity: 0.5, fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Membre depuis</label>
                  <input className="form-input" value={new Date(user.created_at).toLocaleDateString('fr-FR')} readOnly style={{ opacity: 0.7 }} />
                </div>
              </div>
              <div style={{ marginTop: 32, padding: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.8rem', marginBottom: 12 }}>
                  Pour modifier vos informations ou supprimer votre compte, contactez notre support.
                </p>
                <Link to="/contact" className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                  Contacter le support
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
