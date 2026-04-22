import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, UserPlus, ArrowRight, User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const fieldStyle = { display:'flex', flexDirection:'column', gap:6 }
const labelStyle = { fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', color:'var(--cyan)', letterSpacing:'0.12em', textTransform:'uppercase' }
const inputWrap = { position:'relative' }
const iconStyle = { position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(0,245,255,0.4)', pointerEvents:'none' }

function FInput({ icon:Icon, type='text', ...props }) {
  return (
    <div style={inputWrap}>
      {Icon && <Icon size={15} style={iconStyle} />}
      <input type={type} {...props} className="form-input" style={{ paddingLeft: Icon ? 40 : 16 }} />
    </div>
  )
}

export function ConnexionPage() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await signIn(form.email, form.password)
    if (err) {
      if (err.message.includes('Invalid login')) setError('Email ou mot de passe incorrect.')
      else if (err.message.includes('Email not confirmed')) setError('Votre compte n\'est pas encore confirmé. Contactez l\'administrateur.')
      else setError(err.message)
    } else navigate('/')
    setLoading(false)
  }

  return (
    <main style={{ paddingTop:80, minHeight:'100vh', display:'flex', alignItems:'center', background:'var(--bg)' }}>
      <div className="container" style={{ maxWidth:420 }}>

        {/* Orb déco */}
        <div style={{ position:'fixed', top:'20%', right:'10%', width:300, height:300, background:'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none', filter:'blur(40px)' }} />
        <div style={{ position:'fixed', bottom:'20%', left:'5%', width:200, height:200, background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none', filter:'blur(40px)' }} />

        <div style={{ textAlign:'center', marginBottom:36, position:'relative' }}>
          <div className="badge" style={{ marginBottom:14 }}><LogIn size={11} /> CONNEXION</div>
          <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'1.8rem', fontWeight:900, marginBottom:6 }}>
            Bon retour <span className="glow">!</span>
          </h1>
          <p style={{ color:'var(--white-dim)', fontSize:'0.875rem' }}>Connectez-vous à votre espace client</p>
        </div>

        <div className="card" style={{ padding:36 }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Adresse email</label>
              <FInput icon={Mail} name="email" type="email" value={form.email} onChange={handle} required placeholder="vous@exemple.com" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input name="password" type={show?'text':'password'} value={form.password} onChange={handle} required className="form-input" placeholder="••••••••" style={{ paddingLeft:40, paddingRight:44, width:'100%' }} />
                <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--white-dim)', cursor:'pointer', padding:4 }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, fontSize:'0.82rem', color:'#f87171' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>
              {loading ? <><span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> Connexion...</> : <><LogIn size={14}/> Se connecter</>}
            </button>
          </form>

          <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid var(--border)', textAlign:'center' }}>
            <p style={{ color:'var(--white-dim)', fontSize:'0.875rem' }}>
              Pas encore de compte ?{' '}
              <Link to="/inscription" style={{ color:'var(--cyan)', textDecoration:'none', fontWeight:600 }}>Créer un compte</Link>
            </p>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <Link to="/" style={{ color:'var(--white-dim)', fontSize:'0.8rem', textDecoration:'none', opacity:0.7 }}>← Retour à l'accueil</Link>
        </div>
      </div>
    </main>
  )
}

export function InscriptionPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'', confirm:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    if (form.username.length < 3) { setError('Le nom d\'utilisateur doit avoir au moins 3 caractères.'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { setError('Nom d\'utilisateur : lettres, chiffres et _ uniquement.'); return }

    setLoading(true); setError('')
    const { data, error: err } = await signUp(form.email, form.password, form.username)

    if (err) {
      if (err.message.includes('already registered')) setError('Cet email est déjà utilisé.')
      else setError(err.message)
      setLoading(false)
      return
    }

    // Si pas de confirmation email requise → connexion directe
    if (data?.user && !data?.user?.identities?.[0]?.identity_data?.email_verified === false) {
      const { error: signInErr } = await signIn(form.email, form.password)
      if (!signInErr) { navigate('/'); return }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main style={{ paddingTop:80, minHeight:'100vh', display:'flex', alignItems:'center' }}>
      <div className="container" style={{ maxWidth:420, textAlign:'center' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:20 }}>✅</div>
        <h2 className="heading" style={{ marginBottom:12 }}>Compte créé <span className="glow">avec succès</span> !</h2>
        <p style={{ color:'var(--white-dim)', marginBottom:28, lineHeight:1.8 }}>
          Votre compte <strong style={{ color:'var(--cyan)' }}>@{form.username}</strong> a été créé.<br />
          Vous pouvez maintenant vous connecter.
        </p>
        <Link to="/connexion" className="btn btn-primary">Se connecter <ArrowRight size={14} /></Link>
      </div>
    </main>
  )

  return (
    <main style={{ paddingTop:80, minHeight:'100vh', display:'flex', alignItems:'center', background:'var(--bg)' }}>
      <div className="container" style={{ maxWidth:440 }}>

        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div className="badge" style={{ marginBottom:14 }}><UserPlus size={11} /> INSCRIPTION</div>
          <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'1.8rem', fontWeight:900, marginBottom:6 }}>
            Créer un <span className="glow">compte</span>
          </h1>
          <p style={{ color:'var(--white-dim)', fontSize:'0.875rem' }}>Accédez à votre espace client personnel</p>
        </div>

        <div className="card" style={{ padding:36 }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nom d'utilisateur *</label>
              <FInput icon={User} name="username" value={form.username} onChange={handle} required placeholder="mon_username" />
              <span style={{ fontSize:'0.7rem', color:'rgba(232,244,248,0.4)' }}>Lettres, chiffres et _ uniquement</span>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Adresse email *</label>
              <FInput icon={Mail} name="email" type="email" value={form.email} onChange={handle} required placeholder="vous@exemple.com" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Mot de passe *</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input name="password" type={show?'text':'password'} value={form.password} onChange={handle} required className="form-input" placeholder="Min. 6 caractères" style={{ paddingLeft:40, paddingRight:44, width:'100%' }} />
                <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--white-dim)', cursor:'pointer', padding:4 }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Confirmer le mot de passe *</label>
              <FInput icon={Lock} name="confirm" type="password" value={form.confirm} onChange={handle} required placeholder="••••••••" />
            </div>

            {error && (
              <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, fontSize:'0.82rem', color:'#f87171' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>
              {loading ? <><span className="spinner" style={{ width:16,height:16,borderWidth:2 }} /> Création...</> : <><UserPlus size={14}/> Créer mon compte</>}
            </button>
          </form>

          <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid var(--border)', textAlign:'center' }}>
            <p style={{ color:'var(--white-dim)', fontSize:'0.875rem' }}>
              Déjà un compte ?{' '}
              <Link to="/connexion" style={{ color:'var(--cyan)', textDecoration:'none', fontWeight:600 }}>Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
