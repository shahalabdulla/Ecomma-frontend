import React from 'react'

function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      <img
        src={product.image || 'https://via.placeholder.com/250'}
        alt={product.name}
        style={styles.image}
      />
      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.category}>📁 {product.category}</p>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.bottom}>
          <span style={styles.price}>₹{product.price}</span>
          <span style={styles.stock}>Stock: {product.stock}</span>
        </div>
        <button style={styles.button}>🛒 Add to Cart</button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    backgroundColor: 'white'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  info: {
    padding: '20px 20px 22px'
  },
  name: {
    fontSize: '18px',
    marginBottom: '5px'
  },
  category: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '8px'
  },
  description: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px'
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e44d26'
  },
  stock: {
    fontSize: '14px',
    color: '#888'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
}

export default ProductCard