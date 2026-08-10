export const getConditionBadgeClass = (condition) => {
  const map = { 'Like New': 'badge-like-new', 'Very Good': 'badge-very-good', 'Good': 'badge-good', 'Fair': 'badge-fair', 'Poor': 'badge-poor' };
  return map[condition] || 'badge-good';
};

export const getStatusBadgeClass = (status) => {
  const map = { available: 'badge-status-available', pending: 'badge-status-pending', exchanged: 'badge-status-exchanged' };
  return map[status] || '';
};

export const renderStars = (rating, max = 5) => {
  if (!rating) return '☆☆☆☆☆';
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(max - Math.round(rating));
};

export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getAvatarInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

export const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Philosophy', 'Romance', 'Mystery', 'Fantasy', 'Self-Help', 'Business', 'Children', 'Young Adult', 'Poetry', 'Comics', 'Other'];
export const CONDITIONS = ['Like New', 'Very Good', 'Good', 'Fair', 'Poor'];
