import React, { useState, useEffect } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --black: #0a0a0a; --white: #f5f0eb; --cream: #e8e0d5; --gray: #888; }
  body { background: var(--white); font-family: 'Jost', sans-serif; color: var(--black); }
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 60px; background: rgba(10,10,10,0.97);
    backdrop-filter: blur(10px); flex-wrap: wrap; gap: 10px;
  }
  .navbar-brand {
    font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
    color: #f5f0eb; letter-spacing: 4px; text-transform: uppercase; cursor: pointer;
    background: none; border: none;
  }
  .nav-link {
    color: rgba(245,240,235,0.8); text-decoration: none; font-size: 12px;
    font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; background: none; border: none; font-family: 'Jost', sans-serif;
    transition: color 0.2s;
  }
  .nav-link:hover { color: #f5f0eb; }
  .nav-btn {
    background: transparent; border: 1px solid rgba(245,240,235,0.3); color: #f5f0eb;
    padding: 8px 20px; font-family: 'Jost', sans-serif; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .nav-btn:hover { background: #f5f0eb; color: #0a0a0a; }
  .page-header {
    padding: 160px 60px 60px; background: #0a0a0a;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .page-eyebrow { font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 20px; }
  .page-title {
    font-family: 'Playfair Display', serif; font-size: clamp(40px, 6vw, 80px);
    font-weight: 900; color: #f5f0eb; line-height: 0.95; letter-spacing: -2px;
  }
  .page-title em { font-style: italic; color: rgba(255,255,255,0.4); }
  .page-count { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 20px; }
  .filters-bar {
    padding: 24px 60px; background: #f5f0eb;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  }
  .filter-btn {
    padding: 8px 20px; font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    cursor: pointer; background: transparent; border: 1px solid rgba(0,0,0,0.15);
    font-family: 'Jost', sans-serif; color: #888; transition: all 0.2s;
  }
  .filter-btn:hover { border-color: #0a0a0a; color: #0a0a0a; }
  .filter-active { background: #0a0a0a !important; color: #f5f0eb !important; border-color: #0a0a0a !important; }
  .filter-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-right: 8px; }
  .products-section { padding: 60px; background: #f5f0eb; min-height: 60vh; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }
  .product-card { position: relative; overflow: hidden; cursor: pointer; background: #e8e0d5; border: 1px solid #e8e0d5; }
  .product-image-wrap { position: relative; overflow: hidden; aspect-ratio: 3/4; background: #e8e0d5; }
  .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .product-card:hover .product-image-wrap img { transform: scale(1.06); }
  .product-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 60px; opacity: 0.15; }
  .product-overlay { position: absolute; inset: 0; background: rgba(10,10,10,0); transition: background 0.4s; display: flex; align-items: flex-end; padding: 20px; }
  .product-card:hover .product-overlay { background: rgba(10,10,10,0.3); }
  .add-to-cart-overlay {
    width: 100%; background: #f5f0eb; color: #0a0a0a; border: none; padding: 13px;
    font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer; transform: translateY(20px); opacity: 0; transition: all 0.3s ease;
  }
  .product-card:hover .add-to-cart-overlay { transform: translateY(0); opacity: 1; }
  .add-to-cart-overlay:hover { background: #0a0a0a; color: #f5f0eb; }
  .product-tag { position: absolute; top: 14px; left: 14px; background: #0a0a0a; color: #f5f0eb; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; }
  .product-info { padding: 18px 16px 28px; background: #f5f0eb; }
  .product-category-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--gray); margin-bottom: 5px; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 400; margin-bottom: 8px; color: #0a0a0a; }
  .product-bottom { display: flex; justify-content: space-between; align-items: center; }
  .product-price { font-size: 15px; font-weight: 500; letter-spacing: 1px; color: #0a0a0a; }
  .product-stock { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--gray); }
  .product-stock.low { color: #c0392b; }
  .empty-state { grid-column: 1/-1; padding: 80px 0; text-align: center; }
  .empty-text { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: var(--gray); }
  .loading-wrap { min-height: 300px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px; grid-column: 1/-1; }
  .loading-spinner { width: 36px; height: 36px; border: 1px solid rgba(0,0,0,0.1); border-top-color: #0a0a0a; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gray); }
  .toast { position: fixed; bottom: 40px; right: 40px; background: #0a0a0a; color: #f5f0eb; padding: 14px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; z-index: 1000; transform: translateY(80px); opacity: 0; transition: all 0.4s ease; border-left: 2px solid rgba(255,255,255,0.4); }
  .toast.show { transform: translateY(0); opacity: 1; }
  .footer { background: #0a0a0a; padding: 36px 60px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
  .footer-brand { font-family: 'Playfair Display', serif; font-size: 18px; color: #f5f0eb; letter-spacing: 4px; text-transform: uppercase; }
  .footer-copy { font-size: 10px; color: rgba(245,240,235,0.25); letter-spacing: 2px; }
`

const ALL_FILTERS = ['All', 'Men', 'Women', 'T-Shirts', 'Shirts', 'Pants', 'Jackets']

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" onClick={() => window.location.href = `/product/${product._id}`}>
      <div className="product-image-wrap">
        {product.image
          ? <img src={product.image} alt={product.name} />
          : <div className="product-placeholder">👕</div>
        }
        <div className="product-overlay">
          <button className="add-to-cart-overlay" onClick={e => { e.stopPropagation(); onAddToCart(product) }}>
            Add to Cart
          </button>
        </div>
        <div className="product-tag">{product.category}</div>
      </div>
      <div className="product-info">
        <div className="product-category-label">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-bottom">
          <div className="product-price">Rs.{product.price}</div>
          <div className={`product-stock ${product.stock < 5 ? 'low' : ''}`}>
            {product.stock < 5 ? `Only ${product.stock} left` : 'In Stock'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [toast, setToast] = useState({ show: false, message: '' })
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  useEffect(() => {
    axios.get('https://ecomma-backend.onrender.com/api/products')
      .then(res => { setProducts(res.data.products); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token')
    if (!token) { showToast('Please login to add items'); return }
    axios.post('https://ecomma-backend.onrender.com/api/cart',
      { productId: product._id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => showToast(`${product.name} added!`)).catch(() => showToast('Please login first'))
  }

  const filteredProducts = products.filter(p => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Men') return p.category.startsWith('men-')
    if (activeFilter === 'Women') return p.category.startsWith('women-')
    return p.category.toLowerCase().includes(activeFilter.toLowerCase())
  })

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <button className="navbar-brand" onClick={() => window.location.href = '/'}>E—Comma</button>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button className="nav-link" onClick={() => window.location.href = '/#men'}>Men</button>
          <button className="nav-link" onClick={() => window.location.href = '/#women'}>Women</button>
          <button className="nav-link" onClick={() => window.location.href = '/orders'}>Orders</button>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'rgba(245,240,235,0.6)', fontSize: '12px', letterSpacing: '1px' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              {user.role === 'admin' && (
                <button className="nav-btn" onClick={() => window.location.href = '/admin'}>Admin</button>
              )}
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="nav-btn" onClick={() => window.location.href = '/login'}>Account</button>
          )}
          <button className="nav-btn" onClick={() => window.location.href = '/cart'}>Cart</button>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-eyebrow">The Collection</div>
        <h1 className="page-title">All<br /><em>Products</em></h1>
        <div className="page-count">{products.length} pieces available</div>
      </div>

      {/* FILTERS */}
      <div className="filters-bar">
        <span className="filter-label">Filter —</span>
        {ALL_FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${activeFilter === f ? 'filter-active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        <div className="products-grid">
          {loading ? (
            <div className="loading-wrap">
              <div className="loading-spinner" />
              <div className="loading-text">Loading</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-text">No pieces found —</div>
            </div>
          ) : (
            filteredProducts.map(p => (
              <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />
            ))
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">E—Comma</div>
        <div className="footer-copy">2024 E-Comma. All rights reserved.</div>
      </footer>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}