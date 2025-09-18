import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const CustomerInvoiceList = () => {
  const { customerId } = useParams(); // ناڤ گوهۆڕی بۆ روونکرنێ
  const [invoices, setInvoices] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      if (!customerId) return;
      setLoading(true);
      try {
        // بتنێ داخوازا پسولان بکە، سێرڤەر دێ ناڤێ موشتەری ژی دگەل زڤرینیت
        const invoicesRes = await api.get(`/invoices?customerId=${customerId}`);
        
        if (invoicesRes.data.length > 0) {
          // فرض دکەین سێرڤەر داتایێن موشتەری دگەل پسولا ئێکێ دزڤرینیت
          setCustomer(invoicesRes.data[0].customer); 
        }
        setInvoices(invoicesRes.data);
      } catch (err) {
        console.error('❌ Failed to load invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [customerId]);

  const exportPDF = async () => {
    const input = printRef.current;
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoices_${customer?.name || 'customer'}.pdf`);
  };

  // ... فەنکشنێن دی دشێن پاشی بهێنە راستڤەکرن ...

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <div ref={printRef}>
        <Typography variant="h4" gutterBottom>
          🧾 پسولێن بۆ {customer?.name}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <th>ژمارا پسولێ</th>
                <th>بەروار</th>
                <th>بهایێ گشتی</th>
                <th>کردار</th>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}> {/* _id هاتیە گوهۆڕین بۆ id */}
                  <TableCell>{inv.id}</TableCell> {/* یان هەر 'field'ەکێ دی */}
                  <TableCell>{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${inv.total_amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    {/* لینک هاتیە راستڤەکرن */}
                    <Button component={RouterLink} to={`/invoice/${inv.id}`} sx={{ mr: 1 }}>
                      🖨️ Print
                    </Button>
                    {/* ... دوگمەیێن دی ... */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Button onClick={exportPDF} sx={{ mt: 2 }}>
        📄 Export to PDF
      </Button>

      <Button component={RouterLink} to={`/customer/${customerId}`} sx={{ mt: 2, ml: 1 }}>
        ← Back to Customer
      </Button>
    </Box>
  );
};

export default CustomerInvoiceList;
