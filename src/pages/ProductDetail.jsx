import React, { useState, useEffect } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f5f0eb; font-family: 'Jost', sans-serif; }
  .pd-navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px 60px; border-bottom: 1px solid rgba(0,0,0,0.08);
  }
  .pd-brand {
    font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700;
    color: #0a0a0a; letter-spacing: 4px; text-transform: uppercase;
    cursor: pointer; background: none; border: none;
  }
  .pd-back {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888;
    background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif; transition: color 0.2s;
  }
  .pd-back:hover { color: #0a0a0a; }
  .pd-container {
    display: flex; max-width: 1200px; margin: 0 auto;
    padding: 80px 60px; gap: 80px; min-height: 80vh;
  }
  .pd-image-side { flex: 1; }
  .pd-main-image {
    width: 100%; aspect-ratio: 3/4; background: #e8e0d5;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; margin-bottom: 12px;
  }
  .pd-main-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .pd-main-image:hover img { transform: scale(1.04); }
  .pd-placeholder { font-size: 80px; opacity: 0.2; }
  .pd-info-side { flex: 1; padding-top: 20px; }
  .pd-category { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #888; margin-bottom: 16px; }
  .pd-name {
    font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 52px);
    font-weight: 700; color: #0a0a0a; line-height: 1.1; margin-bottom: 24px;
  }
  .pd-price { font-size: 28px; font-weight: 500; color: #0a0a0a; letter-spacing: 1px; margin-bottom: 8px; }
  .pd-stock { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 40px; }
  .pd-stock.low { color: #c0392b; }
  .pd-divider { height: 1px; background: rgba(0,0,0,0.08); margin: 32px 0; }
  .pd-desc-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 12px; }
  .pd-desc { font-size: 14px; color: #555; line-height: 1.8; letter-spacing: 0.3px; margin-bottom: 48px; }
  .qty-section { margin-bottom: 24px; }
  .qty-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 12px; }
  .qty-controls { display: flex; align-items: center; gap: 0; border: 1px solid rgba(0,0,0,0.15); width: fit-content; }
  .qty-btn {
    width: 44px; height: 44px; background: transparent; border: none;
    cursor: pointer; font-size: 18px; color: #0a0a0a; transition: background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .qty-btn:hover { background: rgba(0,0,0,0.05); }
  .qty-num { width: 52px; text-align: center; font-size: 14px; letter-spacing: 2px; font-family: 'Jost', sans-serif; }
  .add-btn {
    width: 100%; background: #0a0a0a; color: #f5f0eb; border: none; padding: 18px;
    font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer; transition: all 0.3s; margin-bottom: 12px;
    position: relative; overflow: hidden;
  }
  .add-btn::before { content: ''; position: absolute; inset: 0; background: #333; transform: translateX(-100%); transition: transform 0.4s ease; }
  .add-btn:hover::before { transform: translateX(0); }
  .add-btn span { position: relative; z-index: 1; }
  .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .wishlist-btn {
    width: 100%; background: transparent; color: #0a0a0a;
    border: 1px solid rgba(0,0,0,0.2); padding: 16px;
    font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .wishlist-btn:hover { border-color: #0a0a0a; }
  .pd-features { display: flex; flex-direction: column; gap: 0; margin-top: 40px; }
  .pd-feature {
    display: flex; align-items: center; gap: 16px; padding: 16px 0;
    border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 12px;
    letter-spacing: 1px; color: #555;
  }
  .pd-feature-icon { font-size: 18px; opacity: 0.6; }
  .loading-wrap { display: flex; align-items: center; justify-content: center; min-height: 80vh; flex-direction: column; gap: 20px; }
  .loading-spinner { width: 36px; height: 36px; border: 1px solid rgba(0,0,0,0.1); border-top-color: #0a0a0a; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #888; }
  .toast { position: fixed; bottom: 40px; right: 40px; background: #0a0a0a; color: #f5f0eb; padding: 14px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; z-index: 1000; transform: translateY(80px); opacity: 0; transition: all 0.4s ease; border-left: 2px solid rgba(255,255,255,0.3); }
  .toast.show { transform: translateY(0); opacity: 1; }
`

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })

  const id = window.location.pathname.split('/').pop()
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => { setProduct(res.data.product); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleAddToCart = () => {
    if (!token) { window.location.href = '/login'; return }
    setAdding(true)
    axios.post('http://localhost:5000/api/cart',
      { productId: product._id, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      showToast(`${product.name} added to cart!`)
      setAdding(false)
    }).catch(() => {
      showToast('Could not add to cart!')
      setAdding(false)
    })
  }

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <div className="loading-text">Loading</div>
      </div>
    </>
  )

  if (!product) return (
    <>
      <style>{styles}</style>
      <div className="loading-wrap">
        <div className="loading-text">Product not found</div>
      </div>
    </>
  )

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <div className="pd-navbar">
        <button className="pd-back" onClick={() => window.history.back()}>← Back</button>
        <button className="pd-brand" onClick={() => window.location.href = '/'}>E—Comma</button>
        <button className="pd-back" onClick={() => window.location.href = '/cart'}>Cart</button>
      </div>

      <div className="pd-container">

        {/* LEFT — IMAGE */}
        <div className="pd-image-side">
          {/* MAIN IMAGE */}
          <div className="pd-main-image">
            {product.images && product.images.length > 0
              ? <img src={product.images[activeImage]} alt={product.name} />
              : product.image
                ? <img src={product.image} alt={product.name} />
                : <div className="pd-placeholder">👕</div>
            }
          </div>

          {/* THUMBNAILS */}
          {product.images && product.images.length > 1 && (
            <div style={{display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap'}}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width:'70px', height:'85px', cursor:'pointer',
                    border: activeImage === i ? '2px solid #0a0a0a' : '2px solid transparent',
                    overflow:'hidden', transition:'border 0.2s'
                  }}
                >
                  <img src={img} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — INFO */}
        <div className="pd-info-side">
          <div className="pd-category">{product.category}</div>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-price">Rs.{product.price}</div>
          <div className={`pd-stock ${product.stock < 5 ? 'low' : ''}`}>
            {product.stock < 5 ? `Only ${product.stock} left` : `In Stock — ${product.stock} available`}
          </div>

          <div className="pd-divider" />

          <div className="pd-desc-label">Description</div>
          <div className="pd-desc">{product.description || 'A carefully curated pre-loved piece, handpicked for quality and style.'}</div>

          {/* QUANTITY */}
          <div className="qty-section">
            <div className="qty-label">Quantity</div>
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          {/* BUTTONS */}
          <button className="add-btn" onClick={handleAddToCart} disabled={adding}>
            <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
          </button>

          <button className="wishlist-btn">♡ Add to Wishlist</button>

          {/* FEATURES */}
          <div className="pd-features">
            <div className="pd-feature">
              <span className="pd-feature-icon">♻️</span>
              Pre-loved & sustainably sourced
            </div>
            <div className="pd-feature">
              <span className="pd-feature-icon">✦</span>
              Handpicked and quality checked
            </div>
            <div className="pd-feature">
              <span className="pd-feature-icon">📦</span>
              Free shipping above Rs.999
            </div>
            <div className="pd-feature">
              <span className="pd-feature-icon">↩️</span>
              Easy returns within 7 days
            </div>
          </div>
        </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}