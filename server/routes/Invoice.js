const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// --- GET: وەرگرتنا پسولان (دگەل فیلتەرکرنێ) ---
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;
    let query = db('invoices').select('*');

    if (customerId) {
      const id = parseInt(customerId);
      if (!isNaN(id)) {
        query = query.where('customer_id', id);
      }
    }

    const invoices = await query.orderBy('created_at', 'desc');

    // بۆ هەر پسولەکێ، ناڤێ موشتەری ژی دگەل بزڤرینە
    for (const invoice of invoices) {
      const customer = await db('customers').where({ id: invoice.customer_id }).first();
      invoice.customer = customer; // زێدەکرنا ئۆبجێکتا موشتەری
    }

    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- GET: وەرگرتنا پسولەکا ب تنێ (دگەل هەمی داتایان) ---
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await db('invoices').where({ id }).first();

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // وەرگرتنا داتایێن موشتەریێ وێ پسولێ
    const customer = await db('customers').where({ id: invoice.customer_id }).first();
    
    // وەرگرتنا هەمی ئایتمێن وێ پسولێ
    // (تێبینی: ئەڤە پێتڤی ب ستوونا 'invoice_id' د تابلۆیا 'items' دا هەیە)
    const items = await db('items').where({ invoice_id: id });

    // کومکرنا هەمی داتایان د ئێک بەرسڤ دا
    const fullInvoiceData = {
      ...invoice,
      customer: customer,
      items: items,
    };

    res.status(200).json(fullInvoiceData);

  } catch (err) {
    console.error(`Error fetching invoice ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// --- POST: زێدەکرنا پسولەکا نوو ---
router.post('/', async (req, res) => {
  try {
    const { customer_id, total_amount, items } = req.body;
    if (!customer_id || !total_amount || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. پسولێ دروست بکە
    const [invoiceId] = await db('invoices').insert({ customer_id, total_amount });

    // 2. هەر ئایتمەکێ ب پسولێ ڤە گرێدە
    for (const item of items) {
      await db('items').where({ id: item.id }).update({ invoice_id: invoiceId });
    }

    const newInvoice = await db('invoices').where({ id: invoiceId }).first();
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ error: err.message });
  }
});

// ... کردارێن PUT و DELETE دشێن پاشی بهێنە زێدەکرن ...

module.exports = router;
