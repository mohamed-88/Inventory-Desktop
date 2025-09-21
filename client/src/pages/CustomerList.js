// client/src/pages/CustomerList.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // گوهورین بۆ RouterLink
import {
  Box, Button, Stack, TextField, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Pagination, CircularProgress
} from '@mui/material';
import api from '../api';

const ITEMS_PER_PAGE = 10;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error("XETA DI ÎNANA DATAYAN DE:", err);
      setError("کێشە د وەرگرتنا داتایان دا چێبوو.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const filteredCustomers = customers.filter((c) => {
    const lowerSearch = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(lowerSearch) ||
      c.phone?.toLowerCase().includes(lowerSearch) ||
      c.email?.toLowerCase().includes(lowerSearch) ||
      c.address?.toLowerCase().includes(lowerSearch) ||
      c.bill_number?.toString().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const visibleCustomers = filteredCustomers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box p={3} dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>لیستا بکرا 📋</Typography>
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          fullWidth
          placeholder="🔍 لێگەریان..."
          value={search}
          onChange={handleSearchChange}
        />
        <Button component={RouterLink} to="/customer/new" variant="contained">زێدەکرنا بکری ➕</Button>
      </Stack>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
      {error && <Typography color="error" align="center" mt={4}>{error}</Typography>}

      {!loading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ژمارا پسولێ</TableCell>
                  <TableCell>ناف</TableCell>
                  <TableCell>تەلەفۆن</TableCell>
                  <TableCell>ئیمەیڵ</TableCell>
                  <TableCell>کردار</TableCell>
                </TableRow>
              </TableHead>
              {/* ================================================= */}
              {/*           ✅ چارەسەریا خەلەتیا Whitespace           */}
              {/* ================================================= */}
              <TableBody>
                {visibleCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      هیچ ئەنجامەک نەهاتە دیتن.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.bill_number}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell dir="ltr">{c.phone}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>
                        <Button component={RouterLink} to={`/customer/${c.id}`} size="small" variant="contained">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {/* ================================================= */}
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CustomerList;
