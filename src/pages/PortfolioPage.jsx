import { useState, useEffect, useRef } from 'react'
import { ExternalLink, Github, ArrowRight, Play, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ── MOCK DATA ─────────────────────────────────────────────────
const MOCK = [
  {
    id:'1', num:'01', title:'NexaFlow ERP',
    subtitle:'Enterprise Resource Planning',
    description:'Système ERP complet pour une PME de 150 employés. Modules : RH, Comptabilité, Stock, CRM intégrés dans une interface unifiée.',
    tags:['React','Node.js','PostgreSQL'], category:'logiciel',
    color:'#00f5ff', demo_url:'#', github_url:'#',
    accent: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,201,167,0.08))'
  },
  {
    id:'2', num:'02', title:'DataSense AI',
    subtitle:'Artificial Intelligence Platform',
    description:'Tableau de bord analytique temps réel avec IA prédictive. Extraction d\'insights métier à partir de vos données brutes.',
    tags:['Python','TensorFlow','Vue.js'], category:'ia',
    color:'#a78bfa', demo_url:'#', github_url:'#',
    accent: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,245,255,0.05))'
  },
  {
    id:'3', num:'03', title:'SecureVault DMS',
    subtitle:'Document Management System',
    description:'Système de gestion documentaire avec chiffrement E2E pour cabinet juridique. 100% conforme RGPD.',
    tags:['Next.js','AWS','Security'], category:'securite',
    color:'#00c9a7', demo_url:'#', github_url:'#',
    accent: 'linear-gradient(135deg, rgba(0,201,167,0.12), rgba(0,245,255,0.06))'
  },
  {
    id:'4', num:'04', title:'MobiStock',
    subtitle:'Mobile Inventory App',
    description:'Application mobile de gestion d\'inventaire avec scan QR code pour distributeur régional. iOS & Android.',
    tags:['React Native','Firebase'], category:'mobile',
    color:'#f59e0b', demo_url:'#', github_url:'#',
    accent: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(124,58,237,0.08))'
  },
  {
    id:'5', num:'05', title:'TaskMaster Pro',
    subtitle:'SaaS Project Management',
    description:'Plateforme SaaS de gestion de projets agile pour agences digitales. Kanban, Scrum, time tracking.',
    tags:['React','Supabase','Stripe'], category:'saas',
    color:'#00f5ff', demo_url:'#', github_url:'#',
    accent: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(0,201,167,0.08))'
  },
  {
    id:'6', num:'06', title:'ConnectHub API',
    subtitle:'Integration Gateway',
    description:'Gateway API unifiant 12 systèmes legacy pour une banque régionale. 99.9% uptime garanti.',
    tags:['Node.js','GraphQL','Docker'], category:'api',
    color:'#a78bfa', demo_url:'#', github_url:'#',
    accent: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(0,201,167,0.06))'
  },
]

const CATS = ['Tous', 'logiciel', 'ia', 'mobile', 'saas', 'api', 'securite']

// Animated shapes SVG
function FloatingShape({ color, style }) {
  return (
    <svg viewBox="0 0 200 200" style={{ position:'absolute', opacity:0.07, ...style }} xmlns="http://www.w3.org/2000/svg">
      <path d="M 100 0 C 150 0 200 50 200 100 C 200 150 150 200 100 200 C 50 200 0 150 0 100 C 0 50 50 0 100 0 Z"
        fill={color} style={{ animation:'rotateSlow 20s linear infinite', transformOrigin:'center' }}/>
    </svg>
  )
}

