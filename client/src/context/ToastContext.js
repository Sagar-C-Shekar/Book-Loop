import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const iconMap = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const colorMap = { success: 'var(--accent-teal)', error: 'var(--accent-rose)', warning: 'var(--accent-gold)', info: 'var(--accent-purple)' };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map(toast => (
          <div key={toast.id} className="toast-bookloop d-flex align-items-center gap-2 p-3 mb-2 animate-fade-up">
            <i className={`fas ${iconMap[toast.type]}`} style={{ color: colorMap[toast.type], flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', flex: 1 }}>{toast.message}</span>
            <button className="btn btn-sm p-0 ms-2" onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', lineHeight: 1 }}>
              <i className="fas fa-times" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
