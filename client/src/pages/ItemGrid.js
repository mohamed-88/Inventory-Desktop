import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ItemGrid = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/items?limit=100').then(res => {
      setItems(res.data.items);
    });
  }, []);

  return (
    <div className="grid-container">
      <h1>Inventory Items</h1>
      <div className="item-grid">
        {items.map(item => (
          <Link key={item._id} to={`/item/${item._id}`} className="item-card">
            <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.quantity} × ${item.unitPrice}</p>
            <strong>Total: ${item.totalPrice.toFixed(2)}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;
