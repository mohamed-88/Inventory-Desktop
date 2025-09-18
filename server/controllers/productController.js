const db = require('../config/db'); // گرێدان ب داتابەیسا SQLite

// 1. وەرگرتنا هەمی بەرهەمان
exports.getProducts = async (req, res) => {
  try {
    const products = await db('products').select('*');
    res.status(200).json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};

// 2. زێدەکرنا بەرهەمەکێ نوو
exports.addProduct = async (req, res) => {
  try {
    // req.body دێ زانیاریێن بەرهەمێ نوو هەبن (name, quantity, price, etc.)
    const [id] = await db('products').insert(req.body);
    
    // وەرگرتنا بەرهەمێ نوو یێ زێدەکری بۆ هنارتنێ
    const newProduct = await db('products').where({ id }).first();
    
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product', details: err.message });
  }
};

// 3. گوهۆڕینا (Update) بەرهەمەکێ
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // وەرگرتنا ID ژ لینکێ (URL)
    const changes = req.body;   // وەرگرتنا گوهۆڕینێن نوو

    const count = await db('products').where({ id }).update(changes);

    if (count === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // وەرگرتنا بەرهەمێ پشتی گوهۆڕینێ
    const updatedProduct = await db('products').where({ id }).first();
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
};

// 4. ژێبرنا (Delete) بەرهەمەکێ
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // وەرگرتنا ID ژ لینکێ (URL)

    const count = await db('products').where({ id }).del();

    if (count === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
};

// 5. وەرگرتنا بەرهەمەکێ ب تنێ ب رێکا ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await db('products').where({ id }).first();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error('Error getting product by ID:', err);
        res.status(500).json({ error: 'Failed to fetch product', details: err.message });
    }
};
