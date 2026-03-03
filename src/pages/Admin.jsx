import React, { useState, useEffect } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; font-family: 'Jost', sans-serif; }
  .admin-page { min-height: 100vh; background: #0a0a0a; display: flex; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; background: #111; border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column; padding: 32px 0; position: fixed;
    top: 0; left: 0; height: 100vh;
  }
  .sidebar-brand {
    font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700;
    color: #f5f0eb; letter-spacing: 4px; text-transform: uppercase;
    padding: 0 28px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);
    cursor: pointer; background: none; border-bottom: 1px solid rgba(255,255,255,0.06);
    text-align: left;
  }
  .sidebar-label {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(255,255,255,0.2); padding: 24px 28px 12px;
  }
  .sidebar-btn {
    display: flex; align-items: center; gap: 12px; padding: 14px 28px;
    background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif;
    font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.4); transition: all 0.2s; text-align: left; width: 100%;
  }
  .sidebar-btn:hover { color: #f5f0eb; background: rgba(255,255,255,0.03); }
  .sidebar-btn.active { color: #f5f0eb; background: rgba(255,255,255,0.06); border-left: 2px solid #f5f0eb; }
  .sidebar-icon { font-size: 16px; opacity: 0.7; }
  .sidebar-footer { margin-top: auto; padding: 28px; border-top: 1px solid rgba(255,255,255,0.06); }
  .logout-btn {
    width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4); padding: 10px; font-family: 'Jost', sans-serif;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .logout-btn:hover { border-color: #f5f0eb; color: #f5f0eb; }

  /* MAIN CONTENT */
  .admin-main { margin-left: 240px; flex: 1; padding: 60px; }
  .page-title {
    font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700;
    color: #f5f0eb; line-height: 1.0; margin-bottom: 8px;
  }
  .page-title em { font-style: italic; color: rgba(255,255,255,0.3); }
  .page-subtitle { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 48px; }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 48px; }
  .stat-card { background: #111; border: 1px solid rgba(255,255,255,0.06); padding: 24px; }
  .stat-label { font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 12px; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 36px; color: #f5f0eb; font-weight: 700; }

  /* TABLES */
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .section-title-sm { font-family: 'Playfair Display', serif; font-size: 22px; color: #f5f0eb; }
  .table-wrap { background: #111; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; margin-bottom: 48px; }
  .table { width: 100%; border-collapse: collapse; }
  .table th {
    padding: 14px 20px; text-align: left; font-size: 9px; letter-spacing: 3px;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
    border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 400;
  }
  .table td { padding: 16px 20px; font-size: 13px; color: rgba(255,255,255,0.6); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: rgba(255,255,255,0.02); }
  .product-name-cell { color: #f5f0eb; font-family: 'Playfair Display', serif; font-size: 15px; }
  .delete-btn {
    background: transparent; border: 1px solid rgba(192,57,43,0.3); color: #c0392b;
    padding: 6px 14px; font-family: 'Jost', sans-serif; font-size: 10px;
    letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .delete-btn:hover { background: rgba(192,57,43,0.1); }

  /* STATUS SELECT */
  .status-select {
    background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); color: #f5f0eb;
    padding: 6px 12px; font-family: 'Jost', sans-serif; font-size: 11px;
    letter-spacing: 1px; outline: none; cursor: pointer;
  }
  .status-badge {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px;
  }
  .status-pending { background: rgba(243,156,18,0.15); color: #f39c12; }
  .status-processing { background: rgba(52,152,219,0.15); color: #3498db; }
  .status-shipped { background: rgba(155,89,182,0.15); color: #9b59b6; }
  .status-delivered { background: rgba(39,174,96,0.15); color: #27ae60; }
  .status-cancelled { background: rgba(192,57,43,0.15); color: #c0392b; }

  /* ADD PRODUCT FORM */
  .add-form { background: #111; border: 1px solid rgba(255,255,255,0.06); padding: 40px; margin-bottom: 48px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .form-input {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: #f5f0eb; padding: 12px 16px; font-family: 'Jost', sans-serif; font-size: 13px;
    outline: none; transition: all 0.3s;
  }
  .form-input:focus { border-color: rgba(255,255,255,0.25); }
  .form-input::placeholder { color: rgba(255,255,255,0.2); }
  .form-textarea {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: #f5f0eb; padding: 12px 16px; font-family: 'Jost', sans-serif; font-size: 13px;
    outline: none; transition: all 0.3s; resize: vertical; min-height: 80px; grid-column: 1/-1;
  }
  .form-textarea:focus { border-color: rgba(255,255,255,0.25); }
  .add-btn {
    background: #f5f0eb; color: #0a0a0a; border: none; padding: 14px 40px;
    font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  }
  .add-btn:hover { background: #e8e0d5; }
  .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ORDER EXPAND */
  .order-address { font-size: 11px; color: rgba(255,255,255,0.3); line-height: 1.8; }

  /* LOADING */
  .loading-wrap { display: flex; align-items: center; justify-content: center; min-height: 80vh; flex-direction: column; gap: 20px; }
  .loading-spinner { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.1); border-top-color: #f5f0eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.3); }

  /* TOAST */
  .toast { position: fixed; bottom: 40px; right: 40px; background: #f5f0eb; color: #0a0a0a; padding: 14px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; z-index: 1000; transform: translateY(80px); opacity: 0; transition: all 0.4s ease; border-left: 2px solid #0a0a0a; }
  .toast.show { transform: translateY(0); opacity: 1; }

  /* ACCESS DENIED */
  .access-denied { display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; gap: 16px; }
  .access-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #f5f0eb; }
  .access-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
`

const CATEGORIES = ['men-tshirts','men-shirts','men-pants','men-jackets','women-tshirts','women-shirts','women-pants','women-jackets']

export default function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'men-tshirts', stock: '', image: ''
  })
  const [adding, setAdding] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!token || user?.role !== 'admin') return
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [pRes, oRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      ])
      setProducts(pRes.data.products)
      setOrders(oRes.data.orders)
      setLoading(false)
    } catch { setLoading(false) }
  }

  const showToast = (msg) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      showToast('Please fill name, price and stock!'); return
    }
    setAdding(true)
    try {
      // Use FormData to send images!
      const formData = new FormData()
      formData.append('name', newProduct.name)
      formData.append('description', newProduct.description)
      formData.append('price', newProduct.price)
      formData.append('category', newProduct.category)
      formData.append('stock', newProduct.stock)

      // Add each selected image
      selectedFiles.forEach(file => {
        formData.append('images', file)
      })

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      showToast('Product added! 🎉')
      setNewProduct({ name: '', description: '', price: '', category: 'men-tshirts', stock: '', image: '' })
      setSelectedFiles([])
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add product!')
    }
    setAdding(false)
  }
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      showToast('Product deleted!')
      fetchAll()
    } catch { showToast('Could not delete!') }
  }

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showToast('Order status updated!')
      fetchAll()
    } catch { showToast('Could not update status!') }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)

  if (!token || user?.role !== 'admin') return (
    <>
      <style>{styles}</style>
      <div className="access-denied">
        <div className="access-title">Access Denied</div>
        <div className="access-sub">Admin only area</div>
        <button onClick={() => window.location.href = '/'} style={{marginTop:20,background:'#f5f0eb',color:'#0a0a0a',border:'none',padding:'12px 32px',fontFamily:'Jost,sans-serif',fontSize:11,letterSpacing:3,textTransform:'uppercase',cursor:'pointer'}}>Go Home</button>
      </div>
    </>
  )

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-wrap"><div className="loading-spinner" /><div className="loading-text">Loading</div></div>
    </>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="admin-page">

        {/* SIDEBAR */}
        <div className="sidebar">
          <button className="sidebar-brand" onClick={() => window.location.href = '/'}>E—Comma</button>
          <div className="sidebar-label">Main Menu</div>
          {[
            { key: 'dashboard', icon: '◈', label: 'Dashboard' },
            { key: 'products', icon: '◫', label: 'Products' },
            { key: 'add-product', icon: '＋', label: 'Add Product' },
            { key: 'orders', icon: '◱', label: 'Orders' },
            { key: 'customers', icon: '◉', label: 'Customers' },
          ].map(item => (
            <button key={item.key} className={`sidebar-btn ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/' }}>Logout</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="admin-main">

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <>
              <h1 className="page-title">Welcome back,<br /><em>{user.name}</em></h1>
              <div className="page-subtitle">Admin Dashboard</div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Products</div>
                  <div className="stat-value">{products.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{orders.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">₹{totalRevenue}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending Orders</div>
                  <div className="stat-value">{orders.filter(o => o.orderStatus === 'pending').length}</div>
                </div>
              </div>

              {/* RECENT ORDERS */}
              <div className="section-header">
                <div className="section-title-sm">Recent Orders</div>
                <button onClick={() => setTab('orders')} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',fontFamily:'Jost,sans-serif',fontSize:11,letterSpacing:2,textTransform:'uppercase',cursor:'pointer'}}>View All →</button>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0,5).map(order => (
                      <tr key={order._id}>
                        <td style={{fontFamily:'monospace',fontSize:11}}>#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="product-name-cell">{order.user?.name || 'Customer'}</td>
                        <td>₹{order.totalPrice}</td>
                        <td><span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span></td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <>
              <h1 className="page-title">All<br /><em>Products</em></h1>
              <div className="page-subtitle">{products.length} products in store</div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td className="product-name-cell">{p.name}</td>
                        <td>{p.category}</td>
                        <td>₹{p.price}</td>
                        <td style={{color: p.stock < 5 ? '#c0392b' : 'inherit'}}>{p.stock}</td>
                        <td><button className="delete-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ADD PRODUCT */}
          {tab === 'add-product' && (
            <>
              <h1 className="page-title">Add New<br /><em>Product</em></h1>
              <div className="page-subtitle">Add a new piece to the store</div>
              <div className="add-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input className="form-input" placeholder="Nike Air Max" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input className="form-input" type="number" placeholder="999" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" placeholder="10" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  </div>
                  <div className="form-group" style={{gridColumn:'1/-1'}}>
                    <label className="form-label">Product Images (up to 5 photos)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => setSelectedFiles(Array.from(e.target.files))}
                      style={{display:'none'}}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" style={{
                      display:'block', padding:'24px', border:'1px dashed rgba(255,255,255,0.15)',
                      textAlign:'center', cursor:'pointer', color:'rgba(255,255,255,0.3)',
                      fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase',
                      transition:'all 0.3s'
                    }}>
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} selected ✓`
                        : '+ Click to upload photos'
                      }
                    </label>
                    {selectedFiles.length > 0 && (
                      <div style={{display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap'}}>
                        {selectedFiles.map((file, i) => (
                          <img key={i} src={URL.createObjectURL(file)} alt=""
                            style={{width:'70px', height:'85px', objectFit:'cover', opacity:0.7}} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group" style={{gridColumn:'1/-1'}}>
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" placeholder="Describe the product..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  </div>
                </div>
                <button className="add-btn" onClick={handleAddProduct} disabled={adding}>
                  {adding ? 'Adding...' : '+ Add Product'}
                </button>
              </div>
            </>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <>
              <h1 className="page-title">All<br /><em>Orders</em></h1>
              <div className="page-subtitle">{orders.length} total orders</div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Total</th>
                      <th>Address</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <>
                        <tr key={order._id} style={{cursor:'pointer'}} onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                          <td style={{fontFamily:'monospace',fontSize:11}}>#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="product-name-cell">{order.user?.name || 'Customer'}</td>
                          <td>{order.user?.email}</td>
                          <td>₹{order.totalPrice}</td>
                          <td className="order-address">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <select
                              className="status-select"
                              value={order.orderStatus}
                              onChange={e => { e.stopPropagation(); handleUpdateStatus(order._id, e.target.value) }}
                              onClick={e => e.stopPropagation()}
                            >
                              {['pending','processing','shipped','delivered','cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan={7} style={{background:'rgba(255,255,255,0.02)',padding:'20px 28px'}}>
                              <div style={{marginBottom:12,fontSize:11,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Order Items</div>
                              {order.items.map((item, i) => (
                                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.5)',fontSize:13}}>
                                  <span style={{color:'#f5f0eb'}}>{item.product?.name}</span>
                                  <span>Qty: {item.quantity}</span>
                                  <span>₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                              <div style={{marginTop:16,fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:1,lineHeight:1.8}}>
                                📦 {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* CUSTOMERS */}
          {tab === 'customers' && (
            <>
              <h1 className="page-title">All<br /><em>Customers</em></h1>
              <div className="page-subtitle">Registered users</div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .reduce((unique, order) => {
                        if (order.user && !unique.find(u => u._id === order.user._id)) {
                          unique.push(order.user)
                        }
                        return unique
                      }, [])
                      .map(u => (
                        <tr key={u._id}>
                          <td className="product-name-cell">{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.mobile || '—'}</td>
                          <td><span className={`status-badge ${u.role === 'admin' ? 'status-shipped' : 'status-pending'}`}>{u.role}</span></td>
                          <td>{formatDate(u.createdAt || Date.now())}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}