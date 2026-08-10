import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookCard from '../components/books/BookCard';
import { FiBook, FiRepeat, FiStar, FiTrendingUp, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [credits, setCredits] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', location: user?.location || '' });

  useEffect(() => {
    if (user) {
      axios.get(`/api/users/${user._id}/books`).then(r => setMyBooks(r.data)).catch(() => {});
      axios.get('/api/credits/history').then(r => setCredits(r.data)).catch(() => {});
    }
  }, [user]);

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/api/books/${id}`);
      setMyBooks(prev => prev.filter(b => b._id !== id));
      toast.success('Book deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', profileForm);
      refreshUser();
      setEditProfile(false);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  const stats = user?.stats || {};

  const statCards = [
    { label: 'Books Listed', value: stats.booksListed || 0, icon: FiBook, color: 'var(--accent-teal)' },
    { label: 'Books Exchanged', value: stats.booksExchanged || 0, icon: FiRepeat, color: 'var(--accent-primary)' },
    { label: 'Books Acquired', value: stats.booksAcquired || 0, icon: FiTrendingUp, color: 'var(--accent-secondary)' },
    { label: 'Credits', value: user?.credits || 0, icon: FiStar, color: '#7c3aed' }
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:32, flexWrap:'wrap' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--accent-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:700, color:'var(--bg-primary)', flexShrink:0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p style={{ color:'var(--text-secondary)', margin:0 }}>{user?.email}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setEditProfile(!editProfile)} className="btn-outline-gold" style={{ fontSize:'0.875rem', display:'flex', alignItems:'center', gap:6 }}>
            <FiEdit size={14} /> Edit Profile
          </button>
          <Link to="/add-book" className="btn-gold" style={{ display:'flex', alignItems:'center', gap:6 }}>
            <FiPlus /> List Book
          </Link>
        </div>
      </div>

      {/* Edit profile form */}
      {editProfile && (
        <div className="card-dark" style={{ padding:24, marginBottom:24 }}>
          <h4 style={{ fontFamily:'var(--font-display)', marginBottom:20 }}>Edit Profile</h4>
          <form onSubmit={handleProfileSave}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label-dark">Name</label>
                <input className="form-control-dark" value={profileForm.name} onChange={e=>setProfileForm({...profileForm,name:e.target.value})} style={{ width:'100%' }} />
              </div>
              <div className="col-md-4">
                <label className="form-label-dark">Location</label>
                <input className="form-control-dark" value={profileForm.location} onChange={e=>setProfileForm({...profileForm,location:e.target.value})} style={{ width:'100%' }} />
              </div>
              <div className="col-12">
                <label className="form-label-dark">Bio</label>
                <textarea className="form-control-dark" value={profileForm.bio} onChange={e=>setProfileForm({...profileForm,bio:e.target.value})} rows={2} style={{ width:'100%' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button type="submit" className="btn-gold">Save</button>
              <button type="button" onClick={() => setEditProfile(false)} className="btn-outline-gold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="col-6 col-md-3">
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, padding:20, textAlign:'center' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontSize:'1.8rem', fontWeight:700, color, fontFamily:'var(--font-display)' }}>{value}</div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, background:'var(--bg-secondary)', borderRadius:12, padding:4, marginBottom:24, width:'fit-content' }}>
        {['overview', 'my-books', 'credits'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding:'8px 20px', borderRadius:8, border:'none', cursor:'pointer', fontSize:'0.875rem', fontWeight:500, transition:'all 0.2s',
              background: activeTab===tab ? 'var(--bg-card)' : 'transparent',
              color: activeTab===tab ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {tab === 'overview' ? '📊 Overview' : tab === 'my-books' ? '📚 My Books' : '⭐ Credits'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card-dark" style={{ padding:24 }}>
              <h5 style={{ fontFamily:'var(--font-display)', marginBottom:16 }}>Recent Activity</h5>
              {credits.slice(0,6).length === 0
                ? <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>No recent activity</p>
                : credits.slice(0,6).map(c => (
                  <div key={c._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize:'0.875rem' }}>{c.reason}</div>
                      <div style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span style={{ color: c.type==='earn'||c.type==='bonus' ? 'var(--accent-teal)' : 'var(--accent-secondary)', fontWeight:700, fontSize:'0.9rem' }}>
                      {c.type==='earn'||c.type==='bonus' ? '+' : ''}{c.amount} ⭐
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-dark" style={{ padding:24, height:'100%' }}>
              <h5 style={{ fontFamily:'var(--font-display)', marginBottom:16 }}>Quick Stats</h5>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  { label:'Member since', val: new Date(user?.createdAt).toLocaleDateString('en', { month:'long', year:'numeric' }) },
                  { label:'Rating', val: stats.rating > 0 ? `⭐ ${stats.rating.toFixed(1)} (${stats.reviewCount} reviews)` : 'No reviews yet' },
                  { label:'Current balance', val:`⭐ ${user?.credits} credits` },
                  { label:'Exchange success', val: stats.booksExchanged > 0 ? `${stats.booksExchanged} completed` : 'None yet' }
                ].map(({ label, val }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>{label}</span>
                    <span style={{ color:'var(--text-primary)', fontSize:'0.875rem', fontWeight:500 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20 }}>
                <Link to="/exchanges" className="btn-outline-gold" style={{ width:'100%', display:'block', textAlign:'center', padding:'10px' }}>View Exchanges</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-books' && (
        <div>
          {myBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>No books listed yet</h3>
              <p style={{ marginBottom:20 }}>Share your first book with the community!</p>
              <Link to="/add-book" className="btn-gold">List a Book</Link>
            </div>
          ) : (
            <div className="row g-4">
              {myBooks.map(book => (
                <div key={book._id} className="col-6 col-md-4 col-lg-3">
                  <div style={{ position:'relative' }}>
                    <BookCard book={book} />
                    <div style={{ position:'absolute', top:48, right:8, display:'flex', gap:4 }}>
                      <Link to={`/edit-book/${book._id}`} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:6, padding:'4px 8px', color:'var(--text-secondary)', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:3 }}>
                        <FiEdit size={12} />
                      </Link>
                      <button onClick={() => handleDeleteBook(book._id)} style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)', borderRadius:6, padding:'4px 8px', color:'var(--accent-secondary)', cursor:'pointer', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:3 }}>
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'credits' && (
        <div>
          <div style={{ background:'linear-gradient(135deg, rgba(232,197,71,0.15), rgba(232,197,71,0.05))', border:'1px solid rgba(232,197,71,0.3)', borderRadius:16, padding:24, marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem', marginBottom:4 }}>Current Balance</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:700, color:'var(--accent-primary)' }}>⭐ {user?.credits}</div>
            </div>
            <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem', maxWidth:280 }}>
              Earn 30 credits per completed exchange. Use credits to acquire books without offering one in return.
            </div>
          </div>
          {credits.length === 0 ? (
            <p style={{ color:'var(--text-muted)', textAlign:'center', padding:40 }}>No credit transactions yet.</p>
          ) : (
            <div className="card-dark" style={{ overflow:'hidden' }}>
              {credits.map((c, i) => (
                <div key={c._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom: i < credits.length-1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div>
                    <div style={{ fontSize:'0.9rem' }}>{c.reason}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginTop:2 }}>{new Date(c.createdAt).toLocaleDateString('en', { day:'numeric', month:'short', year:'numeric' })}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color: c.type==='earn'||c.type==='bonus' ? 'var(--accent-teal)' : 'var(--accent-secondary)', fontWeight:700 }}>
                      {c.amount > 0 ? '+' : ''}{c.amount} ⭐
                    </div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>Balance: {c.balance} ⭐</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
