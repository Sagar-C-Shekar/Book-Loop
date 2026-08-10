import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight } from 'react-icons/fi';

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ role });
    if (statusFilter) params.append('status', statusFilter);
    axios.get(`/api/exchanges?${params}`)
      .then(r => setExchanges(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role, statusFilter]);

  const statusColors = { pending:'var(--accent-primary)', accepted:'#28a745', rejected:'var(--accent-secondary)', completed:'var(--accent-teal)', cancelled:'var(--text-muted)' };

  return (
    <div className="page-enter" style={{ maxWidth:900, margin:'0 auto', padding:'40px 24px' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', marginBottom:24 }}>My Exchanges</h1>

      <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        {[['all','All'],['buyer','As Buyer'],['seller','As Seller']].map(([val,label]) => (
          <button key={val} onClick={() => setRole(val)}
            style={{ padding:'8px 18px', borderRadius:8, border:'none', cursor:'pointer', fontSize:'0.875rem', fontWeight:500,
              background: role===val ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: role===val ? 'var(--bg-primary)' : 'var(--text-secondary)' }}>
            {label}
          </button>
        ))}
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="form-control-dark" style={{ width:'auto', padding:'8px 12px', fontSize:'0.875rem', marginLeft:'auto' }}>
          <option value="">All statuses</option>
          {['pending','accepted','rejected','completed','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner-gold"/></div>
      ) : exchanges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>No exchanges yet</h3>
          <p style={{ marginBottom:20 }}>Browse books and make your first exchange request!</p>
          <Link to="/" className="btn-gold">Browse Books</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {exchanges.map(ex => (
            <Link key={ex._id} to={`/exchanges/${ex._id}`} style={{ textDecoration:'none' }}>
              <div className="card-dark" style={{ padding:20, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                {/* Book img */}
                <div style={{ width:56, height:72, borderRadius:8, overflow:'hidden', background:'var(--bg-secondary)', flexShrink:0 }}>
                  {ex.book?.images?.[0]
                    ? <img src={ex.book.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>📚</div>
                  }
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <h5 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {ex.book?.title || 'Book'}
                  </h5>
                  <div style={{ display:'flex', gap:16, color:'var(--text-secondary)', fontSize:'0.8rem', flexWrap:'wrap' }}>
                    <span>Buyer: <strong style={{ color:'var(--text-primary)' }}>{ex.buyer?.name}</strong></span>
                    <span>Seller: <strong style={{ color:'var(--text-primary)' }}>{ex.seller?.name}</strong></span>
                    <span>{new Date(ex.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ marginTop:6, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <span className={`status-badge status-${ex.status}`}>{ex.status}</span>
                    <span style={{ fontSize:'0.775rem', color:'var(--text-muted)' }}>
                      {ex.exchangeType === 'credits' ? `⭐ ${ex.creditsOffered} credits` : '📚 Book exchange'}
                    </span>
                  </div>
                </div>

                <FiArrowRight color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
