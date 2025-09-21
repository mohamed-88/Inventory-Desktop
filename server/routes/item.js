// کۆدێ درست بۆ server/routes/Item.js
const { db } = require('../config/db');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;
    let query = db('items').select('*');
    if (customerId) {
      const id = parseInt(customerId);
      if (!isNaN(id)) {
        query = query.where('customer_id', id);
      }
    }
    const items = await query.orderBy('created_at', 'desc');
    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db('items').where({ id }).first();
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    console.error(`Error fetching item ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, quantity, price, customer_id } = req.body;
    if (!name || !quantity || !price || !customer_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [id] = await db('items').insert(req.body);
    const newItem = await db('items').where({ id }).first();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCount = await db('items').where({ id }).update(req.body);
    if (updatedCount > 0) {
      const updatedItem = await db('items').where({ id }).first();
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    console.error(`Error updating item ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db('items').where({ id }).del();
    if (deletedCount > 0) {
      res.status(200).json({ message: "Item deleted successfully" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    console.error(`Error deleting item ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
