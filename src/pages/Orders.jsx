import React, { useState, useEffect } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; font-family: 'Jost', sans-serif; }
  .orders-page { min-height: 100vh; background: #0a0a0a; }
  .orders-navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px 60px; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .orders-brand {
    font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700;
    color: #f5f0eb; letter-spacing: 4px; text-transform: uppercase;
    cursor: pointer; background: none; border: none;
  }
  .nav-link-dark {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.4);
    background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif; transition: color 0.2s;
  }
  .nav-link-dark:hover { color: #f5f0eb; }
  .orders-container { max-width: 900px; margin: 0 auto; padding: 80px 60px; }
  .orders-title {
    font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 700;
    color: #f5f0eb; line-height: 1.0; margin-bottom: 8px;
  }
  .orders-title em { font-style: italic; color: rgba(255,255,255,0.35); }
  .orders-subtitle { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 60px; }
  .order-card {
    border: 1px solid rgba(255,255,255,0.07); margin-bottom: 24px;
    transition: border-color 0.3s;
  }
  .order-card:hover { border-color: rgba(255,255,255,0.15); }
  .order-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
  }
  .order-header-left { display: flex; flex-direction: column; gap: 6px; }
  .order-id { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .order-date { font-size: 13px; color: rgba(255,255,255,0.6); letter-spacing: 0.5px; }
  .order-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .order-total { font-family: 'Playfair Display', serif; font-size: 20px; color: #f5f0eb; }
  .order-status {
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase; padding: 4px 12px; border-radius: 0;
  }
  .status-pending { background: rgba(243,156,18,0.15); color: #f39c12; border: 1px solid rgba(243,156,18,0.2); }
  .status-processing { background: rgba(52,152,219,0.15); color: #3498db; border: 1px solid rgba(52,152,219,0.2); }
  .status-shipped { background: rgba(155,89,182,0.15); color: #9b59b6; border: 1px solid rgba(155,89,182,0.2); }
  .status-delivered { background: rgba(39,174,96,0.15); color: #27ae60; border: 1px solid rgba(39,174,96,0.2); }
  .status-cancelled { background: rgba(192,57,43,0.15); color: #c0392b; border: 1px solid rgba(192,57,43,0.2); }
  .order-body { padding: 28px; }
  .order-item { display: flex; gap: 20px; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .order-item:last-child { border-bottom: none; }
  .item-img {
    width: 70px; height: 85px; background: #1a1a1a;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
    flex-shrink: 0; overflow: hidden;
  }
  .item-img img { width: 100%; height: 100%; object-fit: cover; }
  .item-info { flex: 1; }
  .item-name-order { font-family: 'Playfair Display', serif; font-size: 16px; color: #f5f0eb; margin-bottom: 6px; }
  .item-meta { font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 1px; }
  .item-price-order { font-size: 14px; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
  .order-footer {
    padding: 20px 28px; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; justify-content: space-between; align-items: center;
  }
  .shipping-info { font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 1px; line-height: 1.6; }
  .payment-badge {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    padding: 4px 10px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3);
  }
  .expand-icon { font-size: 18px; color: rgba(255,255,255,0.3); transition: transform 0.3s; }
  .expand-icon.open { transform: rotate(180deg); }
  .empty-orders { text-align: center; padding: 100px 0; }
  .empty-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #f5f0eb; margin-bottom: 12px; }
  .empty-sub { font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 2px; margin-bottom: 40px; }
  .shop-btn {
    background: #f5f0eb; color: #0a0a0a; border: none; padding: 16px 48px;
    font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .shop-btn:hover { background: #e8e0d5; }
  .loading-wrap { display: flex; align-items: center; justify-content: center; min-height: 80vh; flex-direction: column; gap: 20px; }
  .loading-spinner { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.1); border-top-color: #f5f0eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
`

const statusClass = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { window.location.href = '/login'; return }
    axios.get('http://localhost:5000/api/orders/myorders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setOrders(res.data.orders); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <div className="loading-text">Loading Orders</div>
      </div>
    </>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="orders-page">

        {/* NAVBAR */}
        <div className="orders-navbar">
          <button className="nav-link-dark" onClick={() => window.location.href = '/'}>← Shop</button>
          <button className="orders-brand" onClick={() => window.location.href = '/'}>E—Comma</button>
          <button className="nav-link-dark" onClick={() => window.location.href = '/cart'}>Cart</button>
        </div>

        <div className="orders-container">
          <h1 className="orders-title">My<br /><em>Orders</em></h1>
          <div className="orders-subtitle">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'} placed</div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-title">No orders yet</div>
              <div className="empty-sub">Your order history will appear here</div>
              <button className="shop-btn" onClick={() => window.location.href = '/'}>Start Shopping</button>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">

                {/* ORDER HEADER */}
                <div className="order-header" onClick={() => toggleExpand(order._id)}>
                  <div className="order-header-left">
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="order-header-right">
                    <div className="order-total">Rs.{order.totalPrice}</div>
                    <div className={`order-status ${statusClass[order.orderStatus]}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                  <div className={`expand-icon ${expanded === order._id ? 'open' : ''}`}>⌄</div>
                </div>

                {/* ORDER BODY - expandable */}
                {expanded === order._id && (
                  <>
                    <div className="order-body">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          <div className="item-img">
                            {item.product?.image
                              ? <img src={item.product.image} alt={item.product.name} />
                              : '👕'
                            }
                          </div>
                          <div className="item-info">
                            <div className="item-name-order">{item.product?.name || 'Product'}</div>
                            <div className="item-meta">Qty: {item.quantity} · {item.product?.category}</div>
                          </div>
                          <div className="item-price-order">Rs.{item.price * item.quantity}</div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="shipping-info">
                        📦 {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                        {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                      </div>
                      <div className="payment-badge">{order.paymentStatus}</div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
