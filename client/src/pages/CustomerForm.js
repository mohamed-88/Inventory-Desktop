import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';
import './CustomerForm.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { Phone } from 'lucide-react';
import { InputGroup, Form } from 'react-bootstrap';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });
const theme = createTheme({ direction: 'rtl' });

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(!isNew); // چاڤەرێبوون بتنێ د حالەتێ دەستکاریێ دا

  // --- useEffect یێ نوو و راستڤەکری ---
  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      // داخوازکرنا داتایێن بتنێ ڤی موشتەری
      api.get(`/customers/${id}`)
        .then(res => {
          if (res.data) {
            // پاککرنا ژمارا تلەفونێ بۆ نیشاندانێ
            const phoneToDisplay = res.data.phone ? res.data.phone.replace('+964', '') : '';
            setForm({ ...res.data, phone: phoneToDisplay });
          }
        })
        .catch(err => {
          console.error("Failed to fetch customer", err);
          alert("کێشە د وەرگرتنا داتایێن بکڕی دا چێبوو");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formToSend = {
        name: form.name,
        email: form.email,
        address: form.address,
        // پاککرنا ژمارا تلەفونێ و زێدەکرنا کۆدێ وەڵاتی
        phone: `+964${form.phone.trim().replace(/^0+/, '')}`,
      };

      if (isNew) {
        await api.post('/customers', formToSend);
        alert('بکڕ ب سەرکەفتی هاتە زێدەکرن');
      } else {
        // د حالەتێ دەستکاریێ دا، endpointێ درست بکاربینە
        await api.put(`/customers/${id}`, formToSend);
        alert('دەستکاری ب سەرکەفتی هاتە کرن');
      }
      navigate('/'); // یان بزڤرە لاپەرێ لیستی
    } catch (err) {
      alert('شاشیەک د تومارکرنا کریاری دا دروست بو');
      console.error(err);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box className="form-container">
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, fontWeight: 'bold', margin: '15px' }}
      >
        زڤرین
      </Button>

      <form onSubmit={handleSubmit} className="customer-form">
        <Typography style={{ textAlign: 'center' }} variant="h4" gutterBottom>
          {isNew ? 'زێدەکرنا بکری' : 'دەستکاری کرنا بکری'}
        </Typography>

        <Box className="row" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <TextField
                name="name"
                label="ناف"
                value={form.name}
                onChange={handleChange}
                required
                sx={{ width: '300px' }}
              />
            </ThemeProvider>
          </CacheProvider>

          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <TextField
                name="email"
                label="ئیمەیڵ"
                value={form.email}
                onChange={handleChange}
                sx={{ width: '300px' }}
              />
            </ThemeProvider>
          </CacheProvider>
 
          <InputGroup dir="rtl" style={{ width: '300px' }}>
            <Form.Control
              type="tel"
              placeholder="750xxxxxxx"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ textAlign: 'left', fontSize: '16px' }}
            />
            <InputGroup.Text style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              964+ <Phone size={18} style={{ opacity: 0.7 }} />
            </InputGroup.Text>
          </InputGroup>
        </Box>

        <Box className="row" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <TextField
                fullWidth
                name="address"
                label="ناڤ و نیشان"
                value={form.address}
                onChange={handleChange}
                sx={{ width: '300px' }}
              />
            </ThemeProvider>
          </CacheProvider>
        </Box>

        <Box className="button-row" sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            💾 تومارکرن
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CustomerForm;
