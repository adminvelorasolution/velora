import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Wrench, FileText, MessageSquare,
  ShoppingCart, LogOut, Plus, Edit2, Trash2, Eye, Check, X,
  Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  Save, Upload, Video, Tag, Star, Zap, ChevronDown, ChevronUp,
  Mail, Phone, Building2, Calendar, DollarSign, Search
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'admin@it-velora.com'
const ADMIN_PASSWORD = 'admin_v3l0r@'

// ── MOCK DATA ──────────────────────────────────────────
const MOCK_STATS = { devis: 12, messages: 8, produits: 5, services: 6, devis_nouveaux: 3, messages_nouveaux: 2 }

const MOCK_DEVIS = [
  { id:'1', nom:'Jean Rakoto', email:'jean@gmail.com', telephone:'+261 34 12 345 67', societe:'Rakoto SARL', service:'Logiciel Sur Mesure', budget:'2 000 000 – 5 000 000 Ar', message:'Nous avons besoin d\'un ERP complet pour notre entreprise de 50 employés.', statut:'en attente', created_at:'2025-04-15T08:30:00Z' },
  { id:'2', nom:'Marie Rabe', email:'marie.rabe@corp.mg', telephone:'+261 33 98 765 43', societe:'Corp Madagascar', service:'Développement Web', budget:'500 000 – 2 000 000 Ar', message:'Site e-commerce pour vente de produits artisanaux.', statut:'en cours', created_at:'2025-04-14T14:20:00Z' },
  { id:'3', nom:'Paul Andria', email:'paul@startup.mg', telephone:'', societe:'StartupMG', service:'Application Mobile', budget:'< 500 000 Ar', message:'Application de livraison pour notre restaurant.', statut:'accepté', created_at:'2025-04-10T09:00:00Z' },
  { id:'4', nom:'Hery Tiana', email:'hery@biz.mg', telephone:'+261 32 11 223 44', societe:'', service:'API & Backend', budget:'500 000 – 2 000 000 Ar', message:'API REST pour connecter notre app mobile à notre base de données.', statut:'refusé', created_at:'2025-04-08T16:45:00Z' },
]

const MOCK_MESSAGES = [
  { id:'1', nom:'Sophie Rahari', email:'sophie@exemple.mg', sujet:'Question sur vos tarifs', message:'Bonjour, je voudrais savoir si vous proposez des facilités de paiement pour les petites entreprises.', created_at:'2025-04-16T10:00:00Z', lu: false },
  { id:'2', nom:'Marc Ravelona', email:'marc@ravelona.mg', sujet:'Partenariat potentiel', message:'Notre agence cherche un partenaire technique pour des projets clients. Seriez-vous intéressé ?', created_at:'2025-04-15T11:30:00Z', lu: false },
  { id:'3', nom:'Clara Razafy', email:'clara@razafy.com', sujet:'Maintenance logiciel', message:'Nous avons un ancien système PHP que nous aimerions moderniser. Pouvez-vous nous aider ?', created_at:'2025-04-13T09:15:00Z', lu: true },
]

const MOCK_PRODUCTS = [
  { id:'1', title:'NexaFlow ERP', description:'Solution ERP complète pour PME.', long_description:'ERP modulaire pour PME africaines.', tags:['ERP','React','Node.js'], is_featured:true, is_discover:true, video_url:'', demo_url:'#' },
  { id:'2', title:'DataSense AI', description:'Analyse de données avec IA.', long_description:'Plateforme d\'analyse prédictive.', tags:['AI','Python'], is_featured:true, is_discover:false, video_url:'', demo_url:'#' },
  { id:'3', title:'SecureVault Pro', description:'Gestion documentaire sécurisée.', long_description:'DMS avec chiffrement E2E.', tags:['Security','Cloud'], is_featured:true, is_discover:false, video_url:'', demo_url:'#' },
]

const MOCK_SERVICES = [
  { id:'1', title:'Développement Web', description:'Apps web modernes, SPA, PWA.', price_range:'À partir de 500 000 Ar', icon:'🌐' },
  { id:'2', title:'Applications Mobiles', description:'iOS & Android natifs.', price_range:'À partir de 800 000 Ar', icon:'📱' },
  { id:'3', title:'Logiciels Sur Mesure', description:'ERP, CRM, SIRH adaptés.', price_range:'Sur devis', icon:'💼' },
  { id:'4', title:'API & Backend', description:'APIs RESTful ou GraphQL.', price_range:'À partir de 300 000 Ar', icon:'🔌' },
  { id:'5', title:'Cloud & DevOps', description:'Déploiement et CI/CD.', price_range:'À partir de 200 000 Ar', icon:'☁️' },
  { id:'6', title:'Audit & Sécurité', description:'Pentest et code review.', price_range:'Sur devis', icon:'🛡️' },
]

const STATUS_CFG = {
  'en attente': { color:'#f59e0b', bg:'rgba(245,158,11,0.12)', icon: Clock, label:'En attente' },
  'en cours':   { color:'#00f5ff', bg:'rgba(0,245,255,0.1)',   icon: AlertCircle, label:'En cours' },
  'accepté':    { color:'#00c9a7', bg:'rgba(0,201,167,0.12)', icon: CheckCircle, label:'Accepté' },
  'refusé':     { color:'#ef4444', bg:'rgba(239,68,68,0.12)', icon: XCircle, label:'Refusé' },
}

