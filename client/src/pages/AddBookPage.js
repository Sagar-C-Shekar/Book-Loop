import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Biography','Technology','Philosophy','Romance','Mystery','Fantasy','Self-Help','Business','Children','Young Adult','Poetry','Comics','Other'];
const CONDITIONS = ['Like New','Very Good','Good','Fair','Poor'];

export default function AddBookPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', author:'', description:'', category:'Fiction', condition:'Good', isbn:'', language:'English', publishedYear:'', pages:'', exchangeType:'both', creditValue:'20', wantedBooks:'', wantedGenres:[] });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImg = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 5));
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result].slice(0, 5));
      reader.readAsDataURL(f);
    });
  };

  const removeImg = (i) => {
    setImages(prev => prev.filter((_,idx) => idx !== i));
    setPreviews(prev => prev.filter((_,idx) => idx !== i));
  };

  const toggleGenre = (g) => {
    setForm(prev => ({
      ...prev,
      wantedGenres: prev.wantedGenres.includes(g) ? prev.wantedGenres.filter(x=>x!==g) : [...prev.wantedGenres, g]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => {
        if (k === 'wantedGenres') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      images.forEach(img => fd.append('images', img));
      const { data } = await axios.post('/api/books', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Book listed successfully!');
      navigate(`/books/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list book');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', marginBottom:8 }}>List a Book</h1>
      <p style={{ color:'var(--text-secondary)', marginBottom:32 }}>Share a book with the community and earn credits.</p>

      <div className="card-dark" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit}>
          {/* Images */}
          <div style={{ marginBottom:24 }}>
            <label className="form-label-dark">Book Images (up to 5)</label>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position:'relative', width:80, height:80, borderRadius:8, overflow:'hidden', border:'1px solid var(--border-color)' }}>
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <button type="button" onClick={() => removeImg(i)} style={{ position:'absolute', top:2, right:2, background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', borderRadius:'50%', width:20, height:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label style={{ width:80, height:80, borderRadius:8, border:'2px dashed var(--border-color)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.7rem', gap:4, transition:'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border-color)'}>
                  <FiUpload size={20} />
                  <span>Add</span>
                  <input type="file" accept="image/*" multiple hidden onChange={handleImg} />
                </label>
              )}
            </div>
          </div>

          {/* Basic info */}
          <div className="row g-3 mb-3">
            <div className="col-12">
              <label className="form-label-dark">Title *</label>
              <input className="form-control-dark" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required style={{ width:'100%' }} placeholder="Book title" />
            </div>
            <div className="col-12">
              <label className="form-label-dark">Author *</label>
              <input className="form-control-dark" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} required style={{ width:'100%' }} placeholder="Author name" />
            </div>
            <div className="col-12">
              <label className="form-label-dark">Description *</label>
              <textarea className="form-control-dark" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required rows={4} style={{ width:'100%' }} placeholder="Tell readers what this book is about..." />
            </div>
            <div className="col-6">
              <label className="form-label-dark">Genre *</label>
              <select className="form-control-dark" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ width:'100%' }}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label-dark">Condition *</label>
              <select className="form-control-dark" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} style={{ width:'100%' }}>
                {CONDITIONS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-4">
              <label className="form-label-dark">Language</label>
              <input className="form-control-dark" value={form.language} onChange={e=>setForm({...form,language:e.target.value})} style={{ width:'100%' }} />
            </div>
            <div className="col-4">
              <label className="form-label-dark">Year Published</label>
              <input type="number" className="form-control-dark" value={form.publishedYear} onChange={e=>setForm({...form,publishedYear:e.target.value})} style={{ width:'100%' }} placeholder="e.g. 2020" min="1000" max={new Date().getFullYear()} />
            </div>
            <div className="col-4">
              <label className="form-label-dark">Pages</label>
              <input type="number" className="form-control-dark" value={form.pages} onChange={e=>setForm({...form,pages:e.target.value})} style={{ width:'100%' }} placeholder="e.g. 320" min="1" />
            </div>
          </div>

          <hr style={{ borderColor:'var(--border-color)', margin:'20px 0' }} />

          {/* Exchange settings */}
          <h5 style={{ fontSize:'0.875rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-secondary)', marginBottom:16 }}>Exchange Settings</h5>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label-dark">Accept</label>
              <select className="form-control-dark" value={form.exchangeType} onChange={e=>setForm({...form,exchangeType:e.target.value})} style={{ width:'100%' }}>
                <option value="both">Books or Credits</option>
                <option value="book">Books Only</option>
                <option value="credits">Credits Only</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label-dark">Credit Value</label>
              <input type="number" className="form-control-dark" value={form.creditValue} onChange={e=>setForm({...form,creditValue:e.target.value})} style={{ width:'100%' }} min="5" max="200" />
            </div>
            <div className="col-12">
              <label className="form-label-dark">What books do you want in return?</label>
              <input className="form-control-dark" value={form.wantedBooks} onChange={e=>setForm({...form,wantedBooks:e.target.value})} style={{ width:'100%' }} placeholder="e.g. Any sci-fi, or specific titles..." />
            </div>
            <div className="col-12">
              <label className="form-label-dark">Preferred genres to receive</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
                {CATEGORIES.map(g => (
                  <button key={g} type="button" onClick={() => toggleGenre(g)}
                    style={{ padding:'4px 12px', borderRadius:20, fontSize:'0.775rem', border:`1.5px solid ${form.wantedGenres.includes(g) ? 'var(--accent-primary)' : 'var(--border-color)'}`, background: form.wantedGenres.includes(g) ? 'rgba(232,197,71,0.1)' : 'transparent', color: form.wantedGenres.includes(g) ? 'var(--accent-primary)' : 'var(--text-muted)', cursor:'pointer', transition:'all 0.15s' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-gold" disabled={loading} style={{ width:'100%', padding:13, fontSize:'1rem', marginTop:8 }}>
            {loading ? 'Publishing...' : '📚 Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