// Animated number counter
function AnimNum({ n }) {
  const [v, setV] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = () => { start += Math.ceil(n/30); if(start>=n){setV(n);return}; setV(start); requestAnimationFrame(step) }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [n])
  return <span ref={ref}>{v}</span>
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState(MOCK)
  const [cat, setCat] = useState('Tous')
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState({})
  const refs = useRef({})

  useEffect(() => {
    supabase.from('portfolio').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setProjects(data) })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true }))
      })
    }, { threshold: 0.15 })
    Object.values(refs.current).forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [projects])

  const filtered = cat === 'Tous' ? projects : projects.filter(p => (p.category||'') === cat)

  return (
    <main style={{ paddingTop:80, background:'var(--bg)', minHeight:'100vh', overflow:'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ padding:'80px 0 60px', position:'relative', overflow:'hidden' }}>
        <FloatingShape color="#00f5ff" style={{ width:500, height:500, top:-100, right:-100, animation:'rotateSlow 25s linear infinite' }} />
        <FloatingShape color="#7c3aed" style={{ width:300, height:300, bottom:-50, left:-50, animation:'rotateSlow 18s linear infinite reverse' }} />

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:16, marginBottom:64 }}>
            <div className="mono" style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ width:32, height:1, background:'var(--cyan)', display:'inline-block' }} />
              PORTFOLIO
            </div>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(2.5rem,7vw,5.5rem)', fontWeight:900, lineHeight:1.05, letterSpacing:'-0.03em' }}>
              NOS<br />
              <span className="glow">RÉALISATIONS</span>
            </h1>
            <p style={{ color:'var(--white-dim)', fontSize:'1rem', maxWidth:480, lineHeight:1.8 }}>
              Des solutions logicielles conçues avec passion pour transformer les entreprises africaines.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:48, flexWrap:'wrap', paddingTop:32, borderTop:'1px solid var(--border)' }}>
            {[
              { n:50, label:'Projets livrés', suffix:'+' },
              { n:40, label:'Clients actifs', suffix:'+' },
              { n:5, label:'Ans d\'expérience', suffix:'+' },
              { n:98, label:'Satisfaction client', suffix:'%' },
            ].map(({ n, label, suffix }) => (
              <div key={label}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'2.5rem', fontWeight:900, color:'var(--cyan)', lineHeight:1 }}>
                  <AnimNum n={n} />{suffix}
                </div>
                <div style={{ fontSize:'0.8rem', color:'var(--white-dim)', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER ── */}
      <section style={{ padding:'0 0 40px' }}>
        <div className="container">
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:'7px 18px', borderRadius:100,
                border: `1px solid ${cat===c ? 'var(--cyan)' : 'var(--border)'}`,
                background: cat===c ? 'rgba(0,245,255,0.12)' : 'transparent',
                color: cat===c ? 'var(--cyan)' : 'var(--white-dim)',
                fontFamily:"'JetBrains Mono',monospace", fontSize:'0.72rem',
                letterSpacing:'0.08em', cursor:'pointer', transition:'all 0.2s',
                textTransform:'uppercase'
              }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS LIST — Style Simon Sparks ── */}
      <section style={{ paddingBottom:100 }}>
        <div className="container">
          {filtered.map((p, i) => {
            const isEven = i % 2 === 0
            const isVis = visible[p.id]
            const isHov = hovered === p.id
            const color = p.color || 'var(--cyan)'

            return (
              <div
                key={p.id}
                ref={el => refs.current[p.id] = el}
                data-id={p.id}
                style={{
                  display:'grid',
                  gridTemplateColumns: isEven ? '1fr 1.2fr' : '1.2fr 1fr',
                  gap:0,
                  marginBottom:2,
                  opacity: isVis ? 1 : 0,
                  transform: isVis ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.7s ease ${i*0.08}s, transform 0.7s ease ${i*0.08}s`,
                  cursor:'pointer',
                  borderBottom:'1px solid var(--border)',
                }}
                onClick={() => setSelected(p)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Visual pane */}
                {isEven ? null : (
                  <div style={{
                    background: p.accent || 'rgba(0,245,255,0.05)',
                    minHeight:320,
                    position:'relative',
                    overflow:'hidden',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    borderRight:'1px solid var(--border)',
                  }}>
                    <ProjectVisual p={p} hovered={isHov} />
                  </div>
                )}

                {/* Content pane */}
                <div style={{
                  padding:'52px 48px',
                  display:'flex', flexDirection:'column', justifyContent:'center',
                  background: isHov ? 'rgba(0,245,255,0.02)' : 'transparent',
                  transition:'background 0.3s',
                  borderRight: isEven ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', color, opacity:0.7 }}>
                      {p.num || `0${i+1}`}
                    </span>
                    <span style={{ width:40, height:1, background:color, opacity:0.4, display:'inline-block' }} />
                    {p.category && (
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:'var(--white-dim)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
                        {p.category}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom:8, fontFamily:"'JetBrains Mono',monospace", fontSize:'0.72rem', color, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    {p.subtitle || 'PROJECT'}
                  </div>

                  <h2 style={{
                    fontFamily:"'Orbitron',monospace", fontSize:'clamp(1.6rem,3vw,2.5rem)',
                    fontWeight:900, lineHeight:1.1, marginBottom:20,
                    color: isHov ? color : 'var(--white)',
                    transition:'color 0.3s'
                  }}>
                    {p.title}
                  </h2>

                  <p style={{ color:'var(--white-dim)', fontSize:'0.9rem', lineHeight:1.8, marginBottom:28, maxWidth:440 }}>
                    {p.description}
                  </p>

                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:32 }}>
                    {(p.tags||[]).map(t => (
                      <span key={t} style={{
                        padding:'4px 12px', border:`1px solid ${color}33`,
                        borderRadius:100, fontSize:'0.72rem', color,
                        fontFamily:"'JetBrains Mono',monospace",
                        background:`${color}0a`
                      }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <button style={{
                      display:'flex', alignItems:'center', gap:8,
                      background:'none', border:'none', cursor:'pointer',
                      fontFamily:"'Orbitron',monospace", fontSize:'0.75rem',
                      fontWeight:700, letterSpacing:'0.1em', color,
                      padding:0,
                      transition:'gap 0.2s'
                    }}>
                      VOIR LE PROJET
                      <div style={{
                        width:28, height:28, borderRadius:'50%',
                        border:`1px solid ${color}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        transform: isHov ? 'translateX(4px)' : 'translateX(0)',
                        transition:'transform 0.3s'
                      }}>
                        <ArrowRight size={13} color={color} />
                      </div>
                    </button>

                    {p.github_url && p.github_url !== '#' && (
                      <a href={p.github_url} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ color:'var(--white-dim)', display:'flex', alignItems:'center', gap:4, fontSize:'0.78rem', textDecoration:'none' }}>
                        <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Visual pane right */}
                {isEven && (
                  <div style={{
                    background: p.accent || 'rgba(0,245,255,0.05)',
                    minHeight:320,
                    position:'relative',
                    overflow:'hidden',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <ProjectVisual p={p} hovered={isHov} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding:'80px 0', borderTop:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <FloatingShape color="#00f5ff" style={{ width:400, height:400, top:-100, left:'30%', opacity:0.05 }} />
        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <div className="mono" style={{ marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
            <span style={{ width:24, height:1, background:'var(--cyan)', display:'inline-block' }} />
            VOTRE PROCHAIN PROJET
            <span style={{ width:24, height:1, background:'var(--cyan)', display:'inline-block' }} />
          </div>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, marginBottom:16 }}>
            Organiser votre <span className="glow">transformation</span> ?
          </h2>
          <p style={{ color:'var(--white-dim)', marginBottom:36, maxWidth:480, margin:'0 auto 36px' }}>
            Parlez-nous de votre projet. Nous le concrétiserons ensemble.
          </p>
          <a href="/contact" className="btn btn-primary" style={{ fontSize:'0.85rem' }}>
            Nous contacter <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ── MODAL DETAIL ── */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(2,4,8,0.92)', backdropFilter:'blur(12px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setSelected(null)}>
          <div style={{ background:'#060d14', border:'1px solid rgba(0,245,255,0.25)', borderRadius:20, width:'100%', maxWidth:680, maxHeight:'88vh', overflowY:'auto', padding:40, position:'relative' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'var(--white-dim)', cursor:'pointer' }}>
              <X size={22} />
            </button>

            <div style={{ marginBottom:8, fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', color: selected.color||'var(--cyan)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
              {selected.subtitle || selected.category}
            </div>
            <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'2rem', fontWeight:900, marginBottom:16, color: selected.color||'var(--cyan)' }}>
              {selected.title}
            </h2>

            <div style={{ height:200, background: selected.accent||'rgba(0,245,255,0.06)', borderRadius:12, marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
              <ProjectVisual p={selected} hovered={true} large={true} />
            </div>

            <p style={{ color:'var(--white-dim)', lineHeight:1.8, marginBottom:24 }}>{selected.description}</p>

            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:28 }}>
              {(selected.tags||[]).map(t => (
                <span key={t} style={{ padding:'4px 12px', border:`1px solid ${(selected.color||'var(--cyan)')}33`, borderRadius:100, fontSize:'0.75rem', color: selected.color||'var(--cyan)', fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>
              ))}
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {selected.demo_url && selected.demo_url !== '#' && (
                <a href={selected.demo_url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize:'0.8rem' }}>
                  <ExternalLink size={13} /> Voir la démo
                </a>
              )}
              {selected.github_url && selected.github_url !== '#' && (
                <a href={selected.github_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize:'0.8rem' }}>
                  <Github size={13} /> Code source
                </a>
              )}
              <a href="/devis" className="btn btn-ghost" style={{ fontSize:'0.8rem' }}>
                Projet similaire ? <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// ── Project visual (animated SVG placeholder) ─────────────────
function ProjectVisual({ p, hovered, large }) {
  const color = p.color || '#00f5ff'
  const size = large ? 160 : 100

  return (
    <>
      {/* Grid overlay */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(${color}08 1px, transparent 1px), linear-gradient(90deg, ${color}08 1px, transparent 1px)`,
        backgroundSize:'30px 30px',
      }} />

      {/* Number big */}
      <div style={{
        position:'absolute', right:20, bottom:10,
        fontFamily:"'Orbitron',monospace", fontSize:'5rem', fontWeight:900,
        color, opacity:0.07, lineHeight:1, userSelect:'none',
        transition:'opacity 0.3s',
      }}>
        {p.num || '01'}
      </div>

      {/* Animated ring */}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{
        position:'relative', zIndex:1,
        animation: hovered ? 'rotateSlow 4s linear infinite' : 'rotateSlow 12s linear infinite',
        filter: hovered ? `drop-shadow(0 0 16px ${color})` : `drop-shadow(0 0 6px ${color}66)`,
        transition:'filter 0.4s',
      }}>
        <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="8 4" opacity="0.6" />
        <circle cx="50" cy="50" r="22" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
        <circle cx="50" cy="50" r="8" fill={color} opacity="0.9" />
        <circle cx="50" cy="15" r="3.5" fill={color} opacity="0.7" />
        <line x1="50" y1="15" x2="50" y2="28" stroke={color} strokeWidth="1" opacity="0.4" />
      </svg>

      {/* Tags floating */}
      {(p.tags||[]).slice(0,2).map((t, i) => (
        <div key={t} style={{
          position:'absolute',
          top: i===0 ? 20 : undefined,
          bottom: i===1 ? 20 : undefined,
          left: 16,
          fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem',
          color, background:`${color}12`, border:`1px solid ${color}22`,
          padding:'3px 8px', borderRadius:100,
          opacity: hovered ? 0.9 : 0.4,
          transition:'opacity 0.3s',
        }}>{t}</div>
      ))}
    </>
  )
}
