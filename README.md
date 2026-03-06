# E—Comma Frontend

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on%20Vercel-000000?style=flat&logo=vercel&logoColor=white)

A premium clothing (thrift) store frontend built with React.js. Features a dark minimal aesthetic, category-based product browsing, OTP authentication, shopping cart, order management, and a full admin panel.

**Live Demo:** https://ecomma-frontend.vercel.app

---

## Features

- Dark premium UI with Playfair Display and Jost typography
- Men's and Women's sections with category tabs
- Live search across all products
- OTP-based email verification on registration
- Product detail page with multi-image gallery
- Shopping cart with quantity controls
- Order history with expandable order details
- Full admin panel — products, orders, customers
- Smart navbar — shows logout when authenticated
- Responsive layout

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| CSS-in-JS | Component styling |
| Google Fonts | Typography |

---

## Project Structure
```
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Orders.jsx
│   └── Admin.jsx
└── App.js
```

---

## Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/shahalabdulla/ecomma-frontend.git
cd ecomma-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server
```bash
npm start
```

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, product sections, search |
| Auth | `/login` | Login and register with OTP |
| Product Detail | `/product/:id` | Image gallery, add to cart |
| Cart | `/cart` | Cart items, checkout, address |
| Orders | `/orders` | Order history with status |
| Admin | `/admin` | Full admin dashboard |

---

## Admin Panel

The admin panel is accessible at `/admin` and requires an account with `role: admin` in the database.

Features:
- Dashboard with total products, orders, revenue, and pending orders
- Add products with multiple image upload via Cloudinary
- Delete products
- View all orders with customer details and shipping address
- Update order status (pending, processing, shipped, delivered, cancelled)
- View all customers

---

## Related

- Backend Repository: [ecomma-backend](https://github.com/shahalabdulla/ecomma-backend)
- Live API: https://ecomma-backend.onrender.com

---

## Author

**Shahal Abdulla**
GitHub: [@shahalabdulla](https://github.com/shahalabdulla)

---

## License

MIT