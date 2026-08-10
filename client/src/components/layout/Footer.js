import React from 'react';
import { Link } from 'react-router-dom';
import { GiBookshelf } from 'react-icons/gi';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '40px 24px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="row g-4">
          <div className="col-md-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <GiBookshelf size={24} color="var(--accent-primary)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
                Book<span style={{ color: 'var(--accent-primary)' }}>Loop</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              A community-driven book exchange platform promoting sustainability and the joy of reading.
            </p>
          </div>
          <div className="col-md-2">
            <h6 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 12 }}>Explore</h6>
            {[['/', 'Browse Books'], ['/leaderboard', 'Leaderboard'], ['/add-book', 'List a Book']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{label}</Link>
              </div>
            ))}
          </div>
          <div className="col-md-2">
            <h6 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 12 }}>Account</h6>
            {[['/login', 'Login'], ['/register', 'Register'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{label}</Link>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h6 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 12 }}>Community</h6>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 12 }}>Join thousands of book lovers exchanging stories worldwide.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[FiGithub, FiTwitter, FiInstagram].map((Icon, i) => (
                <button key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'var(--border-color)', margin: '24px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>© 2025 BookLoop. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Built with ❤️ for book lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
