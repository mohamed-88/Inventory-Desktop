// server/routes/Payment.js
const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// GET: وەرگرتنا هەمی پارەدانێن موشتەریەکێ
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    const payments = await db('payments')
      .where({ customer_id: customerId })
      .orderBy('created_at', 'desc');
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST: زێدەکرنا پارەدانەکا نوو
router.post('/', async (req, res) => {
  try {
    const { amount, customer_id } = req.body;
    if (!amount || !customer_id) {
      return res.status(400).json({ error: "amount and customer_id are required" });
    }
    const [id] = await db('payments').insert({ amount, customer_id });
    const newPayment = await db('payments').where({ id }).first();
    res.status(201).json(newPayment);
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
