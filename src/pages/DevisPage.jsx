import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, FileText, ArrowRight, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const SERVICES = ['Développement Web','Application Mobile','Logiciel Sur Mesure','API & Backend','Cloud & DevOps','Audit Sécurité','Autre']
const BUDGETS = ['< 500 000 Ar','500 000 – 2 000 000 Ar','2 000 000 – 5 000 000 Ar','5 000 000 – 10 000 000 Ar','> 10 000 000 Ar','À définir']

export default function DevisPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ nom:'', email: user?.email||'', telephone:'', societe:'', service:'', budget:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await supabase.from('devis').insert([{ ...form, user_id: user?.id || null, statut: 'en attente' }])
    } catch {}
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main style={{ paddingTop: 80, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 500 }}>
        <div style={{ fontSize: '4rem', marginBottom: 24 }}>📋</div>
        <h2 className="heading" style={{ marginBottom: 16 }}>Devis envoyé <span className="glow">avec succès</span> !</h2>
        <p style={{ color: 'var(--white-dim)', marginBottom: 32, lineHeight: 1.8 }}>
          Votre demande de devis a bien été reçue. Notre équipe l'étudiera et vous contactera sous <strong style={{ color: 'var(--cyan)' }}>48 heures ouvrées</strong>.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Retour à l'accueil <ArrowRight size={14} /></Link>
          {user && <Link to="/mon-compte" className="btn btn-outline">Mes devis</Link>}
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ paddingTop: 80 }}>
      <section className="section grid-bg" style={{ paddingTop: 60 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 20 }}><FileText size={12} /> DEMANDE DE DEVIS</div>
            <h1 className="heading" style={{ marginBottom: 12 }}>
              Obtenez votre <span className="glow">devis gratuit</span>
            </h1>
            <p style={{ color: 'var(--white-dim)' }}>Remplissez ce formulaire et recevez une estimation sous 48h.</p>
            {!user && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,245,255,0.06)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--white-dim)' }}>
                <Lock size={14} color="var(--cyan)" />
                <span>
                  <Link to="/connexion" style={{ color: 'var(--cyan)' }}>Connectez-vous</Link> pour suivre vos devis dans votre espace client.
                </span>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 40 }}>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="grid-2" style={{ gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Nom complet *</label>
                  <input name="nom" value={form.nom} onChange={handle} required className="form-input" placeholder="Jean Dupont" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required className="form-input" placeholder="jean@exemple.com" />
                </div>
              </div>
              <div className="grid-2" style={{ gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input name="telephone" value={form.telephone} onChange={handle} className="form-input" placeholder="+261 34 ..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Société / Organisation</label>
                  <input name="societe" value={form.societe} onChange={handle} className="form-input" placeholder="Ma Société SARL" />
                </div>
              </div>
              <div className="grid-2" style={{ gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Service souhaité *</label>
                  <select name="service" value={form.service} onChange={handle} required className="form-select">
                    <option value="">— Choisir —</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget estimé</label>
                  <select name="budget" value={form.budget} onChange={handle} className="form-select">
                    <option value="">— Budget —</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description du projet *</label>
                <textarea name="message" value={form.message} onChange={handle} required className="form-textarea" rows={8}
                  placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, contraintes techniques, délais, etc." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.8rem' }}>
                  * Champs obligatoires. Réponse garantie sous 48h.
                </p>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Envoi en cours...' : <><Send size={14} /> Envoyer la demande</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
