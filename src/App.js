import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Login'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import ProductDetail from './pages/ProductDetail'
import Admin from './pages/Admin'
import AllProducts from './pages/AllProducts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/products" element={<AllProducts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App