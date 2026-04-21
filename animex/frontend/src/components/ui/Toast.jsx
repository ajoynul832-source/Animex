'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastCtx = createContext(null);

const ICONS = {
  success: <CheckCircle size={16} style={{ color: 'var(--success)' }} />,
  error:   <XCircle    size={16} style={{ color: 'var(--error)'   }} />,
  info:    <Info       size={16} style={{ color: 'var(--info)'    }} />,
  warning: <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => remove(id), duration);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const toast = {
    success: (m, d) => add(m, 'success', d),
    error:   (m, d) => add(m, 'error',   d),
    info:    (m, d) => add(m, 'info',    d),
    warning: (m, d) => add(m, 'warning', d),
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">{ICONS[t.type]}</span>
            <span className="toast-msg">{t.msg}</span>
            <button className="toast-close" onClick={() => remove(t.id)}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
