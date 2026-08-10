import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiAward, FiTrendingUp, FiBook, FiRepeat } from 'react-icons/fi';

const MEDAL = ['🥇','🥈','🥉'];

export default function LeaderboardPage() {
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [stats, setStats] = useState({});
  const [tab, setTab] = useState('sellers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/leaderboard/sellers'),
      axios.get('/api/leaderboard/buyers'),
      axios.get('/api/leaderboard/stats')
    ]).then(([s, b, st]) => {
      setSellers(s.data);
      setBuyers(b.data);
      setStats(st.data);
    }).finally(() => setLoading(false));
  }, []);

  const list = tab === 'sellers' ? sellers : buyers;

  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f0e17, #1a1a2e)', padding: '60px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position:'absolute', top:'-40%', left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse, rgba(232,197,71,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>🏆</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, marginBottom:10 }}>
            Community <span style={{ color:'var(--accent-primary)' }}>Leaderboard</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'1.05rem', maxWidth:480, margin:'0 auto 32px' }}>
            Celebrating our most active book exchange champions
          </p>
          {/* Community stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
            {[
              { icon:'👥', val: stats.totalUsers, label:'Members' },
              { icon:'📚', val: stats.totalBooks, label:'Books Listed' },
              { icon:'🔄', val: stats.totalExchanges, label:'Exchanges' }
            ].map(({ icon, val, label }) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:2 }}>{icon}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:700, color:'var(--accent-primary)' }}>{val?.toLocaleString() || 0}</div>
                <div style={{ color:'var(--text-secondary)', fontSize:'0.8rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 24px' }}>
        {/* Tab switcher */}
        <div style={{ display:'flex', background:'var(--bg-secondary)', borderRadius:12, padding:4, marginBottom:32, gap:0 }}>
          <button onClick={() => setTab('sellers')}
            style={{ flex:1, padding:'12px', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:'0.95rem', transition:'all 0.2s',
              background: tab==='sellers' ? 'var(--bg-card)' : 'transparent',
              color: tab==='sellers' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            🏆 Top Sellers
          </button>
          <button onClick={() => setTab('buyers')}
            style={{ flex:1, padding:'12px', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:'0.95rem', transition:'all 0.2s',
              background: tab==='buyers' ? 'var(--bg-card)' : 'transparent',
              color: tab==='buyers' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            📖 Top Buyers
          </button>
        </div>

        {/* Column headers */}
        <div style={{ display:'grid', gridTemplateColumns:'48px 1fr 100px 100px', gap:12, padding:'0 16px 8px', color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          <span>#</span>
          <span>Member</span>
          <span style={{ textAlign:'right' }}>{tab==='sellers' ? 'Listed' : 'Acquired'}</span>
          <span style={{ textAlign:'right' }}>Rating</span>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner-gold"/></div>
        ) : list.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🏆</div><h3>No data yet</h3></div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {list.map((u, i) => {
              const isTop3 = i < 3;
              const mainStat = tab === 'sellers'
                ? (u.stats?.booksExchanged || 0)
                : (u.stats?.booksAcquired || 0);
              return (
                <Link key={u._id} to={`/profile/${u._id}`} style={{ textDecoration:'none' }}>
                  <div style={{
                    display:'grid', gridTemplateColumns:'48px 1fr 100px 100px', gap:12, alignItems:'center',
                    background: isTop3 ? `linear-gradient(135deg, ${i===0?'rgba(232,197,71,0.12)':i===1?'rgba(192,192,192,0.08)':'rgba(205,127,50,0.08)'}, var(--bg-card))` : 'var(--bg-card)',
                    border: `1px solid ${isTop3 ? (i===0?'rgba(232,197,71,0.3)':i===1?'rgba(192,192,192,0.2)':'rgba(205,127,50,0.2)') : 'var(--border-color)'}`,
                    borderRadius: 14, padding:'14px 16px', transition:'all 0.25s'
                  }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateX(4px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateX(0)'}>
                    {/* Rank */}
                    <div style={{ textAlign:'center', fontSize: isTop3 ? '1.4rem' : '0.95rem', fontWeight:700, color: isTop3 ? 'transparent' : 'var(--text-muted)', textShadow: isTop3 ? 'none' : 'none' }}>
                      {isTop3 ? MEDAL[i] : <span style={{ color:'var(--text-muted)' }}>{i+1}</span>}
                    </div>
                    {/* User info */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, overflow:'hidden' }}>
                      <div style={{
                        width:40, height:40, borderRadius:'50%', flexShrink:0,
                        background: i===0?'linear-gradient(135deg,#f6d365,#fda085)':i===1?'linear-gradient(135deg,#c0c0c0,#808080)':i===2?'linear-gradient(135deg,#cd7f32,#8b4513)':'var(--bg-secondary)',
                        display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1rem', color:'#fff',
                        boxShadow: isTop3 ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow:'hidden' }}>
                        <div style={{ fontWeight:600, fontSize:'0.95rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</div>
                        {u.location && <div style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>📍 {u.location}</div>}
                        {/* Mini badges */}
                        <div style={{ display:'flex', gap:6, marginTop:2, flexWrap:'wrap' }}>
                          {u.stats?.booksListed > 0 && (
                            <span style={{ fontSize:'0.65rem', background:'rgba(78,205,196,0.1)', color:'var(--accent-teal)', padding:'1px 6px', borderRadius:8 }}>
                              <FiBook size={8} style={{ marginRight:2 }} />{u.stats.booksListed} listed
                            </span>
                          )}
                          {u.stats?.booksExchanged > 0 && (
                            <span style={{ fontSize:'0.65rem', background:'rgba(232,197,71,0.1)', color:'var(--accent-primary)', padding:'1px 6px', borderRadius:8 }}>
                              <FiRepeat size={8} style={{ marginRight:2 }} />{u.stats.booksExchanged} swapped
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Main stat */}
                    <div style={{ textAlign:'right', fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color: isTop3 ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {mainStat}
                    </div>
                    {/* Rating */}
                    <div style={{ textAlign:'right' }}>
                      {u.stats?.rating > 0
                        ? <span style={{ color:'var(--accent-primary)', fontWeight:600, fontSize:'0.9rem' }}>⭐ {u.stats.rating.toFixed(1)}</span>
                        : <span style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>—</span>
                      }
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
