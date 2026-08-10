import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiHeart, FiEye, FiStar, FiMapPin, FiMessageSquare, FiArrowLeft, FiEdit } from 'react-icons/fi';

const conditionClass = { 'Like New':'condition-like-new','Very Good':'condition-very-good','Good':'condition-good','Fair':'condition-fair','Poor':'condition-poor' };

export default function BookDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeType, setExchangeType] = useState('book');
  const [form, setForm] = useState({ title:'', author:'', condition:'Good', description:'', message:'', deliveryMethod:'pickup', address:'', contact:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`/api/books/${id}`)
      .then(r => {
        setBook(r.data);
        setLikeCount(r.data.likes?.length || 0);
        setLiked(user && r.data.likes?.includes(user._id));
      })
      .catch(() => toast.error('Book not found'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    const { data } = await axios.post(`/api/books/${id}/like`);
    setLiked(data.liked);
    setLikeCount(data.likeCount);
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('bookId', id);
      fd.append('exchangeType', exchangeType);
      fd.append('buyerMessage', form.message);
      fd.append('deliveryMethod', form.deliveryMethod);
      fd.append('deliveryAddress', form.address);
      fd.append('deliveryContact', form.contact);
      if (exchangeType === 'book') {
        fd.append('offeredBookTitle', form.title);
        fd.append('offeredBookAuthor', form.author);
        fd.append('offeredBookCondition', form.condition);
        fd.append('offeredBookDescription', form.description);
      } else {
        fd.append('creditsOffered', book.creditValue);
      }
      await axios.post('/api/exchanges', fd);
      toast.success('Exchange request sent!');
      setShowExchange(false);
      setBook(prev => ({ ...prev, status: 'pending' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner-gold" /></div>;
  if (!book) return <div className="empty-state"><h3>Book not found</h3></div>;

  const isSeller = user && book.seller?._id === user._id;

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--text-secondary)', marginBottom:24, fontSize:'0.875rem' }}>
        <FiArrowLeft /> Back to browse
      </Link>

      <div className="row g-5">
        {/* Images column */}
        <div className="col-md-5">
          <div style={{ borderRadius: 16, overflow:'hidden', background:'var(--bg-card)', border:'1px solid var(--border-color)', aspectRatio:'3/4', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {book.images?.length > 0
              ? <img src={book.images[activeImg]} alt={book.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ fontSize:'5rem', opacity:0.3 }}>📚</div>
            }
          </div>
          {book.images?.length > 1 && (
            <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
              {book.images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width:64, height:64, borderRadius:8, overflow:'hidden', cursor:'pointer', border:`2px solid ${activeImg===i ? 'var(--accent-primary)' : 'var(--border-color)'}` }}>
                  <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="col-md-7">
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, flexWrap:'wrap' }}>
            <span className={`badge-condition ${conditionClass[book.condition]}`}>{book.condition}</span>
            <span style={{ background:'rgba(78,205,196,0.1)', color:'var(--accent-teal)', fontSize:'0.75rem', padding:'3px 10px', borderRadius:12 }}>{book.category}</span>
            <span className={`status-badge status-${book.status}`}>{book.status}</span>
          </div>

          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem,4vw,2rem)', fontWeight:800, lineHeight:1.2, marginBottom:6 }}>{book.title}</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'1.1rem', marginBottom:16 }}>by <strong style={{ color:'var(--text-primary)' }}>{book.author}</strong></p>

          {book.publishedYear && <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginBottom:4 }}>Published: {book.publishedYear}</p>}
          {book.pages && <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginBottom:16 }}>{book.pages} pages · {book.language}</p>}

          <p style={{ color:'var(--text-secondary)', lineHeight:1.8, marginBottom:24 }}>{book.description}</p>

          {/* Exchange info */}
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12, padding:16, marginBottom:20 }}>
            <h5 style={{ fontSize:'0.875rem', fontWeight:600, marginBottom:10, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Exchange Terms</h5>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              {(book.exchangeType === 'credits' || book.exchangeType === 'both') && (
                <div className="credit-chip" style={{ fontSize:'0.9rem', padding:'6px 14px' }}>⭐ {book.creditValue} credits</div>
              )}
              {(book.exchangeType === 'book' || book.exchangeType === 'both') && (
                <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>📚 Book exchange accepted</span>
              )}
            </div>
            {book.wantedBooks && <p style={{ color:'var(--text-secondary)', fontSize:'0.825rem', marginTop:8, marginBottom:0 }}>Wants: {book.wantedBooks}</p>}
          </div>

          {/* Stats row */}
          <div style={{ display:'flex', gap:20, marginBottom:24 }}>
            <button onClick={handleLike} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color: liked ? 'var(--accent-secondary)' : 'var(--text-muted)', cursor:'pointer', fontSize:'0.875rem', padding:0 }}>
              <FiHeart fill={liked ? 'currentColor' : 'none'} /> {likeCount}
            </button>
            <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)', fontSize:'0.875rem' }}><FiEye /> {book.views}</span>
            {book.seller?.stats?.rating > 0 && <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--accent-primary)', fontSize:'0.875rem' }}><FiStar /> {book.seller.stats.rating.toFixed(1)}</span>}
          </div>

          {/* Seller card */}
          {book.seller && (
            <Link to={`/profile/${book.seller._id}`} style={{ display:'block', textDecoration:'none' }}>
              <div style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:12, padding:14, marginBottom:24, display:'flex', alignItems:'center', gap:12, transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border-color)'}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--accent-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--bg-primary)', fontSize:'1.1rem', flexShrink:0 }}>
                  {book.seller.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:600 }}>{book.seller.name}</div>
                  {book.seller.location && <div style={{ color:'var(--text-muted)', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:4 }}><FiMapPin size={11} />{book.seller.location}</div>}
                </div>
              </div>
            </Link>
          )}

          {/* Action buttons */}
          {isSeller ? (
            <div style={{ display:'flex', gap:10 }}>
              <Link to={`/edit-book/${book._id}`} className="btn-gold" style={{ display:'flex', alignItems:'center', gap:8 }}><FiEdit /> Edit Listing</Link>
            </div>
          ) : book.status === 'available' ? (
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => setShowExchange(!showExchange)} className="btn-gold" style={{ fontSize:'1rem', padding:'12px 28px' }}>
                📖 Request Exchange
              </button>
              {book.seller && (
                <button onClick={async () => {
                  if (!user) { navigate('/login'); return; }
                  try {
                    const { data } = await axios.post('/api/chat/start', { recipientId: book.seller._id, bookId: book._id });
                    navigate('/chat', { state: { conversationId: data._id } });
                  } catch { toast.error('Failed to start chat'); }
                }} className="btn-outline-gold" style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <FiMessageSquare /> Message Seller
                </button>
              )}
            </div>
          ) : (
            <div style={{ padding:'12px 20px', background:'rgba(108,117,125,0.1)', border:'1px solid rgba(108,117,125,0.2)', borderRadius:10, color:'var(--text-muted)', textAlign:'center' }}>
              This book is {book.status}
            </div>
          )}

          {/* Exchange form */}
          {showExchange && (
            <div style={{ marginTop:24, background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, padding:24 }}>
              <h4 style={{ fontFamily:'var(--font-display)', marginBottom:20 }}>Request Exchange</h4>
              <form onSubmit={handleExchangeSubmit}>
                {/* Exchange type */}
                <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                  {(book.exchangeType === 'book' || book.exchangeType === 'both') && (
                    <button type="button" onClick={() => setExchangeType('book')}
                      style={{ flex:1, padding:'10px', borderRadius:8, border:`2px solid ${exchangeType==='book' ? 'var(--accent-primary)' : 'var(--border-color)'}`, background: exchangeType==='book' ? 'rgba(232,197,71,0.1)' : 'transparent', color: exchangeType==='book' ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight:600 }}>
                      📚 Offer a Book
                    </button>
                  )}
                  {(book.exchangeType === 'credits' || book.exchangeType === 'both') && (
                    <button type="button" onClick={() => setExchangeType('credits')}
                      style={{ flex:1, padding:'10px', borderRadius:8, border:`2px solid ${exchangeType==='credits' ? 'var(--accent-primary)' : 'var(--border-color)'}`, background: exchangeType==='credits' ? 'rgba(232,197,71,0.1)' : 'transparent', color: exchangeType==='credits' ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight:600 }}>
                      ⭐ Use Credits ({book.creditValue})
                    </button>
                  )}
                </div>

                {exchangeType === 'book' && (
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label-dark">Book Title *</label>
                      <input className="form-control-dark" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required style={{ width:'100%' }} placeholder="Title" />
                    </div>
                    <div className="col-6">
                      <label className="form-label-dark">Author *</label>
                      <input className="form-control-dark" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} required style={{ width:'100%' }} placeholder="Author" />
                    </div>
                    <div className="col-6">
                      <label className="form-label-dark">Condition *</label>
                      <select className="form-control-dark" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} style={{ width:'100%' }}>
                        {['Like New','Very Good','Good','Fair','Poor'].map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label-dark">Description</label>
                      <textarea className="form-control-dark" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} style={{ width:'100%' }} placeholder="Brief description of your book" />
                    </div>
                  </div>
                )}

                {exchangeType === 'credits' && user && (
                  <div style={{ background:'rgba(232,197,71,0.05)', border:'1px solid rgba(232,197,71,0.2)', borderRadius:10, padding:14, marginBottom:16, fontSize:'0.875rem' }}>
                    Your balance: <strong style={{ color:'var(--accent-primary)' }}>⭐ {user.credits}</strong> · Cost: <strong style={{ color:'var(--accent-primary)' }}>⭐ {book.creditValue}</strong>
                    {user.credits < book.creditValue && <div style={{ color:'var(--accent-secondary)', marginTop:4 }}>⚠ Insufficient credits</div>}
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-12">
                    <label className="form-label-dark">Message to Seller</label>
                    <textarea className="form-control-dark" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={2} style={{ width:'100%' }} placeholder="Introduce yourself or ask a question..." />
                  </div>
                  <div className="col-6">
                    <label className="form-label-dark">Delivery Method</label>
                    <select className="form-control-dark" value={form.deliveryMethod} onChange={e=>setForm({...form,deliveryMethod:e.target.value})} style={{ width:'100%' }}>
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                      <option value="mail">Mail</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label-dark">Contact</label>
                    <input className="form-control-dark" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} style={{ width:'100%' }} placeholder="Phone/WhatsApp" />
                  </div>
                  <div className="col-12">
                    <label className="form-label-dark">Address / Notes</label>
                    <input className="form-control-dark" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} style={{ width:'100%' }} placeholder="Pickup/delivery address" />
                  </div>
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button type="submit" className="btn-gold" disabled={submitting || (exchangeType==='credits' && user && user.credits < book.creditValue)} style={{ flex:1, padding:12 }}>
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                  <button type="button" onClick={() => setShowExchange(false)} className="btn-outline-gold">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
