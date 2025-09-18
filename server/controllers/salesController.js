const db = require('../config/db');

// وەرگرتنا هەمی فرۆتن
exports.getSales = async (req, res) => {
  try {
    const sales = await db('sales')
      .join('products', 'sales.product_id', '=', 'products.id')
      .select('sales.id', 'products.name as productName', 'sales.quantity', 'sales.total_price', 'sales.sale_date');
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// زێدەکرنا فرۆتنەکا نوو
exports.addSale = async (req, res) => {
  const { productId, quantity, totalPrice } = req.body;
  try {
    // کێمکرنا ژمارا بەرهەمی ژ کۆگەهێ
    await db('products').where({ id: productId }).decrement('quantity', quantity);
    
    // زێدەکرنا فرۆتنێ
    const [id] = await db('sales').insert({
      product_id: productId,
      quantity: quantity,
      total_price: totalPrice,
    });

    const newSale = await db('sales').where({ id }).first();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
