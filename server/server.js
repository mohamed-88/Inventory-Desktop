// =================================================================
//        کۆدێ نوو و سادەکری بۆ server/server.js
// =================================================================

// --- 1. داخوازکرنا پاکێجان ب شێوازێ ستاندارد ---
const express = require('express');
const cors = require('cors');
const path = require('path');

// --- 2. گرێدان ب داتابەیسا SQLite ---
const db = require('./config/db'); 

// --- 3. ئامادەکرنا ئەپلیکەیشنێ Express ---
const app = express();
const PORT = 4000;


// رێیێن (Routes) درست
const customerRoutes = require('./routes/Customer');
const itemRoutes = require('./routes/Item');
const invoiceRoutes = require('./routes/Invoice');
const paymentRoutes = require('./routes/Payment');


// --- 4. رێیێن (Routes) ---
// const productRoutes = require('./routes/productRoutes');
// const saleRoutes = require('./routes/saleRoutes');
// const purchaseRoutes = require('./routes/purchaseRoutes');
// const userRoutes = require('./routes/userRoutes');

// --- 5. Middleware ---
app.use(cors());
app.use(express.json());

// --- 6. کارپێکرنا سێرڤەری ---
app.listen(PORT, () => {
  console.log(`✅ سێرڤەرێ لۆکال کار دکەت لسەر http://localhost:${PORT}` );
});


app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);


// --- 7. گرێدانا API Routes ---
// app.use('/api/products', productRoutes);
// app.use('/api/sales', saleRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/users', userRoutes);

// --- 8. پەیاما خەلەتیێ یا گشتی ---
app.use((err, req, res, next) => {
  console.error('❌ کێشەیەکا نەچاوەڕێکری روودا:', err.stack);
  res.status(500).send('Tiştek xelet çû!');
});






// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const app = express();


// // ✅ Routes
// const customerRoutes = require('./routes/Customer');
// const itemRoutes = require('./routes/Item');
// const invoiceRoutes = require('./routes/Invoice'); // ✅ NEW

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/inventoryDB')
//   .then(() => {
//     console.log('✅ Connected to MongoDB');
//     app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err.message);
//   });

// // ✅ API Routes
// app.use('/api/customers', customerRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/invoices', invoiceRoutes); // ✅ Add invoice API

