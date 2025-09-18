// client/src/pages/CustomerReceipt.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../api';
import tablelogo from '../assets/tablelogo.png';
import ahmedtype from '../assets/ahmedtype.png';
import { Container, Typography, Box, Button, Grid, CircularProgress } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './CustomerReceipt.css';

const CustomerReceipt = () => {
  const { id } = useParams();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReceiptData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/customers/${id}/receipt-data`);
      setReceiptData(res.data);
    } catch (err) {
      console.error('شکەستن د ئینانا داتایێن پسولێ دا:', err);
      setError('کێشە د وەرگرتنا داتایێن پسولێ دا چێبوو.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchReceiptData();
    }
  }, [id, fetchReceiptData]);

  const savePdfLocally = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;
    
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`پسولا_${receiptData.customer.name}.pdf`);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Typography color="error" align="center" mt={5}>{error}</Typography>;
  }
  if (!receiptData) {
    return <Typography align="center" mt={5}>داتا نەهاتنە دیتن.</Typography>;
  }

  const { customer, items, payments } = receiptData;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalValue - totalPaid;
  const currentDateTime = new Date();
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, fontFamily: "'Noto Naskh Arabic', sans-serif" }}>
      <div id="pdf-content">
        <Box mb={3}>
          <img src={tablelogo} alt="Logo" style={{ width: 100, margin: 'left' }} />
          <div style={{ textAlign: 'center' }}>
            <img src={ahmedtype} alt="Logo" style={{ width: '50%', marginTop: '-120px' }} />
          </div>
          <Typography variant="h5" fontWeight="bold" mt={1} sx={{ fontSize: '21px', textAlign: 'center', marginTop: '-20px' }}>
            نڤێسینگەها ئەحمد بوو بازرگانیا کەل و پەلێت کارەبێ ب کت و کوم
            <p style={{ fontSize: '20px' }}>
              هەر وەسا ئەم دئامادەینە بوو دروستکرنا هەمی جوری ئاڤاهیا ب دیزاینێت سەردەمانە و مودرن
            </p>
          </Typography>
        </Box>

        <Grid container justifyContent="space-between" sx={{ fontFamily: 'KurdishSorani', fontWeight: 'bold', direction: 'rtl' }}>
          <Grid item>
            <Typography><strong>بەرێز:</strong> {customer.name}</Typography>
            <Typography><strong>ژ. مۆبایل:</strong> {customer.phone}</Typography>
          </Grid>
          <Grid item>
            <Typography><strong>ژمارا پسولێ:</strong> {customer.bill_number}</Typography>
            <Typography><strong>مێژویا:</strong> {formattedDate}</Typography>
            <Typography><strong>کاتژمێر:</strong> {formattedTime}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2} mt={1} justifyContent="center">
          <Typography style={{ textAlign: 'center' }}>
            📞 07503414123 - 📞 07507325775 - 📞 07504810978
          </Typography>
        </Grid>

        <div className="custom-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>بهایێ گشتی</th>
                <th>بهایێ ئێکێ</th>
                <th>ژمارە</th>
                <th>نافێ کەل و پەلی</th>
                <th>ڕیز</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, index) => {
                const item = items[index];
                return (
                  <tr key={index}>
                    <td>{item ? `$${(item.price * item.quantity).toFixed(2)}` : ''}</td>
                    <td>{item ? `$${item.price.toFixed(2)}` : ''}</td>
                    <td>{item?.quantity || ''}</td>
                    <td>{item?.name || ''}</td>
                    <td>{index + 1}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Box mt={3} style={{ borderTop: '1px solid #ccc', paddingTop: '10px', direction: 'rtl', fontFamily: 'KHejar' }}>
          <Typography variant="h6"><strong>💵 پارێ هاتیە دان:</strong> ${totalPaid.toFixed(2)}</Typography>
          <Typography variant="h6"><strong>📌 پارێ مای:</strong> ${remaining.toFixed(2)}</Typography>
          <Typography variant="h6"><strong>💰 پارێ گشتی:</strong> ${totalValue.toFixed(2)}</Typography>
        </Box>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>شاش بون بوو هەردوو لا دزفریت</p>
      </div>

      <Box className="no-print" mt={4} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="info" onClick={savePdfLocally}>
          Download PDF 📄
        </Button>
        <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={() => window.print()}>
          چاپکرن
        </Button>
        <Button component={RouterLink} to={`/customer/${id}`} variant="outlined">
          زڤرین بۆ پروفایلێ
        </Button>
      </Box>
    </Container>
  );
};

export default CustomerReceipt;
