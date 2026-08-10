import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiBookshelf } from 'react-icons/gi';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.location);
      toast.success('Welcome to BookLoop! You\'ve got 50 free credits 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse at center, rgba(78,205,196,0.04) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <GiBookshelf size={40} color="var(--accent-primary)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: 12, marginBottom: 6 }}>Join BookLoop</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Start your book exchange journey today</p>
        </div>
        <div style={{ background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.2)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, textAlign: 'center', fontSize: '0.875rem', color: 'var(--accent-primary)' }}>
          🎁 Get <strong>50 free credits</strong> on signup!
        </div>
        <div className="card-dark" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            {[
              { icon: FiUser, label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
              { icon: FiMail, label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { icon: FiMapPin, label: 'Location (optional)', key: 'location', type: 'text', placeholder: 'City, Country' }
            ].map(({ icon: Icon, label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label className="form-label-dark">{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type={type} className="form-control-dark" value={form[key]}
                    onChange={e => setForm({...form, [key]: e.target.value})}
                    placeholder={placeholder} required={key !== 'location'}
                    style={{ paddingLeft: 38, width: '100%' }} />
                </div>
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label className="form-label-dark">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} className="form-control-dark" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min. 6 characters" required
                  style={{ paddingLeft: 38, paddingRight: 38, width: '100%' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', padding: 13, fontSize: '1rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
