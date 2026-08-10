import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Biography','Technology','Philosophy','Romance','Mystery','Fantasy','Self-Help','Business','Children','Young Adult','Poetry','Comics','Other'];
const CONDITIONS = ['Like New','Very Good','Good','Fair','Poor'];

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`/api/books/${id}`).then(r => {
      const b = r.data;
      setForm({
        title: b.title, author: b.author, description: b.description,
        category: b.category, condition: b.condition, isbn: b.isbn || '',
        language: b.language || 'English', publishedYear: b.publishedYear || '',
        pages: b.pages || '', exchangeType: b.exchangeType, creditValue: b.creditValue,
        wantedBooks: b.wantedBooks || '', wantedGenres: b.wantedGenres || [],
        existingImages: b.images || []
      });
    }).catch(() => toast.error('Book not found'))
    .finally(() => setLoading(false));
  }, [id]);

  const handleImgAdd = (e) => {
    const files = Array.from(e.target.files);
    const total = (form.existingImages?.length || 0) + newImages.length;
    const allowed = files.slice(0, Math.max(0, 5 - total));
    setNewImages(prev => [...prev, ...allowed]);
    allowed.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setNewPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeExisting = (i) => setForm(prev => ({ ...prev, existingImages: prev.existingImages.filter((_,idx)=>idx!==i) }));
  const removeNew = (i) => { setNewImages(p=>p.filter((_,idx)=>idx!==i)); setNewPreviews(p=>p.filter((_,idx)=>idx!==i)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => {
        if (k==='wantedGenres') fd.append(k, JSON.stringify(v));
        else if (k==='existingImages') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      newImages.forEach(img => fd.append('images', img));
      await axios.put(`/api/books/${id}`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      toast.success('Book updated!');
      navigate(`/books/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  if (loading || !form) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner-gold"/></div>;

  return (
    <div className="page-enter" style={{ maxWidth:700, margin:'0 auto', padding:'40px 24px' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', marginBottom:8 }}>Edit Listing</h1>
      <p style={{ color:'var(--text-secondary)', marginBottom:32 }}>Update your book details below.</p>

      <div className="card-dark" style={{ padding:32 }}>
        <form onSubmit={handleSubmit}>
          {/* Existing images */}
          <div style={{ marginBottom:24 }}>
            <label className="form-label-dark">Images</label>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {(form.existingImages||[]).map((src,i) => (
                <div key={i} style={{ position:'relative', width:80, height:80, borderRadius:8, overflow:'hidden', border:'1px solid var(--border-color)' }}>
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <button type="button" onClick={() => removeExisting(i)} style={{ position:'absolute', top:2, right:2, background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', borderRadius:'50%', width:20, height:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {newPreviews.map((src,i) => (
                <div key={`new-${i}`} style={{ position:'relative', width:80, height:80, borderRadius:8, overflow:'hidden', border:'2px solid var(--accent-teal)' }}>
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <button type="button" onClick={() => removeNew(i)} style={{ position:'absolute', top:2, right:2, background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', borderRadius:'50%', width:20, height:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {((form.existingImages?.length||0) + newImages.length) < 5 && (
                <label style={{ width:80, height:80, borderRadius:8, border:'2px dashed var(--border-color)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.7rem', gap:4 }}>
                  <FiUpload size={20} /><span>Add</span>
                  <input type="file" accept="image/*" multiple hidden onChange={handleImgAdd} />
                </label>
              )}
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12"><label className="form-label-dark">Title *</label><input className="form-control-dark" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required style={{ width:'100%' }} /></div>
            <div className="col-12"><label className="form-label-dark">Author *</label><input className="form-control-dark" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} required style={{ width:'100%' }} /></div>
            <div className="col-12"><label className="form-label-dark">Description *</label><textarea className="form-control-dark" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required rows={4} style={{ width:'100%' }} /></div>
            <div className="col-6"><label className="form-label-dark">Genre</label><select className="form-control-dark" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ width:'100%' }}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="col-6"><label className="form-label-dark">Condition</label><select className="form-control-dark" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} style={{ width:'100%' }}>{CONDITIONS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="col-6"><label className="form-label-dark">Exchange Type</label><select className="form-control-dark" value={form.exchangeType} onChange={e=>setForm({...form,exchangeType:e.target.value})} style={{ width:'100%' }}><option value="both">Books or Credits</option><option value="book">Books Only</option><option value="credits">Credits Only</option></select></div>
            <div className="col-6"><label className="form-label-dark">Credit Value</label><input type="number" className="form-control-dark" value={form.creditValue} onChange={e=>setForm({...form,creditValue:e.target.value})} style={{ width:'100%' }} min="5" max="200" /></div>
            <div className="col-12"><label className="form-label-dark">Wanted in Return</label><input className="form-control-dark" value={form.wantedBooks} onChange={e=>setForm({...form,wantedBooks:e.target.value})} style={{ width:'100%' }} /></div>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button type="submit" className="btn-gold" disabled={saving} style={{ flex:1, padding:13 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" onClick={() => navigate(`/books/${id}`)} className="btn-outline-gold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
