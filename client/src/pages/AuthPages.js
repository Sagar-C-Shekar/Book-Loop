import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FormField = ({ label, type = 'text', value, onChange, placeholder, required }) => (
  <div style={{ marginBottom: 18 }}>
    <label className="form-label-custom">{label}</label>
    <input type={type} className="form-control-custom" value={value} onChange={onChange}
      placeholder={placeholder} required={required} />
  </div>
);

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1a1a2e 100%)', padding: '100px 20px 40px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your BookLoop account</p>
        </div>
        <div className="card-custom" style={{ padding: 32 }}>
          {error && <div className="alert-custom alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <FormField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <FormField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
            <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Join for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.location);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1a1a2e 100%)', padding: '100px 20px 40px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌟</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Join BookLoop</h1>
          <p style={{ color: 'var(--text-muted)' }}>Start exchanging books and earn credits</p>
        </div>
        <div className="card-custom" style={{ padding: 32 }}>
          {/* Welcome bonus badge */}
          <div style={{ background: 'rgba(200,161,101,0.1)', border: '1px solid rgba(200,161,101,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🎁</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>Get 50 welcome credits on signup!</span>
          </div>
          {error && <div className="alert-custom alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <FormField label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
            <FormField label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" required />
            <FormField label="Password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" required />
            <FormField label="Location (Optional)" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, Country" />
            <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
