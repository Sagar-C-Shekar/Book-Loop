# 📚 BookLoop – Community Book Exchange Platform

A full-stack MERN application where users can list, browse, and exchange books within a community, earn credits, and climb the leaderboards.

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router v6, Bootstrap 5, react-hot-toast, react-icons |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB + Mongoose                              |
| Auth       | JWT (jsonwebtoken), bcryptjs                    |
| Real-time  | Socket.IO (chat + notifications)                |
| File Upload| Multer                                          |

---

## ✨ Features

### 👥 User System
- JWT-based signup / login (with 50 free welcome credits on registration)
- Profile management (name, bio, location)
- Public profile pages with activity stats
- Rating & review system after completed exchanges

### 📖 Book Listings (Seller Portal)
- Create listings with title, author, genre, condition, images (up to 5), description
- Set exchange type: Books Only / Credits Only / Both
- Configure credit value and preferred genres to receive
- Edit or delete your own listings

### 🔍 Browse & Search (Buyer Portal)
- Full-text search by title, author, description
- Filter by genre, condition
- Sort by latest / most viewed / most liked
- Paginated grid layout with detailed book cards
- Like / save books

### 🔄 Exchange System
- Request exchanges — offer a book OR credits
- Provide delivery method, contact, address
- Seller accepts / rejects with an optional message
- Buyer can cancel pending requests
- Seller marks exchange as complete → credits awarded
- Post-exchange reviews and star ratings

### 💰 Credit System
- 50 welcome credits on signup
- 30 credits earned per completed exchange as seller
- Credits deducted when using credits to acquire a book
- Full transaction history in dashboard

### 🏆 Leaderboard
- Top Sellers (by exchanges completed + books listed)
- Top Buyers (by books acquired)
- Live community stats (members, books, exchanges)

### 🔔 Notifications
- In-app notifications for exchange requests, acceptances, completions
- Unread badge on navbar bell icon
- Mark all as read

---

## 📦 Project Structure

```
bookloop/
├── server/
│   ├── index.js              # Express + Socket.IO server
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Exchange.js
│   │   ├── Credit.js
│   │   └── Conversation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── exchanges.js
│   │   ├── users.js
│   │   ├── leaderboard.js
│   │   ├── credits.js
│   │   ├── notifications.js
│   │   ├── reviews.js
│   │   └── chat.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── upload.js         # Multer image uploads
│   └── uploads/              # Stored book images
└── client/
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── context/AuthContext.js
        ├── components/
        │   ├── layout/Navbar.js, Footer.js
        │   └── books/BookCard.js
        └── pages/
            ├── HomePage.js
            ├── LoginPage.js / RegisterPage.js
            ├── BookDetailPage.js
            ├── AddBookPage.js / EditBookPage.js
            ├── DashboardPage.js
            ├── ExchangesPage.js / ExchangeDetailPage.js
            ├── LeaderboardPage.js
            ├── ProfilePage.js
            ├── ChatPage.js
            └── NotFoundPage.js
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repo-url>
cd bookloop
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookloop
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Install dependencies
```bash
# Root (server) dependencies
npm install

# Client dependencies
cd client && npm install && cd ..
```

### 4. Run the application

**Development (both server + client):**
```bash
npm run dev
```

**Server only:**
```bash
npm start
```

**Client only:**
```bash
cd client && npm start
```

### 5. Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🗃️ API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/profile` | Update profile |
| GET  | `/api/books` | Browse books (with filters) |
| POST | `/api/books` | Create listing |
| GET  | `/api/books/:id` | Book detail |
| PUT  | `/api/books/:id` | Edit listing |
| DELETE| `/api/books/:id` | Delete listing |
| POST | `/api/books/:id/like` | Toggle like |
| GET  | `/api/exchanges` | My exchanges |
| POST | `/api/exchanges` | Request exchange |
| PUT  | `/api/exchanges/:id/respond` | Accept/reject |
| PUT  | `/api/exchanges/:id/complete` | Mark complete |
| PUT  | `/api/exchanges/:id/cancel` | Cancel |
| GET  | `/api/leaderboard/sellers` | Top sellers |
| GET  | `/api/leaderboard/buyers` | Top buyers |
| GET  | `/api/leaderboard/stats` | Community stats |
| GET  | `/api/credits/history` | Credit history |
| GET  | `/api/notifications` | My notifications |
| PUT  | `/api/notifications/read-all` | Mark all read |
| POST | `/api/reviews/:exchangeId` | Submit review |
| GET  | `/api/chat/conversations` | My conversations |
| POST | `/api/chat/start` | Start conversation |
| POST | `/api/chat/:id/message` | Send message |
| GET  | `/api/users/:id` | Public profile |

---

## 🎨 Design System

The UI uses a dark, editorial aesthetic with:
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Colors:** Deep navy backgrounds, gold accent (`#e8c547`), teal secondary (`#4ecdc4`)
- **Components:** Custom CSS variables, consistent card/button/badge patterns

---

## 🧩 Extending the Platform

- **Admin Panel:** Add an `/admin` route with `adminAuth` middleware
- **Email Notifications:** Integrate Nodemailer for exchange alerts
- **Book Recommendations:** Suggest books based on wantedGenres
- **Cloud Storage:** Replace Multer with Cloudinary/S3 for production images
- **Payment System:** Add Stripe for premium credits or subscriptions
