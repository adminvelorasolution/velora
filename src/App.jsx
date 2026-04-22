import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import HomePage from './pages/HomePage'
import AProposPage from './pages/AProposPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ProduitsPage from './pages/ProduitsPage'
import ContactPage from './pages/ContactPage'
import DevisPage from './pages/DevisPage'
import MonComptePage from './pages/MonComptePage'
import { ConnexionPage, InscriptionPage } from './pages/AuthPages'
import AdminPage from './pages/AdminPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Cursor />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apropos" element={<AProposPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/produits" element={<ProduitsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/devis" element={<DevisPage />} />
          <Route path="/mon-compte" element={<MonComptePage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div style={{ paddingTop: 120, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 900, color: 'var(--cyan)', opacity: 0.3 }}>404</div>
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Page introuvable</h2>
                <a href="/" className="btn btn-primary">Retour à l'accueil</a>
              </div>
            </div>
          } />
        </Routes>
        <Footer />
      </ToastProvider>
    </AuthProvider>
  )
}
