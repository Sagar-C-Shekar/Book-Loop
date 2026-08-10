import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-enter" style={{ minHeight:'70vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px' }}>
      <div style={{ fontSize:'6rem', marginBottom:16 }}>📚</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:900, marginBottom:8 }}>
        Page <span style={{ color:'var(--accent-primary)' }}>Not Found</span>
      </h1>
      <p style={{ color:'var(--text-secondary)', fontSize:'1.1rem', marginBottom:32 }}>
        This chapter doesn't exist in our library.
      </p>
      <Link to="/" className="btn-gold" style={{ padding:'12px 32px', fontSize:'1rem' }}>
        Back to Home
      </Link>
    </div>
  );
}