// ── ADMIN CSS ──────────────────────────────────────────
const ADMIN_CSS = `
.admin-wrap { display:flex; min-height:100vh; background:#020408; color:#e8f4f8; font-family:'Syne',sans-serif; }
.admin-sidebar { width:240px; background:#060d14; border-right:1px solid rgba(0,245,255,0.12); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:100; transition:transform 0.3s; }
.admin-sidebar.closed { transform:translateX(-240px); }
.admin-logo { padding:24px 20px; border-bottom:1px solid rgba(0,245,255,0.1); font-family:'Orbitron',monospace; font-size:1.1rem; font-weight:900; color:#00f5ff; }
.admin-logo span { color:#e8f4f8; }
.admin-logo small { display:block; font-size:0.6rem; color:rgba(0,245,255,0.6); letter-spacing:0.15em; margin-top:2px; }
.admin-nav { flex:1; padding:12px 0; overflow-y:auto; }
.admin-nav-item { display:flex; align-items:center; gap:10px; padding:10px 20px; color:rgba(232,244,248,0.6); font-size:0.85rem; cursor:pointer; transition:all 0.2s; border:none; background:none; width:100%; text-align:left; }
.admin-nav-item:hover { color:#00f5ff; background:rgba(0,245,255,0.05); }
.admin-nav-item.active { color:#00f5ff; background:rgba(0,245,255,0.1); border-right:2px solid #00f5ff; }
.admin-nav-section { font-size:0.65rem; color:rgba(0,245,255,0.4); letter-spacing:0.15em; padding:16px 20px 6px; font-family:'JetBrains Mono',monospace; }
.admin-signout { padding:16px 20px; border-top:1px solid rgba(0,245,255,0.1); }
.admin-content { margin-left:240px; flex:1; padding:28px; min-height:100vh; }
.admin-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
.admin-title { font-family:'Orbitron',monospace; font-size:1.3rem; font-weight:700; }
.stat-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.stat-card { background:rgba(6,20,35,0.85); border:1px solid rgba(0,245,255,0.12); border-radius:12px; padding:20px; }
.stat-card-val { font-family:'Orbitron',monospace; font-size:2rem; font-weight:900; color:#00f5ff; }
.stat-card-label { font-size:0.8rem; color:rgba(232,244,248,0.6); margin-top:4px; }
.stat-card-new { font-size:0.7rem; color:#00c9a7; margin-top:6px; }
.admin-card { background:rgba(6,20,35,0.85); border:1px solid rgba(0,245,255,0.12); border-radius:12px; padding:24px; margin-bottom:20px; }
.admin-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px; }
.admin-card-title { font-family:'Orbitron',monospace; font-size:0.85rem; color:#00f5ff; letter-spacing:0.08em; }
.admin-table { width:100%; border-collapse:collapse; }
.admin-table th { text-align:left; padding:10px 12px; font-size:0.7rem; color:rgba(0,245,255,0.7); letter-spacing:0.1em; border-bottom:1px solid rgba(0,245,255,0.1); font-family:'JetBrains Mono',monospace; }
.admin-table td { padding:12px; font-size:0.85rem; border-bottom:1px solid rgba(0,245,255,0.06); vertical-align:middle; }
.admin-table tr:hover td { background:rgba(0,245,255,0.03); }
.status-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:100px; font-size:0.7rem; font-weight:700; font-family:'JetBrains Mono',monospace; white-space:nowrap; }
.abtn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; font-size:0.75rem; font-weight:700; cursor:pointer; border:none; transition:all 0.2s; font-family:'Orbitron',monospace; letter-spacing:0.06em; }
.abtn-primary { background:linear-gradient(135deg,#00f5ff,#00c9a7); color:#020408; }
.abtn-primary:hover { opacity:0.9; transform:translateY(-1px); }
.abtn-outline { background:transparent; border:1px solid rgba(0,245,255,0.35); color:#00f5ff; }
.abtn-outline:hover { background:rgba(0,245,255,0.08); }
.abtn-ghost { background:rgba(255,255,255,0.06); border:1px solid rgba(0,245,255,0.12); color:rgba(232,244,248,0.7); }
.abtn-ghost:hover { background:rgba(255,255,255,0.1); }
.abtn-danger { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#f87171; }
.abtn-danger:hover { background:rgba(239,68,68,0.25); }
.abtn-sm { padding:5px 10px; font-size:0.68rem; }
.aform-group { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
.aform-label { font-size:0.7rem; color:#00f5ff; letter-spacing:0.1em; font-family:'JetBrains Mono',monospace; text-transform:uppercase; }
.aform-input, .aform-select, .aform-textarea { background:rgba(0,245,255,0.04); border:1px solid rgba(0,245,255,0.15); border-radius:8px; padding:10px 14px; color:#e8f4f8; font-family:'Syne',sans-serif; font-size:0.9rem; outline:none; transition:border-color 0.2s; width:100%; }
.aform-input:focus, .aform-select:focus, .aform-textarea:focus { border-color:#00f5ff; box-shadow:0 0 0 3px rgba(0,245,255,0.1); }
.aform-input::placeholder, .aform-textarea::placeholder { color:rgba(232,244,248,0.3); }
.aform-textarea { resize:vertical; min-height:100px; }
.aform-select option { background:#060d14; }
.agrid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.modal-bg { position:fixed; inset:0; background:rgba(2,4,8,0.88); backdrop-filter:blur(8px); z-index:500; display:flex; align-items:center; justify-content:center; padding:16px; }
.modal-box { background:#060d14; border:1px solid rgba(0,245,255,0.3); border-radius:16px; width:100%; max-width:620px; max-height:90vh; overflow-y:auto; padding:32px; position:relative; }
.modal-close-btn { position:absolute; top:14px; right:14px; background:none; border:none; color:rgba(232,244,248,0.5); cursor:pointer; }
.modal-close-btn:hover { color:#00f5ff; }
.search-input { background:rgba(0,245,255,0.04); border:1px solid rgba(0,245,255,0.15); border-radius:8px; padding:8px 14px 8px 36px; color:#e8f4f8; font-size:0.85rem; outline:none; width:220px; }
.search-wrap { position:relative; }
.search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:rgba(0,245,255,0.5); }
.msg-card { background:rgba(0,245,255,0.03); border:1px solid rgba(0,245,255,0.1); border-radius:10px; padding:18px; margin-bottom:12px; cursor:pointer; transition:border-color 0.2s; }
.msg-card:hover { border-color:rgba(0,245,255,0.3); }
.msg-card.unread { border-left:3px solid #00f5ff; }
.toggle-wrap { display:flex; align-items:center; gap:8px; }
.toggle { width:40px; height:22px; border-radius:100px; background:rgba(255,255,255,0.1); border:1px solid rgba(0,245,255,0.2); cursor:pointer; position:relative; transition:background 0.2s; }
.toggle.on { background:linear-gradient(135deg,#00f5ff,#00c9a7); }
.toggle-dot { position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:white; transition:left 0.2s; }
.toggle.on .toggle-dot { left:21px; }
.tag-input-wrap { display:flex; gap:8px; flex-wrap:wrap; padding:8px; background:rgba(0,245,255,0.04); border:1px solid rgba(0,245,255,0.15); border-radius:8px; min-height:44px; align-items:center; }
.tag-chip { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; background:rgba(0,245,255,0.1); border:1px solid rgba(0,245,255,0.25); border-radius:100px; font-size:0.75rem; color:#00f5ff; }
.empty-state { text-align:center; padding:48px 24px; color:rgba(232,244,248,0.4); }
.empty-state svg { margin:0 auto 12px; opacity:0.3; }
.burger-btn { display:none; background:none; border:none; cursor:pointer; padding:4px; }
.overlay-close { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:99; }
@media(max-width:900px){
  .admin-sidebar { transform:translateX(-240px); }
  .admin-sidebar.open { transform:translateX(0); }
  .admin-content { margin-left:0; padding:16px; }
  .stat-cards { grid-template-columns:repeat(2,1fr); }
  .agrid-2 { grid-template-columns:1fr; }
  .burger-btn { display:flex; }
  .overlay-close { display:block; }
  .admin-table { font-size:0.78rem; }
  .admin-table th, .admin-table td { padding:8px; }
}
@media(max-width:500px){
  .stat-cards { grid-template-columns:1fr 1fr; gap:10px; }
  .stat-card { padding:14px; }
  .stat-card-val { font-size:1.5rem; }
  .admin-card { padding:16px; }
  .modal-box { padding:20px; }
}
`

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [loginForm, setLoginForm] = useState({ email:'', password:'' })
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data states
  const [devis, setDevis] = useState(MOCK_DEVIS)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [services, setServices] = useState(MOCK_SERVICES)
  const [stats, setStats] = useState(MOCK_STATS)

  // Modal states
  const [modal, setModal] = useState(null) // { type, data }
  const [search, setSearch] = useState('')
  const [selectedDevis, setSelectedDevis] = useState(null)
  const [selectedMsg, setSelectedMsg] = useState(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('velora_admin')
    if (saved === 'ok') setAuthed(true)
    loadData()
  }, [])

  async function loadData() {
    try {
      const [d, m, p, s] = await Promise.all([
        supabase.from('devis').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
      ])
      // Always use real data if available, even empty arrays
      if (d.data !== null) setDevis(d.data.length ? d.data : MOCK_DEVIS)
      if (m.data !== null) setMessages(m.data.length ? m.data : MOCK_MESSAGES)
      if (p.data !== null) setProducts(p.data.length ? p.data : MOCK_PRODUCTS)
      if (s.data !== null) setServices(s.data.length ? s.data : MOCK_SERVICES)
    } catch (e) {
      console.warn('Supabase not configured, using mock data:', e.message)
    }
  }

  function handleLogin(e) {
    e.preventDefault()
    if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
      setAuthed(true)
      sessionStorage.setItem('velora_admin', 'ok')
    } else {
      setLoginError('Email ou mot de passe incorrect.')
    }
  }

  function handleLogout() {
    setAuthed(false)
    sessionStorage.removeItem('velora_admin')
  }

  // ── LOGIN PAGE ─────────────────────────────────────────
  if (!authed) return (
    <>
      <style>{ADMIN_CSS}</style>
      <div style={{ minHeight:'100vh', background:'#020408', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'1.8rem', fontWeight:900, color:'#00f5ff', marginBottom:4 }}>
              VEL<span style={{color:'#e8f4f8'}}>ORA</span>
            </div>
            <div style={{ fontSize:'0.7rem', color:'rgba(0,245,255,0.6)', letterSpacing:'0.2em', fontFamily:'JetBrains Mono,monospace' }}>
              ADMIN PANEL
            </div>
          </div>
          <div style={{ background:'rgba(6,20,35,0.9)', border:'1px solid rgba(0,245,255,0.2)', borderRadius:16, padding:32 }}>
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="aform-group" style={{marginBottom:0}}>
                <label className="aform-label">Email admin</label>
                <input className="aform-input" type="email" value={loginForm.email}
                  onChange={e => setLoginForm(f=>({...f,email:e.target.value}))}
                  placeholder="admin@it-velora.com" required />
              </div>
              <div className="aform-group" style={{marginBottom:0}}>
                <label className="aform-label">Mot de passe</label>
                <input className="aform-input" type="password" value={loginForm.password}
                  onChange={e => setLoginForm(f=>({...f,password:e.target.value}))}
                  placeholder="••••••••" required />
              </div>
              {loginError && (
                <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, fontSize:'0.85rem', color:'#f87171' }}>
                  {loginError}
                </div>
              )}
              <button type="submit" className="abtn abtn-primary" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>
                Accéder au panneau admin
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )

  const navItems = [
    { id:'dashboard', icon:LayoutDashboard, label:'Dashboard' },
    { id:'devis', icon:FileText, label:'Devis', badge: devis.filter(d=>d.statut==='en attente').length },
    { id:'messages', icon:MessageSquare, label:'Messages', badge: messages.filter(m=>!m.lu).length },
    { id:'produits', icon:Package, label:'Produits' },
    { id:'services', icon:Wrench, label:'Services' },
  ]

  function goTab(id) { setTab(id); setSidebarOpen(false) }

  // ── MAIN ADMIN ─────────────────────────────────────────
  return (
    <>
      <style>{ADMIN_CSS}</style>

      {sidebarOpen && <div className="overlay-close" onClick={()=>setSidebarOpen(false)} />}

      <div className="admin-wrap">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-logo">
            VEL<span>ORA</span>
            <small>// ADMIN PANEL</small>
          </div>
          <nav className="admin-nav">
            <div className="admin-nav-section">NAVIGATION</div>
            {navItems.map(({ id, icon:Icon, label, badge }) => (
              <button key={id} className={`admin-nav-item ${tab===id?'active':''}`} onClick={() => goTab(id)}>
                <Icon size={16} />
                <span style={{flex:1}}>{label}</span>
                {badge > 0 && (
                  <span style={{ background:'#00f5ff', color:'#020408', borderRadius:'100px', fontSize:'0.65rem', fontWeight:900, padding:'1px 7px', fontFamily:'JetBrains Mono,monospace' }}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="admin-signout">
            <button className="admin-nav-item" onClick={handleLogout} style={{color:'#f87171', width:'100%'}}>
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="admin-content">
          {/* Topbar */}
          <div className="admin-topbar">
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <button className="burger-btn" onClick={()=>setSidebarOpen(true)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <h1 className="admin-title">
                {navItems.find(n=>n.id===tab)?.label || 'Dashboard'}
              </h1>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{fontSize:'0.75rem', color:'rgba(0,245,255,0.7)', fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:6}}>
                <div style={{width:7, height:7, borderRadius:'50%', background:'#00c9a7', boxShadow:'0 0 8px #00c9a7'}} />
                {ADMIN_EMAIL}
              </div>
            </div>
          </div>

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && <DashboardTab stats={stats} devis={devis} messages={messages} setTab={setTab} />}

          {/* ── DEVIS ── */}
          {tab === 'devis' && (
            <DevisTab devis={devis} setDevis={setDevis} search={search} setSearch={setSearch}
              selectedDevis={selectedDevis} setSelectedDevis={setSelectedDevis} />
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <MessagesTab messages={messages} setMessages={setMessages}
              selectedMsg={selectedMsg} setSelectedMsg={setSelectedMsg} />
          )}

          {/* ── PRODUITS ── */}
          {tab === 'produits' && (
            <ProduitsTab products={products} setProducts={setProducts} modal={modal} setModal={setModal} />
          )}

          {/* ── SERVICES ── */}
          {tab === 'services' && (
            <ServicesTab services={services} setServices={setServices} modal={modal} setModal={setModal} />
          )}
        </main>
      </div>
    </>
  )
}

// ── DASHBOARD TAB ──────────────────────────────────────
function DashboardTab({ stats, devis, messages, setTab }) {
  const recent_devis = devis.slice(0, 4)
  const recent_msgs = messages.slice(0, 3)

  return (
    <div>
      <div className="stat-cards">
        {[
          { val: devis.length, label:'Total devis', new: devis.filter(d=>d.statut==='en attente').length + ' en attente', color:'#00f5ff' },
          { val: messages.length, label:'Messages reçus', new: messages.filter(m=>!m.lu).length + ' non lus', color:'#a78bfa' },
          { val: devis.filter(d=>d.statut==='accepté').length, label:'Devis acceptés', new: '', color:'#00c9a7' },
          { val: devis.filter(d=>d.statut==='en cours').length, label:'En cours', new: '', color:'#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-val" style={{color:s.color}}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
            {s.new && <div className="stat-card-new">{s.new}</div>}
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20}}>
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">DERNIERS DEVIS</span>
            <button className="abtn abtn-ghost abtn-sm" onClick={()=>setTab('devis')}>Voir tout</button>
          </div>
          <table className="admin-table">
            <thead><tr><th>CLIENT</th><th>SERVICE</th><th>STATUT</th><th>DATE</th></tr></thead>
            <tbody>
              {recent_devis.map(d => {
                const cfg = STATUS_CFG[d.statut] || STATUS_CFG['en attente']
                return (
                  <tr key={d.id}>
                    <td><div style={{fontWeight:600}}>{d.nom}</div><div style={{fontSize:'0.75rem',color:'rgba(232,244,248,0.5)'}}>{d.email}</div></td>
                    <td style={{color:'rgba(232,244,248,0.7)',fontSize:'0.8rem'}}>{d.service}</td>
                    <td><span className="status-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}44`}}>{cfg.label}</span></td>
                    <td style={{color:'rgba(232,244,248,0.5)',fontSize:'0.78rem'}}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">MESSAGES RÉCENTS</span>
            <button className="abtn abtn-ghost abtn-sm" onClick={()=>setTab('messages')}>Voir tout</button>
          </div>
          {recent_msgs.map(m => (
            <div key={m.id} className="msg-card" style={{marginBottom:10, borderLeft: !m.lu ? '3px solid #00f5ff' : ''}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                <span style={{fontWeight:600, fontSize:'0.85rem'}}>{m.nom}</span>
                {!m.lu && <span style={{fontSize:'0.65rem',background:'rgba(0,245,255,0.1)',color:'#00f5ff',padding:'2px 7px',borderRadius:100,fontFamily:'JetBrains Mono,monospace'}}>NOUVEAU</span>}
              </div>
              <div style={{fontSize:'0.78rem',color:'rgba(232,244,248,0.6)',marginBottom:3}}>{m.sujet}</div>
              <div style={{fontSize:'0.75rem',color:'rgba(232,244,248,0.4)'}}>{m.message.slice(0,60)}...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── DEVIS TAB ──────────────────────────────────────────
function DevisTab({ devis, setDevis, search, setSearch, selectedDevis, setSelectedDevis }) {
  const [statusFilter, setStatusFilter] = useState('tous')

  const filtered = devis.filter(d => {
    const matchSearch = d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      (d.service||'').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'tous' || d.statut === statusFilter
    return matchSearch && matchStatus
  })

  async function updateStatus(id, statut) {
    setDevis(prev => prev.map(d => d.id===id ? {...d,statut} : d))
    try { await supabase.from('devis').update({statut}).eq('id',id) } catch {}
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">TOUTES LES DEMANDES ({filtered.length})</span>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <div className="search-wrap">
              <Search size={14} className="search-icon" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'rgba(0,245,255,0.5)'}} />
              <input className="search-input" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="aform-select" style={{width:'auto',padding:'8px 12px',fontSize:'0.8rem'}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="tous">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><FileText size={36} /><p>Aucun devis trouvé</p></div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="admin-table">
              <thead><tr><th>CLIENT</th><th>SERVICE</th><th>BUDGET</th><th>STATUT</th><th>DATE</th><th>ACTIONS</th></tr></thead>
              <tbody>
                {filtered.map(d => {
                  const cfg = STATUS_CFG[d.statut] || STATUS_CFG['en attente']
                  return (
                    <tr key={d.id}>
                      <td>
                        <div style={{fontWeight:600}}>{d.nom}</div>
                        <div style={{fontSize:'0.75rem',color:'rgba(232,244,248,0.5)'}}>{d.email}</div>
                        {d.societe && <div style={{fontSize:'0.7rem',color:'rgba(0,245,255,0.6)'}}>{d.societe}</div>}
                      </td>
                      <td style={{fontSize:'0.82rem',color:'rgba(232,244,248,0.8)'}}>{d.service}</td>
                      <td style={{fontSize:'0.78rem',color:'rgba(232,244,248,0.6)'}}>{d.budget || '—'}</td>
                      <td>
                        <select
                          value={d.statut}
                          onChange={e=>updateStatus(d.id, e.target.value)}
                          style={{background:cfg.bg,border:`1px solid ${cfg.color}44`,color:cfg.color,borderRadius:100,padding:'3px 8px',fontSize:'0.72rem',fontWeight:700,cursor:'pointer',fontFamily:'JetBrains Mono,monospace',outline:'none'}}>
                          <option value="en attente">En attente</option>
                          <option value="en cours">En cours</option>
                          <option value="accepté">Accepté</option>
                          <option value="refusé">Refusé</option>
                        </select>
                      </td>
                      <td style={{fontSize:'0.78rem',color:'rgba(232,244,248,0.5)'}}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button className="abtn abtn-ghost abtn-sm" onClick={()=>setSelectedDevis(d)}>
                          <Eye size={12} /> Voir
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal detail devis */}
      {selectedDevis && (
        <div className="modal-bg" onClick={()=>setSelectedDevis(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <button className="modal-close-btn" onClick={()=>setSelectedDevis(null)}><X size={20} /></button>
            <div style={{fontFamily:'Orbitron,monospace',fontSize:'0.85rem',color:'#00f5ff',marginBottom:20,letterSpacing:'0.08em'}}>DÉTAIL DU DEVIS</div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              {[
                {icon:User, label:'Nom', val:selectedDevis.nom},
                {icon:Mail, label:'Email', val:selectedDevis.email},
                {icon:Phone, label:'Téléphone', val:selectedDevis.telephone||'—'},
                {icon:Building2, label:'Société', val:selectedDevis.societe||'—'},
                {icon:Wrench, label:'Service', val:selectedDevis.service},
                {icon:DollarSign, label:'Budget', val:selectedDevis.budget||'—'},
                {icon:Calendar, label:'Date', val:new Date(selectedDevis.created_at).toLocaleDateString('fr-FR')},
              ].map(({icon:Icon,label,val}) => (
                <div key={label} style={{background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.1)',borderRadius:8,padding:'10px 14px'}}>
                  <div style={{fontSize:'0.65rem',color:'rgba(0,245,255,0.6)',letterSpacing:'0.1em',marginBottom:4,fontFamily:'JetBrains Mono,monospace'}}>{label.toUpperCase()}</div>
                  <div style={{fontSize:'0.9rem'}}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.1)',borderRadius:8,padding:'14px',marginBottom:20}}>
              <div style={{fontSize:'0.65rem',color:'rgba(0,245,255,0.6)',letterSpacing:'0.1em',marginBottom:8,fontFamily:'JetBrains Mono,monospace'}}>MESSAGE</div>
              <p style={{fontSize:'0.9rem',lineHeight:1.7,color:'rgba(232,244,248,0.85)'}}>{selectedDevis.message}</p>
            </div>

            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {Object.entries(STATUS_CFG).map(([key,cfg]) => (
                <button key={key} className="abtn abtn-sm"
                  style={{background:selectedDevis.statut===key?cfg.bg:'transparent',border:`1px solid ${cfg.color}44`,color:cfg.color,fontFamily:'JetBrains Mono,monospace',borderRadius:100}}
                  onClick={()=>{updateStatus(selectedDevis.id,key);setSelectedDevis({...selectedDevis,statut:key})}}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function updateStatus(id, statut) {
    setDevis(prev => prev.map(d => d.id===id ? {...d,statut} : d))
    try { supabase.from('devis').update({statut}).eq('id',id) } catch {}
  }
}

// ── MESSAGES TAB ───────────────────────────────────────
function MessagesTab({ messages, setMessages, selectedMsg, setSelectedMsg }) {
  function markRead(id) {
    setMessages(prev => prev.map(m => m.id===id ? {...m,lu:true} : m))
    try { supabase.from('contacts').update({lu:true}).eq('id',id) } catch {}
  }
  function deleteMsg(id) {
    setMessages(prev => prev.filter(m => m.id!==id))
    try { supabase.from('contacts').delete().eq('id',id) } catch {}
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">MESSAGES CLIENTS ({messages.length})</span>
        <span style={{fontSize:'0.8rem',color:'rgba(232,244,248,0.5)'}}>
          {messages.filter(m=>!m.lu).length} non lus
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state"><MessageSquare size={36} /><p>Aucun message</p></div>
      ) : (
        messages.map(m => (
          <div key={m.id} className="msg-card" style={{borderLeft: !m.lu ? '3px solid #00f5ff' : '1px solid rgba(0,245,255,0.1)'}}
            onClick={()=>{setSelectedMsg(m);markRead(m.id)}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                  <span style={{fontWeight:600,fontSize:'0.9rem'}}>{m.nom}</span>
                  <span style={{fontSize:'0.75rem',color:'rgba(0,245,255,0.6)'}}>{m.email}</span>
                  {!m.lu && <span style={{fontSize:'0.65rem',background:'rgba(0,245,255,0.1)',color:'#00f5ff',padding:'2px 7px',borderRadius:100,fontFamily:'JetBrains Mono,monospace'}}>NOUVEAU</span>}
                </div>
                <div style={{fontWeight:600,fontSize:'0.82rem',marginBottom:4,color:'rgba(232,244,248,0.9)'}}>{m.sujet}</div>
                <div style={{fontSize:'0.8rem',color:'rgba(232,244,248,0.5)'}}>{m.message.slice(0,100)}...</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,flexShrink:0}}>
                <div style={{fontSize:'0.72rem',color:'rgba(232,244,248,0.4)'}}>{new Date(m.created_at).toLocaleDateString('fr-FR')}</div>
                <button className="abtn abtn-danger abtn-sm" onClick={e=>{e.stopPropagation();deleteMsg(m.id)}}>
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {selectedMsg && (
        <div className="modal-bg" onClick={()=>setSelectedMsg(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <button className="modal-close-btn" onClick={()=>setSelectedMsg(null)}><X size={20} /></button>
            <div style={{fontFamily:'Orbitron,monospace',fontSize:'0.85rem',color:'#00f5ff',marginBottom:16,letterSpacing:'0.08em'}}>MESSAGE COMPLET</div>
            <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:160}}>
                <div style={{fontSize:'0.65rem',color:'rgba(0,245,255,0.6)',marginBottom:3,fontFamily:'JetBrains Mono,monospace'}}>DE</div>
                <div style={{fontWeight:600}}>{selectedMsg.nom}</div>
                <div style={{fontSize:'0.82rem',color:'rgba(0,245,255,0.7)'}}>{selectedMsg.email}</div>
              </div>
              <div>
                <div style={{fontSize:'0.65rem',color:'rgba(0,245,255,0.6)',marginBottom:3,fontFamily:'JetBrains Mono,monospace'}}>DATE</div>
                <div style={{fontSize:'0.85rem'}}>{new Date(selectedMsg.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div style={{fontWeight:700,fontSize:'1rem',marginBottom:12,color:'#e8f4f8'}}>{selectedMsg.sujet}</div>
            <div style={{background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.1)',borderRadius:10,padding:16,lineHeight:1.8,color:'rgba(232,244,248,0.85)'}}>
              {selectedMsg.message}
            </div>
            <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.sujet}`}
              className="abtn abtn-primary" style={{marginTop:20,display:'inline-flex'}}>
              <Mail size={14} /> Répondre par email
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PRODUITS TAB ───────────────────────────────────────
function ProduitsTab({ products, setProducts, modal, setModal }) {
  const [form, setForm] = useState({ title:'', description:'', long_description:'', video_url:'', demo_url:'', tags:'', is_featured:false, is_discover:false })
  const [editId, setEditId] = useState(null)

  function openNew() { setForm({ title:'',description:'',long_description:'',video_url:'',demo_url:'',tags:'',is_featured:false,is_discover:false }); setEditId(null); setModal('product') }
  function openEdit(p) { setForm({...p, tags:(p.tags||[]).join(', ')}); setEditId(p.id); setModal('product') }

  async function save() {
    const data = { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) }
    if (editId) {
      setProducts(prev => prev.map(p => p.id===editId ? {...p,...data} : p))
      try { await supabase.from('products').update(data).eq('id',editId) } catch {}
    } else {
      const newP = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() }
      setProducts(prev => [newP, ...prev])
      try { await supabase.from('products').insert([data]) } catch {}
    }
    setModal(null)
  }

  async function del(id) {
    if (!confirm('Supprimer ce produit ?')) return
    setProducts(prev => prev.filter(p => p.id!==id))
    try { await supabase.from('products').delete().eq('id',id) } catch {}
  }

  function Toggle({ val, onChange }) {
    return <div className={`toggle ${val?'on':''}`} onClick={()=>onChange(!val)}><div className="toggle-dot"/></div>
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">PRODUITS / LOGICIELS ({products.length})</span>
          <button className="abtn abtn-primary" onClick={openNew}><Plus size={14}/> Nouveau produit</button>
        </div>

        {products.length === 0 ? (
          <div className="empty-state"><Package size={36}/><p>Aucun produit</p></div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {products.map(p => (
              <div key={p.id} style={{background:'rgba(0,245,255,0.03)',border:'1px solid rgba(0,245,255,0.1)',borderRadius:10,padding:'16px 18px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:180}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                    <span style={{fontWeight:700,fontSize:'0.95rem',color:'#00f5ff'}}>{p.title}</span>
                    {p.is_featured && <span style={{fontSize:'0.65rem',background:'rgba(0,245,255,0.1)',color:'#00f5ff',padding:'2px 7px',borderRadius:100,border:'1px solid rgba(0,245,255,0.2)'}}>⭐ À LA UNE</span>}
                    {p.is_discover && <span style={{fontSize:'0.65rem',background:'rgba(124,58,237,0.15)',color:'#a78bfa',padding:'2px 7px',borderRadius:100,border:'1px solid rgba(124,58,237,0.3)'}}>⚡ DÉCOUVRIR</span>}
                  </div>
                  <div style={{fontSize:'0.82rem',color:'rgba(232,244,248,0.6)',marginBottom:6}}>{p.description}</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {(p.tags||[]).map(t=><span key={t} style={{padding:'2px 7px',background:'rgba(0,245,255,0.07)',border:'1px solid rgba(0,245,255,0.15)',borderRadius:4,fontSize:'0.72rem',color:'#00f5ff'}}>{t}</span>)}
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="abtn abtn-outline abtn-sm" onClick={()=>openEdit(p)}><Edit2 size={12}/> Modifier</button>
                  <button className="abtn abtn-danger abtn-sm" onClick={()=>del(p.id)}><Trash2 size={12}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal === 'product' && (
        <div className="modal-bg" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <button className="modal-close-btn" onClick={()=>setModal(null)}><X size={20}/></button>
            <div style={{fontFamily:'Orbitron,monospace',fontSize:'0.85rem',color:'#00f5ff',marginBottom:20,letterSpacing:'0.08em'}}>
              {editId ? 'MODIFIER LE PRODUIT' : 'NOUVEAU PRODUIT'}
            </div>

            <div className="aform-group">
              <label className="aform-label">Titre *</label>
              <input className="aform-input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Nom du logiciel" />
            </div>
            <div className="aform-group">
              <label className="aform-label">Description courte *</label>
              <input className="aform-input" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Résumé en une phrase" />
            </div>
            <div className="aform-group">
              <label className="aform-label">Description longue</label>
              <textarea className="aform-textarea" value={form.long_description} onChange={e=>setForm(f=>({...f,long_description:e.target.value}))} placeholder="Description détaillée du produit..." rows={4} />
            </div>
            <div className="agrid-2">
              <div className="aform-group">
                <label className="aform-label">URL Vidéo (YouTube embed)</label>
                <input className="aform-input" value={form.video_url} onChange={e=>setForm(f=>({...f,video_url:e.target.value}))} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="aform-group">
                <label className="aform-label">URL Démo</label>
                <input className="aform-input" value={form.demo_url} onChange={e=>setForm(f=>({...f,demo_url:e.target.value}))} placeholder="https://demo.exemple.com" />
              </div>
            </div>
            <div className="aform-group">
              <label className="aform-label">Tags (séparés par virgule)</label>
              <input className="aform-input" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div style={{display:'flex',gap:24,marginBottom:20}}>
              <div className="toggle-wrap">
                <div className={`toggle ${form.is_featured?'on':''}`} onClick={()=>setForm(f=>({...f,is_featured:!f.is_featured}))}><div className="toggle-dot"/></div>
                <span style={{fontSize:'0.85rem'}}>⭐ À la une</span>
              </div>
              <div className="toggle-wrap">
                <div className={`toggle ${form.is_discover?'on':''}`} onClick={()=>setForm(f=>({...f,is_discover:!f.is_discover}))}><div className="toggle-dot"/></div>
                <span style={{fontSize:'0.85rem'}}>⚡ À découvrir</span>
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="abtn abtn-primary" onClick={save}><Save size={14}/> Enregistrer</button>
              <button className="abtn abtn-ghost" onClick={()=>setModal(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SERVICES TAB ───────────────────────────────────────
function ServicesTab({ services, setServices, modal, setModal }) {
  const [form, setForm] = useState({ title:'', description:'', price_range:'', icon:'🔧' })
  const [editId, setEditId] = useState(null)

  function openNew() { setForm({ title:'',description:'',price_range:'',icon:'🔧' }); setEditId(null); setModal('service') }
  function openEdit(s) { setForm({...s}); setEditId(s.id); setModal('service') }

  async function save() {
    if (editId) {
      setServices(prev => prev.map(s => s.id===editId ? {...s,...form} : s))
      try { await supabase.from('services').update(form).eq('id',editId) } catch {}
    } else {
      const newS = { ...form, id: Date.now().toString(), created_at: new Date().toISOString() }
      setServices(prev => [...prev, newS])
      try { await supabase.from('services').insert([form]) } catch {}
    }
    setModal(null)
  }

  async function del(id) {
    if (!confirm('Supprimer ce service ?')) return
    setServices(prev => prev.filter(s => s.id!==id))
    try { await supabase.from('services').delete().eq('id',id) } catch {}
  }

  const ICONS = ['🌐','📱','💼','🔌','☁️','🛡️','🔧','📊','🤖','⚡','🔐','📋']

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">SERVICES ({services.length})</span>
          <button className="abtn abtn-primary" onClick={openNew}><Plus size={14}/> Nouveau service</button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
          {services.map(s => (
            <div key={s.id} style={{background:'rgba(0,245,255,0.03)',border:'1px solid rgba(0,245,255,0.1)',borderRadius:10,padding:16}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{width:38,height:38,background:'rgba(0,245,255,0.08)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:'0.9rem',color:'#00f5ff'}}>{s.title}</div>
                  <div style={{fontSize:'0.72rem',color:'rgba(0,245,255,0.6)',fontFamily:'JetBrains Mono,monospace'}}>{s.price_range}</div>
                </div>
              </div>
              <div style={{fontSize:'0.82rem',color:'rgba(232,244,248,0.6)',marginBottom:12}}>{s.description}</div>
              <div style={{display:'flex',gap:8}}>
                <button className="abtn abtn-outline abtn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>openEdit(s)}><Edit2 size={11}/> Modifier</button>
                <button className="abtn abtn-danger abtn-sm" onClick={()=>del(s.id)}><Trash2 size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal === 'service' && (
        <div className="modal-bg" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <button className="modal-close-btn" onClick={()=>setModal(null)}><X size={20}/></button>
            <div style={{fontFamily:'Orbitron,monospace',fontSize:'0.85rem',color:'#00f5ff',marginBottom:20,letterSpacing:'0.08em'}}>
              {editId ? 'MODIFIER LE SERVICE' : 'NOUVEAU SERVICE'}
            </div>

            <div className="aform-group">
              <label className="aform-label">Icône</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:4}}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={()=>setForm(f=>({...f,icon:ic}))}
                    style={{width:38,height:38,border:`2px solid ${form.icon===ic?'#00f5ff':'rgba(0,245,255,0.15)'}`,borderRadius:8,background:form.icon===ic?'rgba(0,245,255,0.1)':'transparent',fontSize:18,cursor:'pointer',transition:'all 0.15s'}}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="aform-group">
              <label className="aform-label">Titre *</label>
              <input className="aform-input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Nom du service" />
            </div>
            <div className="aform-group">
              <label className="aform-label">Description</label>
              <textarea className="aform-textarea" rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description du service..." />
            </div>
            <div className="aform-group">
              <label className="aform-label">Tarif</label>
              <input className="aform-input" value={form.price_range} onChange={e=>setForm(f=>({...f,price_range:e.target.value}))} placeholder="À partir de 500 000 Ar / Sur devis" />
            </div>
            <div style={{display:'flex',gap:10,marginTop:4}}>
              <button className="abtn abtn-primary" onClick={save}><Save size={14}/> Enregistrer</button>
              <button className="abtn abtn-ghost" onClick={()=>setModal(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
