import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Star, Code2, ArrowRight, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'

const MOCK_ALL = [
  { id:'1', title:'NexaFlow ERP', description:'Solution ERP complète pour PME.', long_description:'NexaFlow est un ERP modulaire conçu pour les PME africaines. Il intègre la gestion des stocks, des ressources humaines, de la comptabilité et du CRM dans une interface intuitive.', image_url:null, video_url:'https://www.youtube.com/embed/dQw4w9WgXcQ', tags:['ERP','React','Node.js','PostgreSQL'], is_featured:true, is_discover:true, demo_url:'#' },
  { id:'2', title:'DataSense AI', description:'Analyse de données avec intelligence artificielle.', long_description:'Plateforme d\'analyse prédictive utilisant le machine learning pour extraire des insights métier de vos données. Tableaux de bord en temps réel.', image_url:null, video_url:'', tags:['AI','Python','Dashboard'], is_featured:true, is_discover:false, demo_url:'#' },
  { id:'3', title:'SecureVault Pro', description:'Gestion documentaire sécurisée.', long_description:'Système DMS avec chiffrement E2E, gestion des droits granulaire et workflows d\'approbation. Conforme RGPD.', image_url:null, video_url:'', tags:['Security','Cloud','React'], is_featured:true, is_discover:false, demo_url:'#' },
  { id:'4', title:'TaskMaster Suite', description:'Gestion de projets agile.', long_description:'Suite complète pour la gestion de projets : Kanban, Scrum, suivi du temps, facturation et rapports automatisés.', image_url:null, video_url:'', tags:['SaaS','Vue.js','Supabase'], is_featured:false, is_discover:true, demo_url:'#' },
  { id:'5', title:'ConnectHub API', description:'Middleware d\'intégration systèmes.', long_description:'Gateway API universelle pour connecter vos systèmes legacy avec des APIs modernes. Gestion des quotas, monitoring et logs.', image_url:null, video_url:'', tags:['API','Node.js','Docker'], is_featured:false, is_discover:true, demo_url:'#' },
]

export default function ProduitsPage() {
  const [tab, setTab] = useState('tous')
  const [products, setProducts] = useState(MOCK_ALL)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setProducts(data) })
  }, [])

  const filtered = tab === 'tous' ? products
    : tab === 'vedette' ? products.filter(p => p.is_featured)
    : products.filter(p => p.is_discover)

  return (
    <main style={{ paddingTop: 80 }}>
      <section className="section grid-bg" style={{ paddingTop: 60 }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 20 }}>NOS LOGICIELS</div>
            <h1 className="heading" style={{ marginBottom: 16 }}>
              Nos <span className="glow">produits</span>
            </h1>
            <p style={{ color: 'var(--white-dim)' }}>Solutions logicielles prêtes à l'emploi ou personnalisables selon vos besoins.</p>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ maxWidth: 400, marginBottom: 40 }}>
            {[['tous','Tous'],['vedette','À la une'],['decouvrir','À découvrir']].map(([v,l]) => (
              <button key={v} className={`tab ${tab===v?'active':''}`} onClick={() => setTab(v)}>{l}</button>
            ))}
          </div>

          <div className="grid-3" style={{ gap: 28 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onSelect={() => setSelected(p)} />)}
          </div>
        </div>
      </section>

      {/* MODAL DETAIL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>

            {selected.video_url && (
              <div className="video-wrapper" style={{ marginBottom: 24 }}>
                <iframe src={selected.video_url} title={selected.title} frameBorder="0" allowFullScreen />
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {(selected.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
              {selected.is_featured && <span className="badge">⭐ À la une</span>}
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cyan)', marginBottom: 12 }}>{selected.title}</h2>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: 28 }}>
              {selected.long_description || selected.description}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/devis" className="btn btn-primary" onClick={() => setSelected(null)}>
                Demander un devis <ArrowRight size={14} />
              </Link>
              {selected.demo_url && selected.demo_url !== '#' && (
                <a href={selected.demo_url} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <Play size={14} /> Voir la démo
                </a>
              )}
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function ProductCard({ product, onSelect }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={onSelect}>
      <div style={{ height: 160, background: 'linear-gradient(135deg, rgba(0,245,255,0.07), rgba(124,58,237,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <Code2 size={42} color="var(--cyan)" opacity={0.22} />
        }
        {product.is_featured && <div className="featured-ribbon">⭐ À LA UNE</div>}
        {product.video_url && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, width: 36, height: 36, background: 'var(--cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--cyan-glow)' }}>
            <Play size={14} color="var(--bg)" />
          </div>
        )}
        {product.is_discover && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{ padding: '4px 10px', background: 'rgba(124,58,237,0.4)', border: '1px solid rgba(124,58,237,0.5)', borderRadius: 100, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#c4b5fd' }}>
              <Zap size={10} style={{ display:'inline', marginRight: 4 }} />NOUVEAU
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {(product.tags || []).slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 8, color: 'var(--cyan)' }}>{product.title}</h3>
        <p style={{ color: 'var(--white-dim)', fontSize: '0.825rem', lineHeight: 1.6, marginBottom: 16 }}>{product.description}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: '0.75rem' }}>
            Voir les détails
          </button>
          <Link to="/devis" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: '0.75rem' }} onClick={e => e.stopPropagation()}>
            Devis
          </Link>
        </div>
      </div>
    </div>
  )
}
