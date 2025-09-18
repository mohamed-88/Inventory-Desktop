import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { Button, Box, TextField, Typography, CircularProgress } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

// فەنکشنەکا هاریکار بۆ خواندنا پارامەتران ژ لینکێ
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ItemForm = () => {
  const { itemId } = useParams(); // itemId ژ لینکێ دهێت (بۆ دەستکاریێ)
  const navigate = useNavigate();
  const query = useQuery();
  
  // customerId بتنێ ژ query string دهێت (بتنێ د حالەتێ زێدەکرنێ دا)
  const customerIdForNew = query.get('customerId'); 
  
  const isNew = !itemId;

  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    customer_id: null // دێ پاشی هێتە دانان
  });
  const [loading, setLoading] = useState(!isNew); // چاڤەرێبوون بتنێ د حالەتێ دەستکاریێ دا

  useEffect(() => {
    // بتنێ ئەگەر د حالەتێ دەستکاریێ دا بین، داتایان بکێشە
    if (!isNew) {
      setLoading(true);
      api.get(`/items/${itemId}`)
        .then(res => {
          if (res.data) {
            setForm(res.data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch item:", err);
          alert("کێشە د وەرگرتنا داتایێن بابەتی دا چێبوو.");
        })
        .finally(() => setLoading(false));
    }
  }, [itemId, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = name === 'quantity' || name === 'price';
    setForm(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // دیارکرنا customerId یێ درست
    const finalCustomerId = isNew ? customerIdForNew : form.customer_id;
    if (!finalCustomerId) {
      return alert("کێشە: ژمارا بکڕی نەهاتە دیتن! تکایە ب زڤرە و دووبارە هەول بدە.");
    }

    try {
      const itemData = { ...form, customer_id: finalCustomerId };

      if (isNew) {
        await api.post('/items', itemData);
        alert('بابەت ب سەرکەفتی هاتە زێدەکرن');
      } else {
        await api.put(`/items/${itemId}`, itemData);
        alert('دەستکاری ب سەرکەفتی هاتە کرن');
      }
      navigate(`/customer/${finalCustomerId}`);
    } catch (err) {
      console.error('❌ Error saving item:', err.response?.data || err.message);
      alert('کێشە د تومارکرنا بابەتی دا: ' + (err.response?.data?.error || err.message));
    }
  };

  // دیارکرنا customerId بۆ دوگمەیا "زڤرین"
  const backCustomerId = isNew ? customerIdForNew : form.customer_id;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {/* دوگمەیا زڤرینێ بتنێ دێ هێتە نیشاندان ئەگەر customerId هەبیت */}
      {backCustomerId && (
        <Button onClick={() => navigate(`/customer/${backCustomerId}`)} variant="contained" sx={{ position: 'absolute', top: 20, left: 20 }}>
          <KeyboardBackspaceIcon /> زڤرین
        </Button>
      )}
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px', direction: 'rtl' }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          {isNew ? 'زێدەکرنا کەل و پەلا ➕' : 'دەستکاری کرنا کەل و پەلا ✏️'}
        </Typography>
        
        <TextField fullWidth name="name" label="ناف" value={form.name} onChange={handleChange} required sx={{ mb: 2 }} />
        <TextField fullWidth name="description" label="وەسف" value={form.description || ''} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth name="quantity" label="ژمارە" type="number" value={form.quantity} onChange={handleChange} required sx={{ mb: 2 }} InputProps={{ inputProps: { min: 1 } }} />
        <TextField fullWidth name="price" label="بهایێ ئێکێ" type="number" value={form.price} onChange={handleChange} required sx={{ mb: 2 }} InputProps={{ inputProps: { min: 0, step: "0.01" } }} />
        
        <Button type="submit" variant="contained" fullWidth>
          تومارکرن 💾
        </Button>
      </form>
    </Box>
  );
};

export default ItemForm;
