import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import { CATEGORIES, CONDITIONS } from '../utils/helpers';

const ListBookPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', author: '', description: '', category: 'Fiction', condition: 'Good',
    isbn: '', language: 'English', publishedYear: '', pages: '',
    exchangeType: 'both', creditValue: 20, wantedBooks: '', wantedGenres: [],
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      API.get(`/books/${id}`).then(r => {
        const b = r.data;
        setForm({ title: b.title, author: b.author, description: b.description, category: b.category,
          condition: b.condition, isbn: b.isbn || '', language: b.language || 'English',
          publishedYear: b.publishedYear || '', pages: b.pages || '',
          exchangeType: b.exchangeType, creditValue: b.creditValue, wantedBooks: b.wantedBooks || '',
          wantedGenres: b.wantedGenres || [], tags: (b.tags || []).join(', ') });
        setExistingImages(b.images || []);
      });
    }
  }, [id, isEdit]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'wantedGenres') fd.append(k, JSON.stringify(v));
        else if (k === 'tags') fd.append(k, JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (isEdit) fd.append('existingImages', JSON.stringify(existingImages));
      images.forEach(img => fd.append('images', img));
      if (isEdit) {
        await API.put(`/books/${id}`, fd);
      } else {
        await API.post('/books', fd);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    } finally { setLoading(false); }
  };

  const toggleGenre = (g) => setForm(p => ({
    ...p, wantedGenres: p.wantedGenres.includes(g) ? p.wantedGenres.filter(x => x !== g) : [...p.wantedGenres, g]
  }));

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{isEdit ? 'Edit Book Listing' : 'List Your Book'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Share a book with the community and earn credits</p>
        </div>

        {error && <div className="alert-custom alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <div className="card-custom" style={{ padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Book Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label-custom">Title *</label>
                <input className="form-control-custom" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Book title" required />
              </div>
              <div>
                <label className="form-label-custom">Author *</label>
                <input className="form-control-custom" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Author name" required />
              </div>
              <div>
                <label className="form-label-custom">ISBN</label>
                <input className="form-control-custom" value={form.isbn} onChange={e => setForm(p => ({ ...p, isbn: e.target.value }))} placeholder="Optional" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label-custom">Description *</label>
                <textarea className="form-control-custom" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell readers about this book..." required style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="form-label-custom">Category *</label>
                <select className="form-control-custom" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label-custom">Condition *</label>
                <select className="form-control-custom" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label-custom">Language</label>
                <input className="form-control-custom" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} />
              </div>
              <div>
                <label className="form-label-custom">Published Year</label>
                <input type="number" className="form-control-custom" value={form.publishedYear} onChange={e => setForm(p => ({ ...p, publishedYear: e.target.value }))} placeholder="e.g. 2020" />
              </div>
              <div>
                <label className="form-label-custom">Pages</label>
                <input type="number" className="form-control-custom" value={form.pages} onChange={e => setForm(p => ({ ...p, pages: e.target.value }))} placeholder="Number of pages" />
              </div>
              <div>
                <label className="form-label-custom">Tags (comma-separated)</label>
                <input className="form-control-custom" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. bestseller, classic" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card-custom" style={{ padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Book Photos</h3>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: 32, textAlign: 'center', marginBottom: 16, cursor: 'pointer', transition: 'border-color 0.2s' }} onClick={() => document.getElementById('imgInput').click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); setImages(files); setPreview(files.map(f => URL.createObjectURL(f))); }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <p style={{ color: 'var(--text-muted)' }}>Click or drag images here</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Up to 5 images, max 5MB each</p>
              <input id="imgInput" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImages} />
            </div>
            {(existingImages.length > 0 || preview.length > 0) && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {existingImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <button type="button" onClick={() => setExistingImages(p => p.filter((_, j) => j !== i))}
                      style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', color: '#fff', fontSize: '0.7rem' }}>✕</button>
                  </div>
                ))}
                {preview.map((src, i) => (
                  <div key={i} style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--primary)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exchange settings */}
          <div className="card-custom" style={{ padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Exchange Preferences</h3>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label-custom">Accept Exchanges Via</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['book', 'credits', 'both'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${form.exchangeType === type ? 'var(--primary)' : 'var(--border)'}`, background: form.exchangeType === type ? 'rgba(200,161,101,0.1)' : 'transparent', fontSize: '0.875rem' }}>
                    <input type="radio" name="exchangeType" value={type} checked={form.exchangeType === type} onChange={() => setForm(p => ({ ...p, exchangeType: type }))} style={{ display: 'none' }} />
                    {type === 'book' ? '📚 Books Only' : type === 'credits' ? '🪙 Credits Only' : '✨ Both'}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label-custom">Credit Value</label>
                <input type="number" className="form-control-custom" value={form.creditValue} onChange={e => setForm(p => ({ ...p, creditValue: e.target.value }))} min={5} max={200} />
              </div>
              <div>
                <label className="form-label-custom">Looking For</label>
                <input className="form-control-custom" value={form.wantedBooks} onChange={e => setForm(p => ({ ...p, wantedBooks: e.target.value }))} placeholder="e.g. Harry Potter, Sci-fi novels" />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="form-label-custom">Preferred Genres in Return</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {CATEGORIES.map(g => (
                  <button type="button" key={g} onClick={() => toggleGenre(g)}
                    style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
                      borderColor: form.wantedGenres.includes(g) ? 'var(--primary)' : 'var(--border)',
                      background: form.wantedGenres.includes(g) ? 'rgba(200,161,101,0.15)' : 'transparent',
                      color: form.wantedGenres.includes(g) ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary-custom" style={{ padding: '12px 32px', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Listing' : '📚 List Book'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListBookPage;
