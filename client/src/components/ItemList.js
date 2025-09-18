import React, { useEffect, useState } from 'react';
import api from '../api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async () => {
    const res = await api.get(`/items?search=${search}&page=${page}&limit=5`);
    setItems(res.data.items);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchItems();
  }, [page, search]);

  return (
    <div>
      <h2>Item List</h2>

      <input
        placeholder="Search items..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />

      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong> – {item.quantity} × ${item.unitPrice} = ${item.totalPrice.toFixed(2)}<br />
            {item.imageUrl && (
              <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} width="100" />
            )}<br />
            <small>Customer: {item.customerId?.name}</small>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ItemList;
