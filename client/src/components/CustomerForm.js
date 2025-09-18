import React, { useState } from 'react';
import api from '../api';

const CustomerForm = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert('Name is required!');
    try {
      await api.post('/customers', form);
      alert('Customer saved!');
      setForm({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      console.error(err);
      alert('Error saving customer');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Customer</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
      <button type="submit">Save Customer</button>
    </form>
  );
};

export default CustomerForm;
