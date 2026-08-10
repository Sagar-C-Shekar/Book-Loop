import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiHeart, FiStar, FiMapPin } from 'react-icons/fi';

const conditionClass = {
  'Like New': 'condition-like-new',
  'Very Good': 'condition-very-good',
  'Good': 'condition-good',
  'Fair': 'condition-fair',
  'Poor': 'condition-poor'
};

export default function BookCard({ book }) {
  const img = book.images?.[0];
  const seller = book.seller;

  return (
    <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card-dark" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Book cover */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          {img ? (
            <img src={img} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              <span style={{ fontSize: '3rem' }}>📚</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 8 }}>No cover</span>
            </div>
          )}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className={`badge-condition ${conditionClass[book.condition] || ''}`}>{book.condition}</span>
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className={`status-badge status-${book.status}`}>
              {book.status === 'available' ? '✓' : book.status === 'pending' ? '⏳' : '✗'} {book.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {book.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0' }}>by {book.author}</p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(78,205,196,0.1)', color: 'var(--accent-teal)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 12 }}>
              {book.category}
            </span>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
            <div className="credit-chip">⭐ {book.creditValue || 20} credits</div>
            <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted)', fontSize: '0.75rem', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FiEye size={12} /> {book.views || 0}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FiHeart size={12} /> {book.likes?.length || 0}</span>
            </div>
          </div>

          {seller && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                {seller.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                  {seller.name}
                </span>
                {seller.location && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FiMapPin size={10} /> {seller.location}
                  </span>
                )}
              </div>
              {seller.stats?.rating > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--accent-primary)', fontSize: '0.75rem' }}>
                  <FiStar size={11} /> {seller.stats.rating.toFixed(1)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
