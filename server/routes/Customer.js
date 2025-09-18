// server/routes/Customer.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: وەرگرتنا هەمی موشتەریان
router.get('/', async (req, res) => {
  try {
    const customers = await db('customers').select('*').orderBy('created_at', 'desc');
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: زێدەکرنا موشتەریەکێ نوو (دگەل دروستکرنا bill_number)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // 1. دیتنا بلندترین ژمارا موشتەری
    const lastCustomer = await db('customers').orderBy('id', 'desc').first();
    let newBillNumber;
    if (lastCustomer && lastCustomer.bill_number) {
      const lastNumber = parseInt(lastCustomer.bill_number, 10);
      newBillNumber = (lastNumber + 1).toString();
    } else {
      newBillNumber = '1001'; // ژمارا دەستپێکێ
    }

    // 2. دروستکرنا موشتەریێ نوو
    const [id] = await db('customers').insert({
      bill_number: newBillNumber,
      name,
      email,
      phone,
      address,
    });

    const newCustomer = await db('customers').where({ id }).first();
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: وەرگرتنا موشتەریەکێ ب تنێ
router.get('/:id', async (req, res) => {
  try {
    const customer = await db('customers').where({ id: req.params.id }).first();
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: دەستکاری کرنا موشتەری
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updated = await db('customers').where({ id: req.params.id }).update({
      name,
      email,
      phone,
      address,
    });
    if (updated) {
      const customer = await db('customers').where({ id: req.params.id }).first();
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: وەرگرتنا داتایێن پسولێ
router.get('/:id/receipt-data', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await db('customers').where({ id }).first();
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const items = await db('items').where({ customer_id: id });
    const payments = await db('payments').where({ customer_id: id });
    res.status(200).json({ customer, items, payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
