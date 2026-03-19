import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --black: #0a0a0a;
    --white: #f5f0eb;
    --cream: #e8e0d5;
    --gray: #888;
  }
  body { background: var(--white); font-family: 'Jost', sans-serif; color: var(--black); }

  .page { min-height: 100vh; padding: 120px 60px 80px; background: #f5f0eb; }
  .header { display:flex; justify-content:space-between; align-items:flex-end; gap: 24px; margin-bottom: 42px; }
  .label { font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: var(--gray); margin-bottom: 12px; }
  .title { font-family: 'Playfair Display', serif; font-size: clamp(34px, 4.2vw, 58px); font-weight: 800; line-height: 1.05; color: #0a0a0a; }
  .title em { font-style: italic; color: var(--gray); }

  .actions { display:flex; align-items:center; gap: 12px; flex-wrap: wrap; justify-content:flex-end; }
  .search {
    background: rgba(10,10,10,0.04); border: 1px solid rgba(10,10,10,0.12);
    color: #0a0a0a; padding: 10px 14px; font-family: 'Jost', sans-serif;
    font-size: 12px; letter-spacing: 1px; width: min(360px, 78vw); outline: none; transition: all 0.2s;
  }
  .search:focus { border-color: rgba(10,10,10,0.35); }
  .btn {
    background: transparent; border: 1px solid rgba(10,10,10,0.22); color: #0a0a0a;
    padding: 10px 18px; font-family: 'Jost', sans-serif; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
  }
  .btn:hover { background: #0a0a0a; color: #f5f0eb; border-color: #0a0a0a; }

  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }
  .product-card { position: relative; overflow: hidden; cursor: pointer; background: #e8e0d5; }
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
  .product-info { padding: 22px 22px 30px; }
  .product-category-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--gray); margin-bottom: 5px; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 400; margin-bottom: 8px; color: #0a0a0a; }
  .product-bottom { display: flex; justify-content: space-between; align-items: center; }
  .product-price { font-size: 15px; font-weight: 500; letter-spacing: 1px; color: #0a0a0a; }
  .product-stock { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--gray); }
  .product-stock.low { color: #c0392b; }

  .empty-state { padding: 90px 0; text-align: center; grid-column: 1/-1; }
  .empty-text { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: var(--gray); }
  .loading-wrap { min-height: 320px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px; grid-column: 1/-1; }
  .loading-spinner { width: 36px; height: 36px; border: 1px solid rgba(0,0,0,0.1); border-top-color: #0a0a0a; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gray); }

  .toast { position: fixed; bottom: 40px; right: 40px; background: #0a0a0a; color: #f5f0eb; padding: 14px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; z-index: 1000; transform: translateY(80px); opacity: 0; transition: all 0.4s ease; border-left: 2px solid rgba(255,255,255,0.4); }
  .toast.show { transform: translateY(0); opacity: 1; }
`

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" onClick={() => (window.location.href = `/product/${product._id}`)}>
      <div className="product-image-wrap">
        {product.image ? <img src={product.image} alt={product.name} /> : <div className="product-placeholder">👕</div>}
        <div className="product-overlay">
          <button
            className="add-to-cart-overlay"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(product)
            }}
          >
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
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState({ show: false, message: '' })

  useEffect(() => {
    axios
      .get('https://ecomma-backend.onrender.com/api/products')
      .then((res) => {
        setProducts(res.data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Please login to add items')
      return
    }
    axios
      .post(
        'https://ecomma-backend.onrender.com/api/cart',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => showToast(`${product.name} added!`))
      .catch(() => showToast('Please login first'))
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q))
  }, [products, search])

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <div>
            <div className="label">Shop</div>
            <h1 className="title">
              All <em>Products</em>
            </h1>
          </div>
          <div className="actions">
            <input className="search" placeholder="Search pieces..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn" onClick={() => (window.location.href = '/')}>
              Back Home
            </button>
          </div>
        </div>

        <div className="products-grid">
          {loading ? (
            <div className="loading-wrap">
              <div className="loading-spinner" />
              <div className="loading-text">Loading</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-text">{search.trim() ? `No pieces found for "${search}"` : 'No products available yet —'}</div>
            </div>
          ) : (
            filtered.map((p) => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />)
          )}
        </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}

