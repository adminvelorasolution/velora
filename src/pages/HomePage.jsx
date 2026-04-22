import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Star, Code2, Layers, Zap, Shield, Users, TrendingUp, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ─── MOCK DATA (used when Supabase not configured) ───
const MOCK_FEATURED = [
  {
    id: '1', title: 'NexaFlow ERP', description: 'Solution ERP complète pour PME — gestion stocks, RH, comptabilité et CRM en un seul logiciel.',
    image_url: null, video_url: '', tags: ['ERP','React','Node.js'], is_featured: true, demo_url: '#'
  },
  {
    id: '2', title: 'DataSense AI', description: 'Plateforme d\'analyse de données avec intelligence artificielle intégrée pour prédictions métier.',
    image_url: null, video_url: '', tags: ['AI','Python','Dashboard'], is_featured: true, demo_url: '#'
  },
  {
    id: '3', title: 'SecureVault Pro', description: 'Système de gestion documentaire sécurisé avec chiffrement de bout en bout et contrôle d\'accès granulaire.',
    image_url: null, video_url: '', tags: ['Security','Cloud','API'], is_featured: true, demo_url: '#'
  },
]

const MOCK_DISCOVER = [
  { id: '4', title: 'TaskMaster Suite', description: 'Gestion de projets agile avec tableaux Kanban, suivi du temps et rapports automatisés.', tags: ['SaaS','Vue.js'], is_discover: true },
  { id: '5', title: 'ConnectHub API', description: 'Middleware d\'intégration pour connecter vos systèmes existants avec des APIs modernes.', tags: ['API','Middleware'], is_discover: true },
]

const ICONS_MAP = [Code2, Layers, Zap, Shield]

export default function HomePage() {
  const [featured, setFeatured] = useState(MOCK_FEATURED)
  const [discover, setDiscover] = useState(MOCK_DISCOVER)
  const [videoOpen, setVideoOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data: feat } = await supabase.from('products').select('*').eq('is_featured', true).limit(3)
      if (feat?.length) setFeatured(feat)
      const { data: disc } = await supabase.from('products').select('*').eq('is_discover', true).limit(4)
      if (disc?.length) setDiscover(disc)
    } catch {}
  }

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero grid-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-scanline" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 760, opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <div className="badge animate-pulse-glow" style={{ marginBottom: 24 }}>
              ⚡ SOLUTIONS LOGICIELLES INNOVANTES
            </div>

            <h1 className="display" style={{ marginBottom: 24 }}>
              <span style={{ display: 'block' }}>CRÉER.</span>
              <span className="glow" style={{ display: 'block' }}>INNOVER.</span>
              <span style={{ display: 'block', color: 'var(--white-dim)' }}>TRANSFORMER.</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--white-dim)', maxWidth: 540, marginBottom: 40, lineHeight: 1.8 }}>
              Nous concevons des logiciels sur mesure qui propulsent votre entreprise vers l'avenir.
              Solutions performantes, sécurisées et scalables.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/devis" className="btn btn-primary">
                Demander un devis <ArrowRight size={16} />
              </Link>
              <button className="btn btn-outline" onClick={() => setVideoOpen(true)}>
                <Play size={16} /> Voir la démo
              </button>
              <Link to="/produits" className="btn btn-ghost">
                Nos produits <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 40, marginTop: 56, flexWrap: 'wrap' }}>
              {[['50+', 'Projets livrés'], ['98%', 'Clients satisfaits'], ['5+', 'Ans d\'expérience'], ['24/7', 'Support']].map(([v, l]) => (
                <div key={l}>
                  <div className="stat-value">{v}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUITS À LA UNE ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-label">
                <span className="mono">// PRODUITS PHARES</span>
              </div>
              <h2 className="heading">Nos logiciels <span className="glow">à la une</span></h2>
            </div>
            <Link to="/produits" className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {featured.map((p, i) => (
              <FeaturedCard key={p.id} product={p} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES RAPIDE ── */}
      <section className="section" style={{ background: 'rgba(0,245,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>NOS EXPERTISES</div>
            <h2 className="heading">Ce que nous <span className="glow">faisons</span></h2>
          </div>
          <div className="grid-4">
            {[
              { icon: Code2, label: 'Développement', desc: 'Web, mobile, desktop — nous construisons tout.' },
              { icon: Layers, label: 'Architecture', desc: 'Systèmes robustes, scalables et maintenables.' },
              { icon: Zap, label: 'Performance', desc: 'Optimisation et amélioration continue des apps.' },
              { icon: Shield, label: 'Sécurité', desc: 'Protection des données et audits de sécurité.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: 'var(--cyan-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={24} color="var(--cyan)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 8 }}>{label}</h3>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem' }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/services" className="btn btn-outline">Tous nos services <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* ── À DÉCOUVRIR ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-label">
                <span className="mono">// NOUVEAUTÉS</span>
              </div>
              <h2 className="heading">Produits à <span className="glow">découvrir</span></h2>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 20 }}>
            {discover.map(p => (
              <div key={p.id} className="card" style={{ padding: 28, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, var(--cyan-dim), var(--accent-glow))', borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color="var(--cyan)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.875rem', marginBottom: 16 }}>{p.description}</p>
                  <Link to={`/produits/${p.id}`} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                    En savoir plus <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-sm">
        <div className="container">
          <div className="card" style={{ padding: '60px 48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,245,255,0.06) 0%, rgba(124,58,237,0.06) 100%)' }}>
            <div className="badge" style={{ marginBottom: 20 }}>PRÊT À DÉMARRER ?</div>
            <h2 className="heading" style={{ marginBottom: 16 }}>Transformons votre <span className="glow">vision</span> en réalité</h2>
            <p style={{ color: 'var(--white-dim)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Parlez-nous de votre projet. Nous vous proposerons une solution sur mesure sous 48h.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/devis" className="btn btn-primary">Demander un devis <ArrowRight size={16} /></Link>
              <Link to="/contact" className="btn btn-outline">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {videoOpen && (
        <div className="modal-overlay" onClick={() => setVideoOpen(false)}>
          <div style={{ width: '90%', maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Démo Velora"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => setVideoOpen(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function FeaturedCard({ product, delay }) {
  const colors = ['var(--cyan)', '#a78bfa', 'var(--teal)']
  const color = colors[delay / 100] || 'var(--cyan)'

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', animationDelay: `${delay}ms` }}>
      {/* Image / Placeholder */}
      <div style={{ height: 180, background: `linear-gradient(135deg, rgba(0,245,255,0.08), rgba(124,58,237,0.12))`, position: 'relative', overflow: 'hidden' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={48} color={color} opacity={0.3} />
            </div>
          )
        }
        <div className="featured-ribbon">⭐ À LA UNE</div>
        {product.video_url && (
          <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <div className="play-btn" style={{ width: 40, height: 40 }}>
              <Play size={16} color="var(--bg)" />
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {(product.tags || []).slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 10, color }}>{product.title}</h3>
        <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>{product.description}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/produits/${product.id}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: '0.75rem' }}>
            Détails
          </Link>
          <Link to="/devis" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: '0.75rem' }}>
            Devis
          </Link>
        </div>
      </div>
    </div>
  )
}
