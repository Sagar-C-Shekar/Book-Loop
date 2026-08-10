import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiBookshelf } from 'react-icons/gi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse at center, rgba(232,197,71,0.04) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <GiBookshelf size={40} color="var(--accent-primary)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: 12, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your BookLoop account</p>
        </div>
        <div className="card-dark" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label-dark">Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="form-control-dark" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com" required
                  style={{ paddingLeft: 38, width: '100%' }} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="form-label-dark">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} className="form-control-dark" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Your password" required
                  style={{ paddingLeft: 38, paddingRight: 38, width: '100%' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-gold" disabled={loading}
              style={{ width: '100%', padding: 13, fontSize: '1rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Join free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
