import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookCard from '../components/books/BookCard';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GiBookshelf } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Biography','Technology','Philosophy','Romance','Mystery','Fantasy','Self-Help','Business','Children','Young Adult','Poetry','Comics','Other'];
const CONDITIONS = ['Like New','Very Good','Good','Fair','Poor'];

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, totalExchanges: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (condition) params.append('condition', condition);
      if (sort) params.append('sort', sort);
      const { data } = await axios.get(`/api/books?${params}`);
      setBooks(data.books);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, category, condition, sort, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  useEffect(() => {
    axios.get('/api/leaderboard/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const handleFilterChange = (setter) => (e) => { setter(e.target.value); setPage(1); };
  const clearFilters = () => { setSearch(''); setSearchInput(''); setCategory(''); setCondition(''); setSort(''); setPage(1); };
  const hasFilters = search || category || condition || sort;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0e17 0%, #1a1a2e 60%, #16213e 100%)',
        padding: '80px 24px 60px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,197,71,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.05) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div className="text-center mb-4">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
              <GiBookshelf color="var(--accent-primary)" size={16} />
              <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Community Book Exchange</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
              Give Books New <span style={{ color: 'var(--accent-primary)' }}>Lives.</span><br />
              Discover New <span style={{ color: 'var(--accent-teal)' }}>Stories.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 32px' }}>
              Exchange books you've loved for ones you'll love. Earn credits, build community.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 36, flexWrap: 'wrap' }}>
            {[
              { label: 'Members', value: stats.totalUsers },
              { label: 'Books Listed', value: stats.totalBooks },
              { label: 'Exchanges Done', value: stats.totalExchanges }
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{value.toLocaleString()}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 0, background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by title, author, or description..."
              style={{ flex: 1, background: 'none', border: 'none', padding: '14px 18px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none' }} />
            <button type="submit" className="btn-gold" style={{ borderRadius: 0, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiSearch size={18} /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: showFilters ? 'var(--accent-primary)' : 'var(--bg-card)',
            color: showFilters ? 'var(--bg-primary)' : 'var(--text-primary)', border: '1px solid var(--border-color)',
            borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s'
          }}>
            <FiFilter size={15} /> Filters {hasFilters && '•'}
          </button>

          {showFilters && (
            <>
              <select value={category} onChange={handleFilterChange(setCategory)} className="form-control-dark" style={{ width: 'auto', padding: '8px 12px', fontSize: '0.875rem' }}>
                <option value="">All Genres</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={condition} onChange={handleFilterChange(setCondition)} className="form-control-dark" style={{ width: 'auto', padding: '8px 12px', fontSize: '0.875rem' }}>
                <option value="">All Conditions</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sort} onChange={handleFilterChange(setSort)} className="form-control-dark" style={{ width: 'auto', padding: '8px 12px', fontSize: '0.875rem' }}>
                <option value="">Latest First</option>
                <option value="popular">Most Viewed</option>
                <option value="liked">Most Liked</option>
                <option value="credits">Lowest Credits</option>
              </select>
              {hasFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontSize: '0.825rem', padding: '4px 8px' }}>
                  ✕ Clear all
                </button>
              )}
            </>
          )}

          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {total} book{total !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {search && <Chip label={`"${search}"`} onRemove={() => { setSearch(''); setSearchInput(''); }} />}
            {category && <Chip label={category} onRemove={() => setCategory('')} />}
            {condition && <Chip label={condition} onRemove={() => setCondition('')} />}
            {sort && <Chip label={sort === 'popular' ? 'Most Viewed' : sort === 'liked' ? 'Most Liked' : 'Lowest Credits'} onRemove={() => setSort('')} />}
          </div>
        )}

        {/* Books grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner-gold" />
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>No books found</h3>
            <p style={{ marginBottom: 20 }}>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-gold">Clear filters</button>
          </div>
        ) : (
          <div className="row g-4">
            {books.map(book => (
              <div key={book._id} className="col-6 col-md-4 col-lg-3">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
              <FiChevronLeft />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
              }
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ background: page === p ? 'var(--accent-primary)' : 'var(--bg-card)', color: page === p ? 'var(--bg-primary)' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: page === p ? 700 : 400 }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* CTA banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-card))', padding: '60px 24px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>
            Have books to <span style={{ color: 'var(--accent-primary)' }}>share</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
            List your books, earn credits, and help another reader discover their next favourite story.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/add-book" className="btn-gold" style={{ padding: '12px 32px', fontSize: '1rem' }}>List a Book</Link>
            <Link to="/register" className="btn-outline-gold" style={{ padding: '12px 32px', fontSize: '1rem' }}>Join Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const Chip = ({ label, onRemove }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(232,197,71,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(232,197,71,0.3)', borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem' }}>
    {label}
    <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}>×</button>
  </span>
);
