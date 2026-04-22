import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: t.type === 'success' ? 'rgba(0,201,167,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${t.type === 'success' ? 'rgba(0,201,167,0.4)' : 'rgba(239,68,68,0.4)'}`,
            borderRadius: 10, padding: '12px 16px', minWidth: 280,
            backdropFilter: 'blur(12px)', animation: 'fadeUp 0.3s ease',
            color: 'var(--white)', fontSize: '0.9rem'
          }}>
            {t.type === 'success'
              ? <CheckCircle size={18} color="var(--teal)" style={{ flexShrink: 0 }} />
              : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            }
            <span style={{ flex: 1 }}>{t.message}</span>
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: 'var(--white-dim)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
