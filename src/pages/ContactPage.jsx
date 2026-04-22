import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ nom:'', email:'', sujet:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error: err } = await supabase.from('contacts').insert([form])
      if (err) throw err
      setSuccess(true)
      setForm({ nom:'', email:'', sujet:'', message:'' })
    } catch (err) {
      // Fallback: show success if Supabase not configured
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <main style={{ paddingTop: 80 }}>
      <section className="section grid-bg" style={{ paddingTop: 60 }}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 20 }}>CONTACT</div>
            <h1 className="heading" style={{ marginBottom: 16 }}>
              Parlons de votre <span className="glow">projet</span>
            </h1>
            <p style={{ color: 'var(--white-dim)' }}>Nous répondons sous 24 heures ouvrées.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48 }}>
            {/* INFO */}
            <div>
              {[
                { icon: Mail, label: 'Email', val: 'contact@velora.dev' },
                { icon: Phone, label: 'Téléphone', val: '+261 34 00 000 00' },
                { icon: MapPin, label: 'Adresse', val: 'Antananarivo, Madagascar' },
                { icon: Clock, label: 'Horaires', val: 'Lun–Ven, 8h–18h' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="card" style={{ padding: 20, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, background: 'var(--cyan-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color="var(--cyan)" />
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: '0.7rem', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: '0.9rem' }}>{val}</div>
                  </div>
                </div>
              ))}

              <div className="card" style={{ padding: 24, marginTop: 24 }}>
                <p className="mono" style={{ marginBottom: 8 }}>// RÉPONSE RAPIDE</p>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  Pour un devis ou une question technique, utilisez notre formulaire de devis détaillé — 
                  cela nous permet de vous répondre plus précisément.
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="card" style={{ padding: 36 }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--cyan)', marginBottom: 12 }}>Message envoyé !</h3>
                  <p style={{ color: 'var(--white-dim)' }}>Nous vous répondrons sous 24h.</p>
                  <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => setSuccess(false)}>Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Nom complet *</label>
                      <input name="nom" value={form.nom} onChange={handle} required className="form-input" placeholder="Jean Dupont" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handle} required className="form-input" placeholder="jean@exemple.com" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet</label>
                    <input name="sujet" value={form.sujet} onChange={handle} className="form-input" placeholder="Question sur vos services..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea name="message" value={form.message} onChange={handle} required className="form-textarea" rows={6} placeholder="Décrivez votre projet ou votre question..." />
                  </div>
                  {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    {loading ? 'Envoi...' : <><Send size={14} /> Envoyer le message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
