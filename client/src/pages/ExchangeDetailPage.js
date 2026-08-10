import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

export default function ExchangeDetailPage() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [sellerResp, setSellerResp] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [showReview, setShowReview] = useState(false);

  const fetchExchange = () => {
    axios.get(`/api/exchanges/${id}`)
      .then(r => setExchange(r.data))
      .catch(() => toast.error('Exchange not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExchange(); }, [id]);

  const respond = async (action) => {
    setResponding(true);
    try {
      await axios.put(`/api/exchanges/${id}/respond`, { action, sellerResponse: sellerResp });
      toast.success(action === 'accept' ? 'Exchange accepted!' : 'Exchange declined');
      fetchExchange();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
    finally { setResponding(false); }
  };

  const complete = async () => {
    try {
      await axios.put(`/api/exchanges/${id}/complete`);
      toast.success('Exchange marked complete! Credits awarded 🎉');
      refreshUser();
      fetchExchange();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const cancel = async () => {
    try {
      await axios.put(`/api/exchanges/${id}/cancel`);
      toast.success('Exchange cancelled');
      fetchExchange();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${id}`, { rating, review });
      toast.success('Review submitted!');
      setShowReview(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed'); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner-gold"/></div>;
  if (!exchange) return <div className="empty-state"><h3>Exchange not found</h3></div>;

  const isSeller = user?._id === exchange.seller?._id;
  const isBuyer = user?._id === exchange.buyer?._id;

  return (
    <div className="page-enter" style={{ maxWidth:800, margin:'0 auto', padding:'40px 24px' }}>
      <Link to="/exchanges" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--text-secondary)', marginBottom:24, fontSize:'0.875rem' }}>
        <FiArrowLeft /> Back to exchanges
      </Link>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', margin:0 }}>Exchange Details</h1>
        <span className={`status-badge status-${exchange.status}`} style={{ fontSize:'0.875rem', padding:'6px 14px' }}>{exchange.status}</span>
      </div>

      {/* Book + parties */}
      <div className="card-dark" style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ width:72, height:96, borderRadius:8, overflow:'hidden', background:'var(--bg-secondary)', flexShrink:0 }}>
            {exchange.book?.images?.[0]
              ? <img src={exchange.book.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'2rem' }}>📚</div>
            }
          </div>
          <div style={{ flex:1 }}>
            <Link to={`/books/${exchange.book?._id}`} style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700, color:'var(--text-primary)', display:'block', marginBottom:4 }}>
              {exchange.book?.title}
            </Link>
            <div style={{ display:'flex', gap:24, color:'var(--text-secondary)', fontSize:'0.875rem', flexWrap:'wrap', marginTop:8 }}>
              <div><span style={{ color:'var(--text-muted)' }}>Seller:</span> <strong>{exchange.seller?.name}</strong></div>
              <div><span style={{ color:'var(--text-muted)' }}>Buyer:</span> <strong>{exchange.buyer?.name}</strong></div>
              <div><span style={{ color:'var(--text-muted)' }}>Type:</span> <strong>{exchange.exchangeType === 'credits' ? `⭐ ${exchange.creditsOffered} credits` : '📚 Book swap'}</strong></div>
              <div><span style={{ color:'var(--text-muted)' }}>Requested:</span> {new Date(exchange.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Offered book */}
      {exchange.exchangeType === 'book' && exchange.offeredBook?.title && (
        <div className="card-dark" style={{ padding:24, marginBottom:16 }}>
          <h5 style={{ fontFamily:'var(--font-display)', marginBottom:14, color:'var(--text-secondary)', textTransform:'uppercase', fontSize:'0.8rem', letterSpacing:'0.5px' }}>Book Offered in Exchange</h5>
          <div><strong>{exchange.offeredBook.title}</strong> by {exchange.offeredBook.author}</div>
          <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem', marginTop:4 }}>Condition: {exchange.offeredBook.condition}</div>
          {exchange.offeredBook.description && <div style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginTop:4 }}>{exchange.offeredBook.description}</div>}
        </div>
      )}

      {/* Messages */}
      {exchange.buyerMessage && (
        <div className="card-dark" style={{ padding:20, marginBottom:12 }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:6 }}>Buyer's message</div>
          <p style={{ margin:0, color:'var(--text-secondary)' }}>{exchange.buyerMessage}</p>
        </div>
      )}
      {exchange.sellerResponse && (
        <div className="card-dark" style={{ padding:20, marginBottom:12 }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:6 }}>Seller's response</div>
          <p style={{ margin:0, color:'var(--text-secondary)' }}>{exchange.sellerResponse}</p>
        </div>
      )}

      {/* Delivery info */}
      {exchange.deliveryInfo?.contact && (
        <div className="card-dark" style={{ padding:20, marginBottom:16 }}>
          <h5 style={{ fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-muted)', marginBottom:10 }}>Delivery / Pickup Info</h5>
          <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem', display:'flex', flexDirection:'column', gap:4 }}>
            <div>Method: {exchange.deliveryInfo.method}</div>
            {exchange.deliveryInfo.contact && <div>Contact: {exchange.deliveryInfo.contact}</div>}
            {exchange.deliveryInfo.address && <div>Address: {exchange.deliveryInfo.address}</div>}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {/* Seller actions */}
        {isSeller && exchange.status === 'pending' && (
          <div className="card-dark" style={{ padding:24 }}>
            <h5 style={{ fontFamily:'var(--font-display)', marginBottom:16 }}>Respond to Request</h5>
            <textarea className="form-control-dark" value={sellerResp} onChange={e=>setSellerResp(e.target.value)}
              rows={2} style={{ width:'100%', marginBottom:14 }} placeholder="Optional message to buyer..." />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => respond('accept')} disabled={responding} className="btn-gold" style={{ flex:1 }}>✓ Accept</button>
              <button onClick={() => respond('reject')} disabled={responding} style={{ flex:1, padding:'10px', background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.4)', color:'var(--accent-secondary)', borderRadius:8, cursor:'pointer', fontWeight:600 }}>✕ Decline</button>
            </div>
          </div>
        )}

        {/* Mark complete (seller after accept) */}
        {isSeller && exchange.status === 'accepted' && (
          <button onClick={complete} className="btn-gold" style={{ padding:13 }}>
            ✓ Mark Exchange Complete
          </button>
        )}

        {/* Cancel (buyer, pending or accepted) */}
        {isBuyer && ['pending','accepted'].includes(exchange.status) && (
          <button onClick={cancel} style={{ padding:12, background:'transparent', border:'1px solid rgba(255,107,107,0.4)', color:'var(--accent-secondary)', borderRadius:8, cursor:'pointer', fontWeight:500 }}>
            Cancel Request
          </button>
        )}

        {/* Review button */}
        {exchange.status === 'completed' && (
          <button onClick={() => setShowReview(!showReview)} className="btn-outline-gold">
            ⭐ Leave a Review
          </button>
        )}

        {showReview && (
          <div className="card-dark" style={{ padding:24 }}>
            <h5 style={{ fontFamily:'var(--font-display)', marginBottom:16 }}>Submit Review</h5>
            <form onSubmit={submitReview}>
              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.5rem', color: s<=rating ? 'var(--accent-primary)' : 'var(--border-color)' }}>★</button>
                ))}
              </div>
              <textarea className="form-control-dark" value={review} onChange={e=>setReview(e.target.value)} rows={3} style={{ width:'100%', marginBottom:12 }} placeholder="Share your experience..." />
              <button type="submit" className="btn-gold">Submit Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
