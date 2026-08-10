import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiBook, FiBell, FiUser, FiLogOut, FiPlusCircle, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi';
import { GiBookshelf } from 'react-icons/gi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      axios.get('/api/notifications').then(r => setNotifications(r.data)).catch(() => {});
    }
  }, [user, location.pathname]);

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const markAllRead = async () => {
    await axios.put('/api/notifications/read-all').catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navStyle = {
    background: scrolled ? 'rgba(15,14,23,0.97)' : 'rgba(15,14,23,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${scrolled ? '#2a2a4a' : 'transparent'}`,
    transition: 'all 0.3s ease',
    position: 'sticky', top: 0, zIndex: 1000,
    padding: '0 24px'
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <GiBookshelf size={28} color="var(--accent-primary)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Book<span style={{ color: 'var(--accent-primary)' }}>Loop</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <NavLink to="/" active={isActive('/')}>Browse</NavLink>
          <NavLink to="/leaderboard" active={isActive('/leaderboard')}>Leaderboard</NavLink>
          {user && <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>}
          {user && <NavLink to="/exchanges" active={isActive('/exchanges')}>Exchanges</NavLink>}
          {user && (
            <Link to="/add-book" className="btn-gold" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiPlusCircle size={15} /> List Book
            </Link>
          )}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Credit chip */}
              <div className="credit-chip">⭐ {user.credits}</div>
              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifs(!showNotifs)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', padding: 4 }}>
                  <FiBell size={20} />
                  {unread > 0 && (
                    <span style={{
                      position: 'absolute', top: -2, right: -2, background: 'var(--accent-secondary)',
                      color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.65rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                    }}>{unread}</span>
                  )}
                </button>
                {showNotifs && (
                  <div style={{
                    position: 'absolute', right: 0, top: 40, width: 320, background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: 'var(--shadow-card)',
                    zIndex: 200, maxHeight: 360, overflowY: 'auto'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                      {unread > 0 && <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.75rem' }}>Mark all read</button>}
                    </div>
                    {notifications.length === 0
                      ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No notifications</div>
                      : notifications.map(n => (
                        <Link key={n._id} to={n.link || '#'} onClick={() => setShowNotifs(false)}
                          style={{ display: 'block', padding: '10px 16px', borderBottom: '1px solid var(--border-color)', background: n.read ? 'transparent' : 'rgba(232,197,71,0.05)' }}>
                          <div style={{ fontSize: '0.825rem', color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.message}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
              {/* Avatar dropdown */}
              <div className="dropdown">
                <button className="dropdown-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  data-bs-toggle="dropdown">
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontWeight: 700, fontSize: '0.85rem'
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12 }}>
                  <li><Link className="dropdown-item" to="/dashboard" style={{ color: 'var(--text-primary)', padding: '8px 16px', fontSize: '0.875rem' }}>
                    <FiUser size={14} style={{ marginRight: 8 }} />Profile
                  </Link></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border-color)' }} /></li>
                  <li><button className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--accent-secondary)', padding: '8px 16px', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontSize: '0.875rem' }}>
                    <FiLogOut size={14} style={{ marginRight: 8 }} />Logout
                  </button></li>
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn-outline-gold" style={{ fontSize: '0.875rem' }}>Login</Link>
              <Link to="/register" className="btn-gold" style={{ fontSize: '0.875rem' }}>Join Free</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="d-md-none" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MobileLink to="/" onClick={() => setMenuOpen(false)}>Browse Books</MobileLink>
          <MobileLink to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</MobileLink>
          {user && <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>}
          {user && <MobileLink to="/exchanges" onClick={() => setMenuOpen(false)}>Exchanges</MobileLink>}
          {user && <MobileLink to="/add-book" onClick={() => setMenuOpen(false)}>+ List a Book</MobileLink>}
          {user
            ? <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', textAlign: 'left', cursor: 'pointer', padding: '6px 0' }}>Logout</button>
            : <>
                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Login</MobileLink>
                <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Join Free</MobileLink>
              </>
          }
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, active, children }) => (
  <Link to={to} style={{
    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
    fontSize: '0.9rem', fontWeight: active ? 600 : 400,
    transition: 'color 0.2s', padding: '4px 0',
    borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent'
  }}>{children}</Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} style={{ color: 'var(--text-primary)', fontSize: '1rem', padding: '6px 0' }}>{children}</Link>
);
