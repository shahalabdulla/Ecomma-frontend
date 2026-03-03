import React, { useState, useEffect } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f5f0eb; font-family: 'Jost', sans-serif; }
  .cart-page { min-height: 100vh; background: #f5f0eb; }
  .cart-navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px 60px; border-bottom: 1px solid rgba(0,0,0,0.08); background: #f5f0eb;
  }
  .cart-brand {
    font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700;
    color: #0a0a0a; letter-spacing: 4px; text-transform: uppercase; cursor: pointer;
    background: none; border: none;
  }
  .back-btn {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888;
    background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s;
  }
  .back-btn:hover { color: #0a0a0a; }
  .cart-container { display: flex; gap: 0; max-width: 1200px; margin: 0 auto; padding: 60px; min-height: 80vh; }
  .cart-items { flex: 1.5; padding-right: 80px; border-right: 1px solid rgba(0,0,0,0.08); }
  .cart-summary { flex: 1; padding-left: 60px; }
  .cart-title {
    font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700;
    color: #0a0a0a; line-height: 1.1; margin-bottom: 8px;
  }
  .cart-title em { font-style: italic; color: #888; }
  .cart-count { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 50px; }
  .cart-item {
    display: flex; gap: 24px; padding: 28px 0;
    border-bottom: 1px solid rgba(0,0,0,0.06); align-items: center;
  }
  .item-image {
    width: 90px; height: 110px; object-fit: cover; background: #e8e0d5;
    display: flex; align-items: center; justify-content: center; font-size: 30px;
    flex-shrink: 0;
  }
  .item-image img { width: 100%; height: 100%; object-fit: cover; }
  .item-details { flex: 1; }
  .item-category { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 6px; }
  .item-name { font-family: 'Playfair Display', serif; font-size: 18px; color: #0a0a0a; margin-bottom: 12px; }
  .item-price { font-size: 14px; font-weight: 500; color: #0a0a0a; letter-spacing: 1px; }
  .item-controls { display: flex; align-items: center; gap: 20px; }
  .qty-controls { display: flex; align-items: center; gap: 0; border: 1px solid rgba(0,0,0,0.15); }
  .qty-btn {
    width: 36px; height: 36px; background: transparent; border: none;
    cursor: pointer; font-size: 16px; color: #0a0a0a; transition: background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .qty-btn:hover { background: rgba(0,0,0,0.05); }
  .qty-num { width: 40px; text-align: center; font-size: 13px; letter-spacing: 1px; font-family: 'Jost', sans-serif; }
  .remove-btn {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #bbb;
    background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s;
  }
  .remove-btn:hover { color: #c0392b; }
  .summary-title {
    font-family: 'Playfair Display', serif; font-size: 24px; color: #0a0a0a;
    margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.08);
  }
  .summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
  .summary-label { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #888; }
  .summary-value { font-size: 13px; font-weight: 500; color: #0a0a0a; }
  .summary-divider { height: 1px; background: rgba(0,0,0,0.08); margin: 24px 0; }
  .summary-total { display: flex; justify-content: space-between; margin-bottom: 32px; }
  .total-label { font-family: 'Playfair Display', serif; font-size: 18px; color: #0a0a0a; }
  .total-value { font-family: 'Playfair Display', serif; font-size: 22px; color: #0a0a0a; font-weight: 700; }
  .checkout-btn {
    width: 100%; background: #0a0a0a; color: #f5f0eb; border: none; padding: 18px;
    font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer; transition: all 0.3s; margin-bottom: 16px;
  }
  .checkout-btn:hover { background: #333; }
  .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .continue-btn {
    width: 100%; background: transparent; color: #0a0a0a;
    border: 1px solid rgba(0,0,0,0.2); padding: 16px;
    font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .continue-btn:hover { border-color: #0a0a0a; }
  .empty-cart { text-align: center; padding: 80px 0; }
  .empty-cart-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0a0a0a; margin-bottom: 12px; }
  .empty-cart-sub { font-size: 13px; color: #888; letter-spacing: 1px; margin-bottom: 40px; }
  .shop-btn {
    background: #0a0a0a; color: #f5f0eb; border: none; padding: 16px 48px;
    font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .shop-btn:hover { background: #333; }
  .loading-wrap { display: flex; align-items: center; justify-content: center; min-height: 50vh; flex-direction: column; gap: 20px; }
  .loading-spinner { width: 36px; height: 36px; border: 1px solid rgba(0,0,0,0.1); border-top-color: #0a0a0a; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #888; }
  .toast { position: fixed; bottom: 40px; right: 40px; background: #0a0a0a; color: #f5f0eb; padding: 14px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; z-index: 1000; transform: translateY(80px); opacity: 0; transition: all 0.4s ease; border-left: 2px solid rgba(255,255,255,0.3); }
  .toast.show { transform: translateY(0); opacity: 1; }
  .address-form { margin-top: 32px; }
  .address-title { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 20px; }
  .address-input {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid rgba(0,0,0,0.15); color: #0a0a0a;
    padding: 10px 0; font-family: 'Jost', sans-serif; font-size: 13px;
    outline: none; transition: all 0.3s; margin-bottom: 16px;
  }
  .address-input::placeholder { color: #bbb; }
  .address-input:focus { border-bottom-color: #0a0a0a; }
`

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: '', country: 'India'
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { window.location.href = '/login'; return }
    fetchCart()
  }, [])

  const fetchCart = () => {
    axios.get('https://ecomma-backend.onrender.com/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setCart(res.data.cart); setLoading(false) })
      .catch(() => { setLoading(false) })
  }

  const showToast = (msg) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const updateQty = (productId, quantity) => {
    if (quantity < 1) { removeItem(productId); return }
    axios.put(`https://ecomma-backend.onrender.com/api/cart/${productId}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => fetchCart()).catch(() => showToast('Could not update quantity'))
  }

  const removeItem = (productId) => {
    axios.delete(`https://ecomma-backend.onrender.com/api/cart/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => { fetchCart(); showToast('Item removed') })
      .catch(() => showToast('Could not remove item'))
  }

  const placeOrder = () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      showToast('Please fill in shipping address!'); return
    }
    setOrdering(true)
    axios.post('https://ecomma-backend.onrender.com/api/orders',
      { shippingAddress: address },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      showToast('Order placed successfully!')
      setTimeout(() => window.location.href = '/orders', 1500)
    }).catch(err => {
      showToast(err.response?.data?.message || 'Could not place order!')
      setOrdering(false)
    })
  }

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <div className="loading-text">Loading Cart</div>
      </div>
    </>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">

        {/* NAVBAR */}
        <div className="cart-navbar">
          <button className="back-btn" onClick={() => window.location.href = '/'}>← Continue Shopping</button>
          <button className="cart-brand" onClick={() => window.location.href = '/'}>E—Comma</button>
          <button className="back-btn" onClick={() => window.location.href = '/orders'}>My Orders</button>
        </div>

        <div className="cart-container">

          {/* LEFT — CART ITEMS */}
          <div className="cart-items">
            <h1 className="cart-title">Your<br /><em>Cart</em></h1>
            <div className="cart-count">
              {cart?.items?.length || 0} {cart?.items?.length === 1 ? 'Item' : 'Items'}
            </div>

            {!cart || cart.items.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-title">Your cart is empty</div>
                <div className="empty-cart-sub">Discover our curated collection</div>
                <button className="shop-btn" onClick={() => window.location.href = '/'}>Shop Now</button>
              </div>
            ) : (
              cart.items.map(item => (
                <div key={item.product._id} className="cart-item">
                  <div className="item-image">
                    {item.product.image
                      ? <img src={item.product.image} alt={item.product.name} />
                      : '👕'
                    }
                  </div>
                  <div className="item-details">
                    <div className="item-category">{item.product.category}</div>
                    <div className="item-name">{item.product.name}</div>
                    <div className="item-price">Rs.{item.product.price}</div>
                  </div>
                  <div className="item-controls">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.product._id, item.quantity - 1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.product._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.product._id)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          {cart && cart.items.length > 0 && (
            <div className="cart-summary">
              <div className="summary-title">Order Summary</div>

              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">Rs.{subtotal}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">{shipping === 0 ? 'Free' : `Rs.${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <div style={{fontSize:'10px',color:'#888',letterSpacing:'1px',marginBottom:'16px'}}>
                  Add Rs.{999 - subtotal} more for free shipping!
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-total">
                <span className="total-label">Total</span>
                <span className="total-value">Rs.{total}</span>
              </div>

              {/* SHIPPING ADDRESS */}
              {showAddress ? (
                <div className="address-form">
                  <div className="address-title">Shipping Address</div>
                  <input className="address-input" placeholder="Street address"
                    value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                  <input className="address-input" placeholder="City"
                    value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  <input className="address-input" placeholder="State"
                    value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                  <input className="address-input" placeholder="Pincode"
                    value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                  <button className="checkout-btn" onClick={placeOrder} disabled={ordering}>
                    {ordering ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              ) : (
                <button className="checkout-btn" onClick={() => setShowAddress(true)}>
                  Proceed to Checkout
                </button>
              )}

              <button className="continue-btn" onClick={() => window.location.href = '/'}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}
