import React, { useState, useEffect } from 'react'
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
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 30px; transition: background 0.4s ease, padding 0.4s ease;
    flex-wrap: wrap; gap: 10px;



   
  }
  .navbar.scrolled { background: rgba(10,10,10,0.97); padding: 16px 60px; backdrop-filter: blur(10px); }
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
  .search-input {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    color: #f5f0eb; padding: 8px 36px 8px 16px; font-family: 'Jost', sans-serif;
    font-size: 12px; letter-spacing: 1px; width: 220px; outline: none; transition: all 0.3s;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.35); }
  .search-input:focus { width: 280px; border-color: rgba(255,255,255,0.4); }
  .hero {
    position: relative; height: 100vh; background: #0a0a0a;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0d0d 100%); }
  .hero-grain {
    position: absolute; inset: 0; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px;
  }
  .hero-accent-line {
    position: absolute; left: 60px; top: 50%; transform: translateY(-50%);
    width: 1px; height: 200px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
  }
  .hero-content {
    position: relative; z-index: 2; text-align: center;
    max-width: 900px; padding: 0 40px; animation: fadeUp 1.2s ease forwards;
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  .hero-eyebrow { font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 28px; }
  .hero-title {
    font-family: 'Playfair Display', serif; font-size: clamp(56px, 8vw, 110px);
    font-weight: 900; color: #f5f0eb; line-height: 0.95; margin-bottom: 32px; letter-spacing: -2px;
  }
  .hero-title em { font-style: italic; color: rgba(255,255,255,0.55); }
  .hero-subtitle { font-size: 15px; color: rgba(245,240,235,0.45); letter-spacing: 1px; margin-bottom: 52px; font-weight: 300; }
  .hero-cta {
    background: #f5f0eb; color: #0a0a0a; padding: 16px 52px;
    font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase; cursor: pointer; border: none;
    transition: all 0.3s ease; position: relative; overflow: hidden;
  }
  .hero-cta::before { content: ''; position: absolute; inset: 0; background: #333; transform: translateX(-100%); transition: transform 0.4s ease; }
  .hero-cta:hover::before { transform: translateX(0); }
  .hero-cta span { position: relative; z-index: 1; }
  .hero-scroll {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: rgba(245,240,235,0.3); font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    animation: bounce 2s infinite;
  }
  .scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, rgba(245,240,235,0.3), transparent); }
  @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
  .marquee-section { background: #0a0a0a; padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.06); overflow: hidden; }
  .marquee-track { display: flex; gap: 60px; animation: marquee 25s linear infinite; width: max-content; }
  .marquee-item { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.35); white-space: nowrap; display: flex; align-items: center; gap: 60px; }
  .marquee-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.25); }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .shop-section { padding: 100px 60px; }
  .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
  .section-label { font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: var(--gray); margin-bottom: 12px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 700; line-height: 1.1; color: #0a0a0a; }
  .section-title em { font-style: italic; color: var(--gray); }
  .section-title-white { font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 700; line-height: 1.1; color: #f5f0eb; }
  .section-title-white em { font-style: italic; color: rgba(255,255,255,0.4); }
  .tabs { display: flex; margin-bottom: 50px; border-bottom: 1px solid rgba(0,0,0,0.1); }
  .tabs-dark { border-bottom: 1px solid rgba(255,255,255,0.08); }
  .tab-btn {
    padding: 14px 32px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    cursor: pointer; background: transparent; border: none; border-bottom: 2px solid transparent;
    margin-bottom: -1px; transition: all 0.3s; color: var(--gray); font-family: 'Jost', sans-serif;
  }
  .tab-active-light { color: #0a0a0a !important; border-bottom-color: #0a0a0a !important; }
  .tab-active-dark { color: #f5f0eb !important; border-bottom-color: #f5f0eb !important; }
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
  .product-info { padding: 18px 0 28px; }
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
  .loading-spinner-white { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.1); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gray); }
  .search-section { padding: 120px 60px 80px; background: #f5f0eb; min-height: 100vh; }
  .feature-strip { background: #0a0a0a; padding: 60px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
  .feature-item { text-align: center; }
  .feature-icon { font-size: 26px; margin-bottom: 16px; opacity: 0.6; }
  .feature-title { font-family: 'Playfair Display', serif; font-size: 15px; color: #f5f0eb; margin-bottom: 8px; }
  .feature-desc { font-size: 11px; color: rgba(245,240,235,0.35); letter-spacing: 1px; line-height: 1.6; }
  .footer { background: #0a0a0a; padding: 36px 60px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
  .footer-brand { font-family: 'Playfair Display', serif; font-size: 18px; color: #f5f0eb; letter-spacing: 4px; text-transform: uppercase; }
  .footer-copy { font-size: 10px; color: rgba(245,240,235,0.25); letter-spacing: 2px; }
  .toast { position: fixed; bottom: 40px; right: 40px; background: #0a0a0a; color: #f5f0eb; padding: 14px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; z-index: 1000; transform: translateY(80px); opacity: 0; transition: all 0.4s ease; border-left: 2px solid rgba(255,255,255,0.4); }
  .toast.show { transform: translateY(0); opacity: 1; }
`

const marqueeItems = ['Free Shipping Above Rs.999','Handpicked Thrift Pieces','Sustainable Fashion','Premium Pre-Loved Clothing','New Arrivals Every Week','Free Returns']
const CATEGORIES = ['T-Shirts','Shirts','Pants','Jackets']

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" onClick={() => window.location.href = `/product/${product._id}`}>
      <div className="product-image-wrap">
        {product.image ? <img src={product.image} alt={product.name} /> : <div className="product-placeholder">👕</div>}
        <div className="product-overlay">
          <button className="add-to-cart-overlay" onClick={() => onAddToCart(product)}>Add to Cart</button>
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

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState('')
  const [menTab, setMenTab] = useState('T-Shirts')
  const [womenTab, setWomenTab] = useState('T-Shirts')
  const [toast, setToast] = useState({ show: false, message: '' })
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
  }

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => { setProducts(res.data.products); setLoading(false) })
      .catch(() => setLoading(false))
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showToast = (msg) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token')
    if (!token) { showToast('Please login to add items'); return }
    axios.post('http://localhost:5000/api/cart',
      { productId: product._id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => showToast(`${product.name} added!`)).catch(() => showToast('Please login first'))
  }

  const isSearching = search.trim().length > 0
  const searchResults = isSearching
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const menProducts = products.filter(p => p.category === `men-${menTab.toLowerCase()}`)
  const womenProducts = products.filter(p => p.category === `women-${womenTab.toLowerCase()}`)
  const marqueeDouble = [...marqueeItems, ...marqueeItems]

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <button className="navbar-brand" onClick={() => { setSearch(''); window.scrollTo(0,0) }}>E—Comma</button>
        <div style={{display:'flex', gap:'32px', alignItems:'center'}}>
          <button className="nav-link" onClick={() => document.getElementById('men')?.scrollIntoView({ behavior:'smooth' })}>Men</button>
          <button className="nav-link" onClick={() => document.getElementById('women')?.scrollIntoView({ behavior:'smooth' })}>Women</button>
          <button className="nav-link" onClick={() => window.location.href='/orders'}>Orders</button>
        </div>
        <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <input className="search-input" placeholder="Search pieces..." value={search} onChange={e => setSearch(e.target.value)} />
            <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.4)',pointerEvents:'none'}}>⌕</span>
          </div>
           {user ? (
            <>
              <span style={{color:'rgba(245,240,235,0.6)',fontSize:'12px',letterSpacing:'1px'}}>
                Hi, {user.name.split(' ')[0]}
              </span>
              {user.role === 'admin' && (
                <button className="nav-btn" onClick={() => window.location.href='/admin'}>Admin</button>
              )}
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="nav-btn" onClick={() => window.location.href='/login'}>Account</button>
          )}
          <button className="nav-btn" onClick={() => window.location.href='/cart'}>Cart</button>
          
        </div>
      </nav>

      {/* SEARCH RESULTS */}
      {isSearching ? (
        <section className="search-section">
          <div className="section-header">
            <div>
              <div className="section-label">Search Results</div>
              <h2 className="section-title">Results for <em>"{search}"</em></h2>
            </div>
            <button onClick={() => setSearch('')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,letterSpacing:2,textTransform:'uppercase',color:'#888',fontFamily:'Jost,sans-serif'}}>Clear ✕</button>
          </div>
          <div className="products-grid">
            {searchResults.length === 0
              ? <div className="empty-state"><div className="empty-text">No pieces found for "{search}"</div></div>
              : searchResults.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />)
            }
          </div>
        </section>
      ) : (
        <>
          {/* HERO */}
          <section className="hero">
            <div className="hero-bg" /><div className="hero-grain" /><div className="hero-accent-line" />
            <div className="hero-content">
              <div className="hero-eyebrow">Est. 2026 — Curated Thrift</div>
              <h1 className="hero-title">Wear the<br /><>Story</></h1>
              <p className="hero-subtitle">Curated thrift finds delivered to your door</p>
              <button className="hero-cta" onClick={() => document.getElementById('men')?.scrollIntoView({ behavior:'smooth' })}>
                <span>View All Products</span>
              </button>
            </div>
            <div className="hero-scroll"><div className="scroll-line" />Scroll</div>
          </section>

          {/* MARQUEE */}
          <div className="marquee-section">
            <div className="marquee-track">
              {marqueeDouble.map((item, i) => (
                <div key={i} className="marquee-item">{item}<div className="marquee-dot" /></div>
              ))}
            </div>
          </div>

          {/* MEN'S SECTION */}
          <section className="shop-section" id="men" style={{background:'#f5f0eb'}}>
            <div className="section-header">
              <div>
                <div className="section-label">For Him</div>
                <h2 className="section-title">The Men's<br /><em>Collection</em></h2>
              </div>
            </div>
            <div className="tabs">
              {CATEGORIES.map(tab => (
                <button key={tab} className={`tab-btn ${menTab===tab ? 'tab-active-light' : ''}`} onClick={() => setMenTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="products-grid">
              {loading
                ? <div className="loading-wrap"><div className="loading-spinner" /><div className="loading-text">Loading</div></div>
                : menProducts.length === 0
                  ? <div className="empty-state"><div className="empty-text">New pieces arriving soon —</div></div>
                  : menProducts.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />)
              }
            </div>
          </section>

          {/* WOMEN'S SECTION */}
          <section className="shop-section" id="women" style={{background:'#0a0a0a'}}>
            <div className="section-header">
              <div>
                <div className="section-label" style={{color:'rgba(255,255,255,0.3)'}}>For Her</div>
                <h2 className="section-title-white">The Women's<br /><em>Collection</em></h2>
              </div>
            </div>
            <div className="tabs tabs-dark">
              {CATEGORIES.map(tab => (
                <button key={tab} className={`tab-btn ${womenTab===tab ? 'tab-active-dark' : ''}`} style={{color: womenTab===tab ? '#f5f0eb' : '#888'}} onClick={() => setWomenTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="products-grid">
              {loading
                ? <div className="loading-wrap"><div className="loading-spinner-white" /><div className="loading-text">Loading</div></div>
                : womenProducts.length === 0
                  ? <div className="empty-state"><div className="empty-text" style={{color:'rgba(255,255,255,0.3)'}}>New pieces arriving soon —</div></div>
                  : womenProducts.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />)
              }
            </div>
          </section>

          {/* FEATURES */}
          <div className="feature-strip">
            {[
              {icon:'♻️',title:'Sustainable Fashion',desc:'Every purchase gives clothing a second life'},
              {icon:'✦',title:'Handpicked Quality',desc:'Every piece carefully curated and inspected'},
              {icon:'📦',title:'Free Shipping',desc:'On all orders above Rs.999 across India'}
            ].map((f,i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <footer className="footer">
            <div className="footer-brand">E—Comma</div>
            <div className="footer-copy">2024 E-Comma. All rights reserved.</div>
          </footer>
        </>
      )}

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}