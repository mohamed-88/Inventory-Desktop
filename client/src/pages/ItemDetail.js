import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../api';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // داخوازکرنا داتایێن بتنێ ڤی ئایتمی
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setError("کێشە د وەرگرتنا داتایێن بابەتی دا چێبوو.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${item?.name || 'item'}-detail.pdf`);
    });
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" align="center" mt={5}>{error}</Typography>;
  }

  if (!item) {
    return <Typography align="center" mt={5}>ئەڤ بابەتە نەهاتە دیتن.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper id="pdf-content" elevation={3} sx={{ p: 3, mb: 3 }}>
        {/* تێبینی: بەشێ وێنەی پێتڤی ب چارەسەریەکا لۆکال هەیە */}
        {/* <img src={`http://localhost:4000${item.imageUrl}`} alt={item.name} /> */}
        <Typography variant="h4" gutterBottom>{item.name}</Typography>
        <Typography><strong>ژمارە:</strong> {item.quantity}</Typography>
        <Typography><strong>بهایێ ئێکێ:</strong> ${item.price}</Typography>
        <Typography variant="h6"><strong>بهایێ گشتی:</strong> ${(item.price * item.quantity ).toFixed(2)}</Typography>
        {/* تێبینی: پێتڤیە ناڤێ موشتەری ژی بهێتە وەرگرتن */}
        {/* <Typography>Customer: {item.customer?.name}</Typography> */}
      </Paper>
      
      <Button onClick={downloadPDF} variant="contained" sx={{ mr: 1 }}>
        Download as PDF
      </Button>
      <Button component={RouterLink} to="/" variant="outlined">
        ← Back to List
      </Button>
    </Box>
  );
};

export default ItemDetail;
