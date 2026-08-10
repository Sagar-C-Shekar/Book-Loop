import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Biography','Technology','Philosophy','Romance','Mystery','Fantasy','Self-Help','Business','Children','Young Adult','Poetry','Comics','Other'];
const CONDITIONS = ['Like New','Very Good','Good','Fair','Poor'];

export default function UploadBookPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    title: '', author: '', description: '', category: 'Fiction', condition: 'Good',
    isbn: '', language: 'English', publishedYear: '', pages: '',
    exchangeType: 'both', creditValue: '20', wantedBooks: '', tags: ''
  });
  const [wantedGenres, setWantedGenres] = useState([]);
  const [images, setImages] = useState([]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const toggleGenre = (g) => {
    setWantedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('wantedGenres', JSON.stringify(wantedGenres));
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      images.forEach(img => fd.append('images', img));
      const { data } = await api.post('/books', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      addToast('Book listed successfully!', 'success');
      navigate(`/books/${data._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2.5rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="mb-4">
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-plus-circle me-2" style={{ color: 'var(--accent-purple)' }} />List a Book
              </h1>
              <p style={{ color: 'var(--text-muted)' }}>Share a book and earn credits when it gets exchanged</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="card-glass p-4 mb-4">
                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem', color: 'var(--accent-purple)' }}>
                  📖 Book Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title *</label>
                    <input className="form-control" required value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Book title" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Author *</label>
                    <input className="form-control" required value={form.author}
                      onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea className="form-control" rows={3} required value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Brief synopsis or your thoughts on the book…" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Genre / Category *</label>
                    <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Condition *</label>
                    <select className="form-select" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                      {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Language</label>
                    <input className="form-control" value={form.language}
                      onChange={e => setForm({ ...form, language: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ISBN</label>
                    <input className="form-control" value={form.isbn} placeholder="Optional"
                      onChange={e => setForm({ ...form, isbn: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Published Year</label>
                    <input type="number" className="form-control" placeholder="e.g. 2020" value={form.publishedYear}
                      onChange={e => setForm({ ...form, publishedYear: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Pages</label>
                    <input type="number" className="form-control" placeholder="e.g. 320" value={form.pages}
                      onChange={e => setForm({ ...form, pages: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Tags <span style={{ color: 'var(--text-muted)' }}>(comma separated)</span></label>
                    <input className="form-control" placeholder="e.g. dystopia, classic, award-winner" value={form.tags}
                      onChange={e => setForm({ ...form, tags: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="card-glass p-4 mb-4">
                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
                  📸 Photos
                </h5>
                <label className="d-block" style={{ cursor: 'pointer' }}>
                  <div style={{ border: '2px dashed var(--border-light)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', background: 'rgba(167,139,250,0.03)', transition: 'var(--transition)' }}
                    onDragOver={e => e.preventDefault()}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--accent-purple)', marginBottom: '0.75rem', display: 'block' }} />
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Drop images here or click to browse</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Up to 5 images · Max 5MB each · JPG, PNG, WebP</div>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
                </label>
                {previews.length > 0 && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {previews.map((p, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={p} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-light)' }} />
                        <button type="button" onClick={() => { setPreviews(prev => prev.filter((_, j) => j !== i)); setImages(prev => prev.filter((_, j) => j !== i)); }}
                          style={{ position: 'absolute', top: -6, right: -6, background: 'var(--accent-rose)', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: '0.65rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exchange Terms */}
              <div className="card-glass p-4 mb-4">
                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem', color: 'var(--accent-teal)' }}>
                  🤝 Exchange Terms
                </h5>
                <div className="mb-3">
                  <label className="form-label">Exchange Type</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {[['both', 'Flexible (Book or Credits)'], ['book', 'Book Only'], ['credits', 'Credits Only']].map(([val, label]) => (
                      <button type="button" key={val}
                        className={`btn btn-sm ${form.exchangeType === val ? 'btn-primary' : ''}`}
                        onClick={() => setForm({ ...form, exchangeType: val })}
                        style={form.exchangeType !== val ? { border: '1px solid var(--border-light)', color: 'var(--text-secondary)', background: 'none' } : {}}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {(form.exchangeType === 'credits' || form.exchangeType === 'both') && (
                  <div className="mb-3">
                    <label className="form-label">Credit Value</label>
                    <input type="number" className="form-control" min={1} value={form.creditValue}
                      onChange={e => setForm({ ...form, creditValue: e.target.value })}
                      style={{ maxWidth: '150px' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Credits a buyer needs to acquire this book
                    </div>
                  </div>
                )}

                {(form.exchangeType === 'book' || form.exchangeType === 'both') && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Wanted Genres</label>
                      <div className="d-flex flex-wrap gap-2">
                        {CATEGORIES.map(g => (
                          <button type="button" key={g}
                            className="btn btn-sm"
                            onClick={() => toggleGenre(g)}
                            style={{
                              border: `1px solid ${wantedGenres.includes(g) ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                              background: wantedGenres.includes(g) ? 'rgba(167,139,250,0.15)' : 'transparent',
                              color: wantedGenres.includes(g) ? 'var(--accent-purple)' : 'var(--text-muted)',
                              fontSize: '0.75rem', padding: '0.2rem 0.6rem'
                            }}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Additional Notes</label>
                      <textarea className="form-control" rows={2} placeholder="Specific books you're looking for…"
                        value={form.wantedBooks} onChange={e => setForm({ ...form, wantedBooks: e.target.value })} />
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-primary btn-lg px-5" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="fas fa-upload me-2" />}
                  Publish Listing
                </button>
                <button type="button" className="btn btn-lg" onClick={() => navigate(-1)}
                  style={{ border: '1px solid var(--border-light)', color: 'var(--text-secondary)', background: 'none' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
