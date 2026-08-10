import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/books/BookCard';
import { FiMapPin, FiCalendar, FiStar, FiBook, FiRepeat, FiAward } from 'react-icons/fi';

export default function ProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner-gold"/></div>;
  if (!data) return <div className="empty-state"><h3>User not found</h3></div>;

  const { user, books } = data;
  const stats = user.stats || {};

  return (
    <div className="page-enter" style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px' }}>
      {/* Profile header */}
      <div className="card-dark" style={{ padding:32, marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:24, flexWrap:'wrap' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent-primary), #d4b23a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:700, color:'var(--bg-primary)', flexShrink:0 }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:6 }}>{user.name}</h1>
            <div style={{ display:'flex', gap:20, color:'var(--text-secondary)', fontSize:'0.875rem', flexWrap:'wrap', marginBottom:12 }}>
              {user.location && <span style={{ display:'flex', alignItems:'center', gap:4 }}><FiMapPin size={13}/>{user.location}</span>}
              <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                <FiCalendar size={13}/>Member since {new Date(user.createdAt).toLocaleDateString('en', { month:'long', year:'numeric' })}
              </span>
              {stats.rating > 0 && (
                <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--accent-primary)' }}>
                  <FiStar size={13}/>⭐ {stats.rating.toFixed(1)} ({stats.reviewCount} reviews)
                </span>
              )}
            </div>
            {user.bio && <p style={{ color:'var(--text-secondary)', margin:0, fontSize:'0.95rem' }}>{user.bio}</p>}
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display:'flex', gap:12, marginTop:24, flexWrap:'wrap' }}>
          {[
            { icon: FiBook, label:`${stats.booksListed||0} Listed`, color:'var(--accent-teal)' },
            { icon: FiRepeat, label:`${stats.booksExchanged||0} Exchanged`, color:'var(--accent-primary)' },
            { icon: FiAward, label:`${stats.booksAcquired||0} Acquired`, color:'var(--accent-secondary)' }
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:10, padding:'8px 16px', fontSize:'0.875rem' }}>
              <Icon size={15} color={color}/><span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Books */}
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:16 }}>
        {user.name?.split(' ')[0]}'s Books
      </h2>
      {books.length === 0 ? (
        <div className="empty-state" style={{ padding:40 }}>
          <div className="empty-icon" style={{ fontSize:'2.5rem' }}>📚</div>
          <p>No books listed yet</p>
        </div>
      ) : (
        <div className="row g-3">
          {books.map(book => (
            <div key={book._id} className="col-6 col-md-4 col-lg-3">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
