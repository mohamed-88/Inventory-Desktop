import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Typography, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';

const CustomerDetail = () => {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [customerRes, itemsRes, paymentsRes] = await Promise.all([
        api.get(`/customers/${id}`),
        api.get(`/items?customerId=${id}`),
        api.get(`/payments?customerId=${id}`)
      ]);

      setCustomer(customerRes.data);
      setItems(itemsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error('شکەستن د ئینانا داتایان دا:', err);
      setError('کێشە د وەرگرتنا داتایان دا چێبوو.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('ئەرێ تەدڤێت بابەتی ژێبەی ؟')) {
      try {
        await api.delete(`/items/${itemId}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete item:", err);
        alert("کێشە د ژێبرنا بابەتی دا چێبوو.");
      }
    }
  };

  const handleRegisterPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      return alert("تکایە ژمارەکا درست داخل بکە.");
    }
    try {
      await api.post('/payments', { amount, customer_id: id });
      setShowPaymentDialog(false);
      setPaymentAmount('');
      fetchData();
    } catch (err) {
      console.error("Error registering payment:", err);
      alert("کێشە د تومارکرنا پارەدانێ دا چێبوو.");
    }
  };

  const totalValue = customer ? items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0) : 0;
  const totalPaid = customer ? payments.reduce((sum, p) => sum + p.amount, 0) : 0;
  const remaining = totalValue - totalPaid;

  const handleSendEmail = () => {
    if (!customer?.email) return alert("ئیمەیلێ کڕیاری بەردەست نینە!");
    let emailBody = `سلاڤ بەرێز ${customer.name},\n\nئەڤە کورتیا پسولا تەیە:\nژمارا پسولێ: ${customer.bill_number}\n\n------------------------------------\nلیستا کەل و پەلان:\n\n`;
    items.forEach((item, index) => {
      emailBody += `${index + 1}. ${item.name}\n   - ژمارە: ${item.quantity}\n   - بهایێ ئێکێ: $${item.price.toFixed(2)}\n   - بهایێ گشتی: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    emailBody += `------------------------------------\nبهایێ گشتی: $${totalValue.toFixed(2)}\nپارێ هاتیە دان: $${totalPaid.toFixed(2)}\nپارێ مای: $${remaining.toFixed(2)}\n\nسوپاس بۆ بازرگانیکرنا دگەل مە!\n`;
    const subject = `پسولا ژمارە ${customer.bill_number}`;
    const mailtoLink = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  const handleSendWhatsApp = () => {
    if (!customer?.phone) return alert("ژمارا تەلەفۆنێ یا کڕیاری بەردەست نینە!");
    const phoneNumber = customer.phone.replace(/\D/g, '');
    let message = `*سلاڤ بەرێز ${customer.name}*\n\nئەڤە کورتیا پسولا تەیە:\n*ژمارا پسولێ:* ${customer.bill_number}\n\n------------------------------------\n*لیستا کەل و پەلان:*\n\n`;
    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n   - ژمارە: ${item.quantity}\n   - بهایێ ئێکێ: $${item.price.toFixed(2)}\n   - *بهایێ گشتی:* $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    message += `------------------------------------\n*بهایێ گشتی:* $${totalValue.toFixed(2)}\n*پارێ هاتیە دان:* $${totalPaid.toFixed(2)}\n*پارێ مای:* $${remaining.toFixed(2)}\n\n_سوپاس بۆ بازرگانیکرنا دگەل مە!_`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message )}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={5}>{error}</Typography>;
  if (!customer) return <Typography align="center" mt={5}>ئەڤ بکڕە نەهاتە دیتن.</Typography>;

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} variant="contained" sx={{ mb: 2 }}>زڤرین</Button>
      <Typography variant="h4" align="center" gutterBottom>{customer.name}</Typography>
      <Typography align="center"><strong>ژمارا پسولێ: {customer.bill_number}</strong></Typography>
      <Typography align="center">📞 {customer.phone || 'نینە'}</Typography>
      <Typography align="center">✉️ {customer.email || 'نینە'}</Typography>
      <Typography align="center">📍 {customer.address || 'نینە'}</Typography>

      <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
        <Grid item><Button component={RouterLink} to={`/customer/${customer.id}/edit`} variant="contained">ئیدیت ✏️</Button></Grid>
        <Grid item><Button component={RouterLink} to={`/customer/${customer.id}/receipt`} variant="contained" color="info">پسولە 🧾</Button></Grid>
        <Grid item>
          {remaining > 0 ? (<Button variant="contained" color="warning" onClick={() => setShowPaymentDialog(true)}>💸 تومارکرنا پارەدانێ</Button>) : (<Chip label="✅ پارە بتەمامی هاتیە دان" color="success" />)}
        </Grid>
        <Grid item><Button onClick={handleSendEmail} variant="contained" color="secondary">هنارتن ب ئیمەیلی 📧</Button></Grid>
        <Grid item><Button onClick={handleSendWhatsApp} variant="contained" style={{ backgroundColor: '#25D366', color: 'white' }}>WhatsApp 💬</Button></Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">📦 کەل و پەل</Typography>
        <Button component={RouterLink} to={`/item/new?customerId=${customer.id}`} variant="contained" sx={{ mt: 2, mb: 2, display: 'block', margin: 'auto' }}>➕ زێدەکرنا کەل و پەلا</Button>
        
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ناف</TableCell>
                <TableCell align="right">ژمارە</TableCell>
                <TableCell align="right">بهایێ ئێکێ</TableCell>
                <TableCell align="right">بهایێ گشتی</TableCell>
                <TableCell align="center">کردار</TableCell>
              </TableRow>
            </TableHead>
            {/* --- گوهورینا سەرەکی ل ڤێرەیە --- */}
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">هیچ بابەتەک نەهاتیە تومارکرن</TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Button component={RouterLink} to={`/item/${item.id}/edit`} size="small" sx={{mr: 1}}>✏️ Edit</Button>
                      <Button onClick={() => handleDeleteItem(item.id)} size="small" color="error">🗑 Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {/* ------------------------------------ */}
          </Table>
        </TableContainer>
      </Box>
      
      <Box sx={{ textAlign: 'left', mt: 2, fontWeight: 'bold' }}>
          <Typography variant="h6">بهایێ گشتی: ${totalValue.toFixed(2)}</Typography>
          <Typography variant="h6" color="green">پارێ هاتیە دان: ${totalPaid.toFixed(2)}</Typography>
          <Typography variant="h6" color="red">پارێ مای: ${remaining.toFixed(2)}</Typography>
      </Box>

      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} dir="rtl">
        <DialogTitle>تومارکرنا پارەدانێ بۆ {customer.name}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="ژمارا پارەی" type="number" fullWidth variant="standard" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>رەتکرن</Button>
          <Button onClick={handleRegisterPayment} variant="contained">تومارکرن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetail;
