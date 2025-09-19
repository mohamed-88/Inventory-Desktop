// client/src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerForm from './pages/CustomerForm';
import CustomerReceipt from './pages/CustomerReceipt';
import CustomerInvoiceList from './pages/CustomerInvoiceList';
import ItemForm from './pages/ItemForm';
import ItemDetail from './pages/ItemDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* رێکا سەرەکی */}
        <Route path="/" element={<CustomerList />} />

        {/* --- رێکێن موشتەریان --- */}
        <Route path="/customer">
          <Route path="new" element={<CustomerForm />} />
          <Route path=":id" element={<CustomerDetail />} />
          <Route path=":id/edit" element={<CustomerForm />} />
          <Route path=":id/receipt" element={<CustomerReceipt />} />
          <Route path=":id/invoices" element={<CustomerInvoiceList />} />
        </Route>

        {/* --- رێکێن ئایتمان --- */}
        <Route path="/item">
          <Route path="new" element={<ItemForm />} />
          <Route path=":itemId" element={<ItemDetail />} />
          <Route path=":itemId/edit" element={<ItemForm />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
